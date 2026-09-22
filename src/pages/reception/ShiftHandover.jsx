import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Clock,
  FileText,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useHotel } from "../../auth/HotelContext";
import {
  createShiftHandover,
  deleteShiftHandover,
  getRecentShiftHandovers,
  getUnreadReceivedHandovers,
  markShiftHandoverAsRead,
} from "../../lib/receptionist/shiftHandovers";

function formatDateTime(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Algiers",
  }).format(new Date(date));
}

function HandoverCard({
  handover,
  userId,
  actionLoading,
  onMarkAsRead,
  onDelete,
}) {
  const isCreator = handover.handed_over_by === userId;
  const isRead = Boolean(handover.read_at);

  const creatorName =
    handover.handed_over_profile?.full_name ||
    "Unknown receptionist";

  const receiverName =
    handover.received_by_profile?.full_name ||
    "Receptionist";

  return (
    <div
      className={`rounded-2xl border bg-white p-6 dark:bg-zinc-900 ${
        isRead
          ? "border-zinc-200 dark:border-zinc-700"
          : "border-amber-300 dark:border-amber-700"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {/* People */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <User size={16} />
              {creatorName}
            </div>

            <span className="text-zinc-300 dark:text-zinc-600">
              →
            </span>

            {isRead ? (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Check size={16} />
                Read by {receiverName}
              </div>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Unread
              </span>
            )}
          </div>

          {/* Dates */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock size={14} />

            <span>
              Created {formatDateTime(handover.created_at)}
            </span>

            {isRead && (
              <>
                <span>•</span>

                <span>
                  Read {formatDateTime(handover.read_at)}
                </span>
              </>
            )}
          </div>

          {/* Notes */}
          <div className="whitespace-pre-wrap rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {handover.notes}
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0">
          {!isRead && isCreator && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => onDelete(handover)}
              className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}

          {!isRead && !isCreator && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => onMarkAsRead(handover)}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Check size={16} />
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShiftHandover() {
  const { user } = useAuth();
  const { hotelId } = useHotel();

  const [unreadHandovers, setUnreadHandovers] = useState([]);
  const [recentHandovers, setRecentHandovers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notes, setNotes] = useState("");

  const loadHandovers = useCallback(async () => {
    if (!hotelId || !user?.id) return;

    try {
      setLoading(true);
      setError("");

      const [unread, recent] = await Promise.all([
        getUnreadReceivedHandovers({
          hotelId,
          userId: user.id,
        }),
        getRecentShiftHandovers(hotelId),
      ]);

      setUnreadHandovers(unread);
      setRecentHandovers(recent);
    } catch (err) {
      console.error(
        "Failed to load shift handovers:",
        err
      );

      setError(
        err.message || "Failed to load shift handovers"
      );
    } finally {
      setLoading(false);
    }
  }, [hotelId, user?.id]);

  useEffect(() => {
    loadHandovers();
  }, [loadHandovers]);

  async function handleCreate() {
    if (!notes.trim()) {
      setError("Please enter handover notes");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await createShiftHandover({
        hotelId,
        userId: user?.id,
        notes,
      });

      setNotes("");
      setShowCreateForm(false);

      await loadHandovers();
    } catch (err) {
      console.error(
        "Failed to create handover:",
        err
      );

      setError(
        err.message || "Failed to create handover"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMarkAsRead(handover) {
    if (!user?.id) return;

    if (handover.handed_over_by === user.id) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await markShiftHandoverAsRead({
        handoverId: handover.id,
        userId: user.id,
      });

      await loadHandovers();
    } catch (err) {
      console.error(
        "Failed to mark handover as read:",
        err
      );

      setError(
        err.message || "Failed to mark handover as read"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(handover) {
    if (!user?.id) return;

    if (handover.handed_over_by !== user.id) {
      return;
    }

    if (handover.read_at) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this handover?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await deleteShiftHandover({
        handoverId: handover.id,
        userId: user.id,
      });

      await loadHandovers();
    } catch (err) {
      console.error(
        "Failed to delete handover:",
        err
      );

      setError(
        err.message || "Failed to delete handover"
      );
    } finally {
      setActionLoading(false);
    }
  }

  /*
   * Recent handovers can overlap with unread handovers.
   * Remove those IDs from the recent section so the same
   * handover isn't displayed twice.
   */
  const unreadIds = new Set(
    unreadHandovers.map((handover) => handover.id)
  );

  const filteredRecentHandovers = recentHandovers.filter(
    (handover) => !unreadIds.has(handover.id)
  );

  return (
    <div className="flex min-h-full flex-col p-8 pt-16 pl-16">
      <div className="mx-auto w-[95%] max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
              Shift Handover
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Pass important information to the next receptionist
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCreateForm(true);
              setError("");
            }}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus size={18} />
            New Handover
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Create form */}
        {showCreateForm && (
          <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                Create Handover
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Add anything the next receptionist needs to know.
              </p>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write handover notes..."
              rows={7}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNotes("");
                  setError("");
                }}
                className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleCreate}
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {actionLoading
                  ? "Saving..."
                  : "Create Handover"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
            Loading handovers...
          </div>
        ) : (
          <>
            {/* Unread */}
            {unreadHandovers.length > 0 && (
              <section className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    Unread Handovers
                  </h2>

                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    {unreadHandovers.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {unreadHandovers.map((handover) => (
                    <HandoverCard
                      key={handover.id}
                      handover={handover}
                      userId={user?.id}
                      actionLoading={actionLoading}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recent */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  Recent Handovers
                </h2>
              </div>

              {filteredRecentHandovers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <FileText
                    size={32}
                    className="mx-auto mb-3 text-zinc-400"
                  />

                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    No recent handovers
                  </p>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Create a handover when you need to pass
                    information to the next receptionist.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecentHandovers.map((handover) => (
                    <HandoverCard
                      key={handover.id}
                      handover={handover}
                      userId={user?.id}
                      actionLoading={actionLoading}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}