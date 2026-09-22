import { supabase } from "../supabase";

async function attachProfiles(handovers) {
  const profileIds = [
    ...new Set(
      handovers.flatMap((handover) =>
        [
          handover.handed_over_by,
          handover.received_by,
        ].filter(Boolean)
      )
    ),
  ];

  if (profileIds.length === 0) {
    return handovers;
  }

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", profileIds);

  if (error) {
    console.error(
      "Failed to fetch handover profiles:",
      error
    );

    throw error;
  }

  const profileMap = new Map(
    (profiles || []).map((profile) => [
      profile.id,
      profile,
    ])
  );

  return handovers.map((handover) => ({
    ...handover,
    handed_over_profile:
      profileMap.get(handover.handed_over_by) || null,
    received_by_profile:
      profileMap.get(handover.received_by) || null,
  }));
}

export async function getUnreadReceivedHandovers({
  hotelId,
  userId,
}) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
    .from("shift_handovers")
    .select(`
      id,
      hotel_id,
      handed_over_by,
      received_by,
      notes,
      created_at,
      read_at
    `)
    .eq("hotel_id", hotelId)
    .is("read_at", null)
    .neq("handed_over_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "Failed to fetch unread handovers:",
      error
    );

    throw error;
  }

  return attachProfiles(data || []);
}

export async function getRecentShiftHandovers(hotelId) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  const { data, error } = await supabase
    .from("shift_handovers")
    .select(`
      id,
      hotel_id,
      handed_over_by,
      received_by,
      notes,
      created_at,
      read_at
    `)
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(
      "Failed to fetch recent handovers:",
      error
    );

    throw error;
  }

  return attachProfiles(data || []);
}

export async function getUnreadReceivedHandoverCount({
  hotelId,
  userId,
}) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const { count, error } = await supabase
    .from("shift_handovers")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("hotel_id", hotelId)
    .is("read_at", null)
    .neq("handed_over_by", userId);

  if (error) {
    console.error(
      "Failed to fetch unread handover count:",
      error
    );

    throw error;
  }

  return count || 0;
}

export async function createShiftHandover({
  hotelId,
  userId,
  notes,
}) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!notes?.trim()) {
    throw new Error("Handover notes are required");
  }

  const { data, error } = await supabase
    .from("shift_handovers")
    .insert({
      hotel_id: hotelId,
      handed_over_by: userId,
      notes: notes.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to create shift handover:",
      error
    );

    throw error;
  }

  return data;
}

export async function markShiftHandoverAsRead({
  handoverId,
  userId,
}) {
  if (!handoverId) {
    throw new Error("Handover ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
    .from("shift_handovers")
    .update({
      received_by: userId,
      read_at: new Date().toISOString(),
    })
    .eq("id", handoverId)
    .is("read_at", null)
    .neq("handed_over_by", userId)
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to mark handover as read:",
      error
    );

    throw error;
  }

  return data;
}

export async function deleteShiftHandover({
  handoverId,
  userId,
}) {
  if (!handoverId) {
    throw new Error("Handover ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const { error } = await supabase
    .from("shift_handovers")
    .delete()
    .eq("id", handoverId)
    .eq("handed_over_by", userId)
    .is("read_at", null);

  if (error) {
    console.error(
      "Failed to delete shift handover:",
      error
    );

    throw error;
  }
}