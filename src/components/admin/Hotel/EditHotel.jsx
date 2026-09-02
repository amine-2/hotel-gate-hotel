import { useEffect, useState } from "react";
import { useHotel } from "../../../auth/HotelContext";
import { updateHotelInfo } from "../../../lib/hotel/updateHotelInfo";

import HotelGeneralForm from "./HotelGeneralForm";
import HotelLocationForm from "./HotelLocationForm";
import HotelDetailsForm from "./HotelDetailsForm";
import HotelFacilitiesManager from "./HotelFacilitiesManager";
import HotelImagesManager from "./HotelImagesManager";

const LANGUAGES = ["en", "fr", "ar"];

const emptyTranslations = {
  en: "",
  fr: "",
  ar: "",
};

export default function EditHotel({
  hotel,
  onCancel,
  onSaved,
  onHotelUpdated,
}) {
  const { hotelId } = useHotel();

  const [language, setLanguage] = useState("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: { ...emptyTranslations },
    description: { ...emptyTranslations },

    location: {
      city: { ...emptyTranslations },
      state: "",
      address: { ...emptyTranslations },
      country: "",
      latitude: "",
      longitude: "",
      postalCode: "",
    },

    rating: "",
    min_price: "",
    discount: "",
    rooms_number: "",
  });

  useEffect(() => {
    if (!hotel) return;

    setForm({
      name: {
        en: hotel.name?.en || "",
        fr: hotel.name?.fr || "",
        ar: hotel.name?.ar || "",
      },

      description: {
        en: hotel.description?.en || "",
        fr: hotel.description?.fr || "",
        ar: hotel.description?.ar || "",
      },

      location: {
        city: {
          en: hotel.location?.city?.en || "",
          fr: hotel.location?.city?.fr || "",
          ar: hotel.location?.city?.ar || "",
        },

        state: hotel.location?.state || "",

        address: {
          en: hotel.location?.address?.en || "",
          fr: hotel.location?.address?.fr || "",
          ar: hotel.location?.address?.ar || "",
        },

        country: hotel.location?.country || "",
        latitude: hotel.location?.latitude ?? "",
        longitude: hotel.location?.longitude ?? "",
        postalCode: hotel.location?.postalCode || "",
      },

      rating: hotel.rating ?? "",
      min_price: hotel.min_price || "",
      discount: hotel.discount || "",
      rooms_number: hotel.rooms_number ?? "",
    });
  }, [hotel]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateTranslation(section, language, value) {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [language]: value,
      },
    }));
  }

  function updateLocationField(field, value) {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  }

  function updateLocationTranslation(section, language, value) {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [section]: {
          ...prev.location[section],
          [language]: value,
        },
      },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!hotelId) {
      setError("Hotel ID is missing.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: {
        en: form.name.en,
        fr: form.name.fr,
        ar: form.name.ar,
      },

      description: {
        en: form.description.en,
        fr: form.description.fr,
        ar: form.description.ar,
      },

      location: {
        city: {
          en: form.location.city.en,
          fr: form.location.city.fr,
          ar: form.location.city.ar,
        },

        state: form.location.state,

        address: {
          en: form.location.address.en,
          fr: form.location.address.fr,
          ar: form.location.address.ar,
        },

        country: form.location.country,
        latitude:
          form.location.latitude === ""
            ? null
            : Number(form.location.latitude),
        longitude:
          form.location.longitude === ""
            ? null
            : Number(form.location.longitude),
        postalCode: form.location.postalCode,
      },

      rating:
        form.rating === "" ? 0 : Number(form.rating),

      min_price: form.min_price,
      discount: form.discount,

      rooms_number:
        form.rooms_number === ""
          ? 0
          : Number(form.rooms_number),
    };

    const { data, error } = await updateHotelInfo(
      hotelId,
      payload
    );

    if (error) {
      console.error("Failed to update hotel:", error);
      setError(error.message || "Failed to update hotel.");
      setSaving(false);
      return;
    }

    setSaving(false);

    onSaved?.(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Edit Hotel
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your hotel's information.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700/50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600 cursor-pointer"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <HotelGeneralForm
        name={form.name}
        description={form.description}
        language={language}
        setLanguage={setLanguage}
        onTranslationChange={updateTranslation}
      />

      <HotelLocationForm
        location={form.location}
        language={language}
        setLanguage={setLanguage}
        onFieldChange={updateLocationField}
        onTranslationChange={updateLocationTranslation}
      />

      <HotelFacilitiesManager
        hotelId={hotelId}
      />

      <HotelImagesManager
        hotel={hotel}
        hotelId={hotelId}
        onHotelUpdated={onHotelUpdated}
      />

      <HotelDetailsForm
        rating={form.rating}
        min_price={form.min_price}
        discount={form.discount}
        rooms_number={form.rooms_number}
        onFieldChange={updateField}
      />
    </form>
  );
}