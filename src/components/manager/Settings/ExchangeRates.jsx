import { useEffect, useState } from "react";
import {
  getRates,
  updateRate,
  createRate,
  deleteRate
} from "../../../lib/statistics/exchangeRates";
import {ArrowBigRight} from "lucide-react";

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [inputs, setInputs] = useState({});
  const [originals, setOriginals] = useState({});
  const [newRate, setNewRate] = useState({
    currency: "",
    value: ""
  });
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchRates();
  }, []);

  async function fetchRates() {
    const data = await getRates();
    setRates(data);

    const inputMap = {};
    const originalMap = {};

    data.forEach(r => {
      const display = (1 / r.rate).toFixed(2);
      inputMap[r.id] = display;
      originalMap[r.id] = display;
    });

    setInputs(inputMap);
    setOriginals(originalMap);
  }

  function toStored(value) {
    const num = parseFloat(value);
    if (!num || num <= 0) return null;
    return 1 / num;
  }

  function handleChange(id, value) {
    setInputs(prev => ({
      ...prev,
      [id]: value
    }));
  }

  async function handleUpdate(id) {
    const value = inputs[id];
    const stored = toStored(value);

    if (!stored) return;

    try {
      setLoadingId(id);

      await updateRate(id, stored);

      // update local state
      setRates(prev =>
        prev.map(r =>
          r.id === id ? { ...r, rate: stored } : r
        )
      );

      // reset dirty state
      setOriginals(prev => ({
        ...prev,
        [id]: value
      }));
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id) {
    await deleteRate(id);
    setRates(prev => prev.filter(r => r.id !== id));

    setInputs(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setOriginals(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  async function handleAdd() {
    if (!newRate.currency || !newRate.value) return;

    const stored = toStored(newRate.value);
    if (!stored) return;

    const created = await createRate({
      from_currency: "DZD",
      to_currency: newRate.currency.toUpperCase(),
      rate: stored
    });

    const display = newRate.value;

    setRates(prev => [...prev, created]);

    setInputs(prev => ({
      ...prev,
      [created.id]: display
    }));

    setOriginals(prev => ({
      ...prev,
      [created.id]: display
    }));

    setNewRate({ currency: "", value: "" });
  }

  return (
    <div className="border p-6 rounded-2xl space-y-4 dark:border-gray-400">
      <h2 className="text-lg font-semibold">
        Exchange Rates
      </h2>

      {rates.map(r => {
        const isDirty =
          inputs[r.id] !== originals[r.id];

        return (
          <div
            key={r.id}
            className="flex items-center gap-2"
          >
            <span className="w-16">
              {r.to_currency}
            </span>

            <ArrowBigRight className="text-zinc-500" size={20} />

            <input
              type="number"
              value={inputs[r.id] || ""}
              onChange={e =>
                handleChange(r.id, e.target.value)
              }
              className="w-32 dark:scheme-dark focus:ring-1 focus:outline-none rounded"
            />

            <span>DZD</span>

            {isDirty && (
              <button
                onClick={() => handleUpdate(r.id)}
                disabled={loadingId === r.id}
                className="bg-green-500 px-3 py-1 hover:bg-green-600 cursor-pointer text-white rounded"
              >
                {loadingId === r.id
                  ? "Saving..."
                  : "Update"}
              </button>
            )}

            <button
              onClick={() => handleDelete(r.id)}
              className="text-red-500 border border-red-500 px-3 py-1 hover:bg-red-500 hover:text-white cursor-pointer rounded "
            >
              Delete
            </button>
          </div>
        );
      })}

      {/* Add */}
      <div className="flex items-center gap-2 pt-4 border-t border-zinc-700">
        <input
          placeholder="USD"
          value={newRate.currency}
          onChange={e =>
            setNewRate(prev => ({
              ...prev,
              currency: e.target.value.toUpperCase()
            }))
          }
          className="w-16"
        />

        <ArrowBigRight className="text-zinc-500" size={20} />

        <input
          type="number"
          placeholder="0.00"
          value={newRate.value}
          onChange={e =>
            setNewRate(prev => ({
              ...prev,
              value: e.target.value
            }))
          }
          className="w-32 dark:scheme-dark focus:ring-1 focus:outline-none rounded"
        />

        <span>DZD</span>

        <button
          onClick={handleAdd}
          className="bg-green-500 px-3 py-1 text-white hover:bg-green-600 cursor-pointer rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}