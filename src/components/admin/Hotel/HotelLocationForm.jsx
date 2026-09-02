const LANGUAGES = ["en", "fr", "ar"];

export default function HotelLocationForm({
  location,
  language,
  setLanguage,
  onFieldChange,
  onTranslationChange,
}) {
  return (
    <section className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:text-white dark:border-gray-700">
      <SectionHeader
        title="Location"
        description="Manage the hotel's address and geographical information."
      />

      <LanguageTabs
        language={language}
        setLanguage={setLanguage}
      />

      <div className="space-y-5">
        <Field
          label="City"
          value={location.city[language]}
          onChange={(value) =>
            onTranslationChange(
              "city",
              language,
              value
            )
          }
          dir={language === "ar" ? "rtl" : "ltr"}
        />

        <Field
          label="Address"
          value={location.address[language]}
          onChange={(value) =>
            onTranslationChange(
              "address",
              language,
              value
            )
          }
          dir={language === "ar" ? "rtl" : "ltr"}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="State"
            value={location.state}
            onChange={(value) =>
              onFieldChange("state", value)
            }
          />

          <Field
            label="Country"
            value={location.country}
            onChange={(value) =>
              onFieldChange("country", value)
            }
          />

          <Field
            label="Postal Code"
            value={location.postalCode}
            onChange={(value) =>
              onFieldChange("postalCode", value)
            }
          />

          <Field
            label="Latitude"
            type="number"
            step="any"
            value={location.latitude}
            onChange={(value) =>
              onFieldChange("latitude", value)
            }
          />

          <Field
            label="Longitude"
            type="number"
            step="any"
            value={location.longitude}
            onChange={(value) =>
              onFieldChange("longitude", value)
            }
          />
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function LanguageTabs({ language, setLanguage }) {
  return (
    <div className="mb-5 flex gap-2 border-b pb-3">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded-md px-3 py-1.5 text-sm ${
            language === lang
              ? "bg-black text-white dark:bg-orange-500"
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
          }`}
        >
          {lang === "en"
            ? "English"
            : lang === "fr"
            ? "Français"
            : "العربية"}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
        {...props}
      />
    </div>
  );
}