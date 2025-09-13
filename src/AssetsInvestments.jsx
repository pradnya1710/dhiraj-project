import React, { useEffect } from "react";

/**
 * AssetsInvestments
 *
 * Props:
 *  - form: object (current form state)
 *  - handleChange: function(event) -> updates form (required)
 *  - setForm: optional function to batch update form (recommended)
 */
export default function AssetsInvestments({ form, handleChange, setForm }) {
  const debtRows = [
    { label: "Savings / Liquid", key: "debt_savings" },
    { label: "FD", key: "debt_fd" },
    { label: "RD", key: "debt_rd" },
    { label: "SCSS", key: "debt_scss" },
    { label: "Sukanya Samruddhi", key: "debt_sukanya" },
    { label: "EPF", key: "debt_epf" },
    { label: "PPF", key: "debt_ppf" },
    { label: "Post Office Scheme", key: "debt_postoffice" },
    { label: "Company Fixed Deposit", key: "debt_companyfd" },
    { label: "Debentures / Bonds", key: "debt_debentures" },
    { label: "Debt Mutual Funds", key: "debt_mutualfunds" },
  ];

  const equityRows = [
    { label: "Shares", key: "equity_shares" },
    { label: "Mutual Funds", key: "equity_mutual" },
    { label: "SIP", key: "equity_sip" },
  ];

  const physicalRows = [
    { label: "Property", key: "physical_property" },
    { label: "Gold", key: "physical_gold" },
  ];

  // All rows combined
  const allRows = [...debtRows, ...equityRows, ...physicalRows];

  // Frequency options (UI)
  const freqOptions = [
    { value: "", label: "Select Frequency" },
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Half Yearly", label: "Half Yearly" },
    { value: "Yearly", label: "Yearly" },
    { value: "Single", label: "Single" }, // changed to Single
  ];

  // -------------------------
  // Helper: compute annual
  // -------------------------
  const computeAnnual = (value, freq) => {
    const v = Number(value || 0);
    if (!freq) return 0;
    const f = String(freq).toLowerCase().replace(/\s+/g, "");
    // Single = one-time => annual contribution should be 0
    if (f.includes("single")) return 0;
    if (f.includes("monthly")) return Math.round(v * 12);
    if (f.includes("quarter")) return Math.round(v * 4);
    if (f.includes("half")) return Math.round(v * 2);
    // yearly / annual = the value itself as annual
    if (f.includes("year") || f.includes("annual")) return Math.round(v);
    // if freq is a number (months), convert to yearly multiplier
    const asNum = Number(freq);
    if (!Number.isNaN(asNum) && asNum > 0) {
      const multiplier = 12 / asNum;
      return Math.round(v * multiplier);
    }
    return 0;
  };

  // -------------------------
  // Tolerant getters (form may have underscores)
  // -------------------------
  const get = (base, suffix) => {
    // prefer pattern base + suffix (e.g. debt_fd_value)
    const a = `${base}${suffix}`;
    const b = `${base}_${suffix.replace(/^_/, "")}`;
    // also check camelCase style: base + suffix with first char uppercase (e.g. debt_fdValue)
    const camelSuffix =
      suffix.replace(/^_/, "").replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    const c = `${base}${camelSuffix}`;

    if (form && Object.prototype.hasOwnProperty.call(form, a)) return form[a];
    if (form && Object.prototype.hasOwnProperty.call(form, b)) return form[b];
    if (form && Object.prototype.hasOwnProperty.call(form, c)) return form[c];
    return undefined;
  };

  // -------------------------
  // Summaries
  // -------------------------
  const sumFor = (rows, suffix) =>
    rows.reduce((acc, r) => acc + (Number(get(r.key, suffix)) || 0), 0);

  const debtAnnualTotal = sumFor(debtRows, "_annual");
  const debtCurrentTotal = sumFor(debtRows, "_current");
  const equityAnnualTotal = sumFor(equityRows, "_annual");
  const equityCurrentTotal = sumFor(equityRows, "_current");
  const physicalAnnualTotal = sumFor(physicalRows, "_annual");
  const physicalCurrentTotal = sumFor(physicalRows, "_current");

  // -------------------------
  // Effect: compute & write annual fields whenever value or freq changes
  // -------------------------
  // Build explicit dependency keys array to ensure effect triggers exactly when needed
  const deps = allRows.flatMap((r) => [
    get(r.key, "_value"),
    get(r.key, "Value"),
    get(r.key, "_freq"),
    get(r.key, "Freq"),
  ]);

  useEffect(() => {
    if (!form || typeof handleChange !== "function") return;

    const updates = {};
    let needBatchSet = false;

    allRows.forEach((r) => {
      const value = get(r.key, "_value") ?? get(r.key, "Value") ?? 0;
      const freq = get(r.key, "_freq") ?? get(r.key, "Freq") ?? "";

      const computed = computeAnnual(value, freq);

      // locate stored annual key variant, prefer underscore style
      const annualKeys = [`${r.key}_annual`, `${r.key}Annual`];

      let storedAnnual;
      let storedKey;
      for (const k of annualKeys) {
        if (form && Object.prototype.hasOwnProperty.call(form, k)) {
          storedAnnual = Number(form[k] || 0);
          storedKey = k;
          break;
        }
      }
      // if not found, use underscore variant for writing
      const writeKey = storedKey || annualKeys[0];

      if (Number(storedAnnual || 0) !== Number(computed || 0)) {
        updates[writeKey] = computed;
        needBatchSet = true;
      }
    });

    // If setForm is provided, batch update all changed annuals in one setForm call
    if (needBatchSet && typeof setForm === "function") {
      setForm((prev) => ({ ...prev, ...updates }));
      return;
    }

    // If setForm not provided, fallback to synthetic events that call handleChange
    if (needBatchSet) {
      // call handleChange for each changed key
      Object.entries(updates).forEach(([name, value]) => {
        try {
          handleChange({ target: { name, value } });
        } catch (err) {
          // if user's handleChange expects native event and fails, try setForm as last resort
          if (typeof setForm === "function") {
            setForm((prev) => ({ ...prev, [name]: value }));
          }
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // deps derived from current form values

  // -------------------------
  // Row renderer
  // -------------------------
  const rowInputs = (row) => {
    // names we use in App state (underscore style)
    const valueName = `${row.key}_value`;
    const freqName = `${row.key}_freq`;
    const currentName = `${row.key}_current`;
    const annualName = `${row.key}_annual`;

    // display tolerant values (fall back to camelCase if present)
    const displayedValue =
      form?.[valueName] ?? form?.[`${row.key}Value`] ?? ""; /* keep input controlled */
    const displayedFreq =
      form?.[freqName] ?? form?.[`${row.key}Freq`] ?? "";
    const displayedCurrent =
      form?.[currentName] ?? form?.[`${row.key}Current`] ?? "";
    const displayedAnnual =
      form?.[annualName] ?? form?.[`${row.key}Annual`] ?? "";

    return (
      <div key={row.key} className="grid grid-cols-12 gap-2 items-center">
        {/* Label */}
        <div className="col-span-3 text-sm text-gray-700">{row.label}</div>

        {/* Investment Value */}
        <div className="col-span-3">
          <input
            type="number"
            name={valueName}
            value={displayedValue}
            onChange={handleChange}
            className="input mt-1 w-full border rounded px-2 py-1 text-sm"
            placeholder="Investment Value (Rs.)"
          />
        </div>

        {/* Frequency */}
        <div className="col-span-2">
          <select
            name={freqName}
            value={displayedFreq}
            onChange={handleChange}
            className="input mt-1 w-full border rounded px-2 py-1 text-sm"
          >
            {freqOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Current Value */}
        <div className="col-span-2">
          <input
            type="number"
            name={currentName}
            value={displayedCurrent}
            onChange={handleChange}
            className="input mt-1 w-full border rounded px-2 py-1 text-sm"
            placeholder="Current Value"
          />
        </div>

        {/* Annual Value (computed) */}
        <div className="col-span-2">
          <input
            type="number"
            name={annualName}
            value={displayedAnnual}
            readOnly
            onChange={handleChange}
            className="input mt-1 w-full border rounded px-2 py-1 text-sm bg-gray-50"
            placeholder="Annual Value"
            title="Automatically computed from Investment × Frequency (Single = one-time → 0)"
          />
        </div>
      </div>
    );
  };

  // -------------------------
  // Component UI
  // -------------------------
  return (
    <div className="section-card page-break">
      {/* Debt Investments */}
      <div className="mb-6">
        <div className="text-sm font-medium bg-blue-50 p-2 rounded">
          Debt Investments
        </div>

        <div className="mt-3 space-y-3">
          {/* header */}
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-semibold">
            <div className="col-span-3">Particulars</div>
            <div className="col-span-3">Investment Value (Rs.)</div>
            <div className="col-span-2">Frequency</div>
            <div className="col-span-2">Current Value (Rs.)</div>
            <div className="col-span-2">Annual Investment Value</div>
          </div>

          {debtRows.map((row) => (
            <div key={row.key} className="pt-2 pb-2 border-b last:border-b-0">
              {rowInputs(row)}
            </div>
          ))}
        </div>

        <div className="page-break"></div>

        {/* Debt summary */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg">
            <div className="text-sm">Annual Debt Investment Value</div>
            <div className="font-bold text-right">
              ₹ {debtAnnualTotal.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg">
            <div className="text-sm">Current Debt Investment Value</div>
            <div className="font-bold text-right">
              ₹ {debtCurrentTotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Equity Investments */}
      <div className="mb-6">
        <div className="text-sm font-medium bg-pink-50 p-2 rounded">
          Equity Investments
        </div>

        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-semibold">
            <div className="col-span-3">Particulars</div>
            <div className="col-span-3">Investment Value (Rs.)</div>
            <div className="col-span-2">Frequency</div>
            <div className="col-span-2">Current Value (Rs.)</div>
            <div className="col-span-2">Annual Investment Value</div>
          </div>

          {equityRows.map((row) => (
            <div key={row.key} className="pt-2 pb-2 border-b last:border-b-0">
              {rowInputs(row)}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 rounded-lg">
            <div className="text-sm">Annual Equity Investment Value</div>
            <div className="font-bold text-right">
              ₹ {equityAnnualTotal.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-400 to-red-500 text-white p-3 rounded-lg">
            <div className="text-sm">Current Equity Investment Value</div>
            <div className="font-bold text-right">
              ₹ {equityCurrentTotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Physical Assets */}
      <div className="mb-6">
        <div className="text-sm font-medium bg-yellow-50 p-2 rounded">
          Physical Assets
        </div>

        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-semibold">
            <div className="col-span-3">Particulars</div>
            <div className="col-span-3">Investment Value (Rs.)</div>
            <div className="col-span-2">Frequency</div>
            <div className="col-span-2">Current Value (Rs.)</div>
            <div className="col-span-2">Annual Investment Value</div>
          </div>

          {physicalRows.map((row) => (
            <div key={row.key} className="pt-2 pb-2 border-b last:border-b-0">
              {rowInputs(row)}
            </div>
          ))}
        </div>

        {/* Physical summary */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-3 rounded-lg">
            <div className="text-sm">Annual Physical Assets Value</div>
            <div className="font-bold text-right">
              ₹ {physicalAnnualTotal.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-3 rounded-lg">
            <div className="text-sm">Current Physical Assets Value</div>
            <div className="font-bold text-right">
              ₹ {physicalCurrentTotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
