import React, { useEffect, useState } from "react";

// Helper to format INR
const fmtINR = (n) =>
  "₹ " +
  (Number(n || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function Page5({ form, handleChange, setForm }) {
  // Local state so we only sync liabilities when user edits them here
  const [liabilitiesTouched, setLiabilitiesTouched] = useState(false);

  // --- Calculations (derived values) ---
  // totalPhysicalInvestment (this field kept for backward compatibility if used elsewhere)
  const totalPhysicalInvestment = Number(form.physicalInvestment || 0);
  const totalPhysicalCurrent = Number(form.physicalCurrent || 0);

  // Annual fields for insurance (these are still used for insurance specifically)
  const annualInsuranceInvestment =
    Number(form.endowmentAnnual || 0) +
    Number(form.moneybackAnnual || 0) +
    Number(form.ulipAnnual || 0);

  const currentInsuranceValue =
    Number(form.endowmentCurrent || 0) +
    Number(form.moneybackCurrent || 0) +
    Number(form.ulipCurrent || 0);

  // NOTE: use distinct keys for outstanding amounts to avoid collisions with monthly/EMI fields.
  // These are the keys used by inputs in this file:
  // vehicleLoanOutstanding, personalLoanOutstanding, consumerLoanOutstanding,
  // homeLoanOutstanding, creditCardOutstanding, otherLoanOutstanding
  const totalLiabilities =
    Number(form.vehicleLoanOutstanding || 0) +
    Number(form.personalLoanOutstanding || 0) +
    Number(form.consumerLoanOutstanding || 0) +
    Number(form.homeLoanOutstanding || 0) +
    Number(form.creditCardOutstanding || 0) +
    Number(form.otherLoanOutstanding || 0);

  // -------------------------
  // Grand totals across the entire form
  // Sum all annual* and current* fields (supports both underscore and camelCase variants)
  // -------------------------
  const sumFormByPattern = (pattern) => {
    if (!form || typeof form !== "object") return 0;
    const keys = Object.keys(form);
    return keys.reduce((acc, k) => {
      if (pattern.test(k)) {
        const v = Number(form[k] || 0);
        if (!Number.isNaN(v)) return acc + v;
      }
      return acc;
    }, 0);
  };

  // regex for annual keys: matches "..._annual", "...Annual", "...annual"
  const annualPattern = /(_?annual|Annual)$/;
  // regex for current keys: matches "..._current", "...Current", "...current"
  const currentPattern = /(_?current|Current)$/;

  const totalAnnualAcrossAll = sumFormByPattern(annualPattern);
  const totalCurrentAcrossAll = sumFormByPattern(currentPattern);

  // Also provide backwards-compatible "totalInvestmentValue" used earlier: use totalAnnualAcrossAll
  const totalInvestmentValue = totalAnnualAcrossAll;
  const totalCurrentInvestment = totalCurrentAcrossAll;

  // Push liabilitiesTotal into form only when user edited liabilities on this page
  useEffect(() => {
    if (!liabilitiesTouched) return;

    setForm((prev) => {
      const prevVal = Number(prev.liabilitiesTotal || 0);
      if (prevVal === Number(totalLiabilities || 0)) return prev;
      return {
        ...prev,
        liabilitiesTotal: totalLiabilities,
      };
    });
  }, [totalLiabilities, setForm, liabilitiesTouched]);

  // Auto-calculate policy annual amounts based on Investment + Frequency
  useEffect(() => {
    const computeAnnual = (investment, freq) => {
      const inv = Number(investment || 0);
      const f = (freq || "").toString().toLowerCase().replace(/\s+/g, "");
      // Single (one-time) -> annual contribution should be 0
      if (f.includes("single")) return 0;
      if (f.includes("monthly")) return inv * 12;
      if (f.includes("quarter")) return inv * 4;
      if (f.includes("half")) return inv * 2;
      if (f.includes("year") || f.includes("annual")) return inv;
      return 0;
    };

    const endowmentAnnualCalc = computeAnnual(
      form.endowmentInvestment,
      form.endowmentFreq
    );
    const moneybackAnnualCalc = computeAnnual(
      form.moneybackInvestment,
      form.moneybackFreq
    );
    const ulipAnnualCalc = computeAnnual(form.ulipInvestment, form.ulipFreq);

    const needUpdate =
      Number(form.endowmentAnnual || 0) !== endowmentAnnualCalc ||
      Number(form.moneybackAnnual || 0) !== moneybackAnnualCalc ||
      Number(form.ulipAnnual || 0) !== ulipAnnualCalc;

    if (needUpdate) {
      setForm((prev) => ({
        ...prev,
        endowmentAnnual: endowmentAnnualCalc,
        moneybackAnnual: moneybackAnnualCalc,
        ulipAnnual: ulipAnnualCalc,
      }));
    }
  }, [
    form.endowmentInvestment,
    form.endowmentFreq,
    form.endowmentAnnual,
    form.moneybackInvestment,
    form.moneybackFreq,
    form.moneybackAnnual,
    form.ulipInvestment,
    form.ulipFreq,
    form.ulipAnnual,
    setForm,
  ]);

  // Also store totalInvestmentValue in form so other pages can use it (keeps compatibility)
  useEffect(() => {
    setForm((prev) => {
      const prevTotal = Number(prev.totalInvestmentValue || 0);
      if (prevTotal === Number(totalInvestmentValue || 0)) return prev;
      return { ...prev, totalInvestmentValue };
    });
  }, [
    totalInvestmentValue,
    setForm,
    // include dependencies that affect totalInvestmentValue
    form.physicalInvestment,
    form.endowmentAnnual,
    form.moneybackAnnual,
    form.ulipAnnual,
  ]);

  // Wrapper onChange for liabilities inputs so we mark that liabilities were edited here
  const handleLiabilityChange = (e) => {
    setLiabilitiesTouched(true);
    // We forward the event — parent handleChange should update form[key] appropriately.
    handleChange(e);
  };

  return (
    <div className="space-y-6">
      <div className="page-break"></div>

      {/* Insurance Policies */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-semibold text-lg mb-3">Insurance Policies</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Particulars</th>
              <th className="border p-2">Investment Value (₹)</th>
              <th className="border p-2">Frequency</th>
              <th className="border p-2">Current Value (₹)</th>
              <th className="border p-2">Annual Investment Value (Computed)</th>
            </tr>
          </thead>
          <tbody>
            {["Endowment", "Moneyback", "ULIP"].map((policy) => {
              const key = policy.toLowerCase();
              return (
                <tr key={policy}>
                  <td className="border p-2">{policy} Policy</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name={`${key}Investment`}
                      value={form[`${key}Investment`] || ""}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <select
                      name={`${key}Freq`}
                      value={form[`${key}Freq`] || ""}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    >
                      <option value="">Select</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Half Yearly">Half Yearly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Single">Single</option>
                    </select>
                  </td>

                  <td className="border p-2">
                    <input
                      type="number"
                      name={`${key}Current`}
                      value={form[`${key}Current`] || ""}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name={`${key}Annual`}
                      value={
                        form[`${key}Annual`] !== undefined ? form[`${key}Annual`] : ""
                      }
                      readOnly
                      onChange={handleChange}
                      className="w-full border rounded p-1 bg-gray-50"
                      title="Automatically computed from Investment × Frequency (Single = one-time → 0)"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insurance Policies Summary */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-semibold text-lg mb-3">Insurance Policies Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <SummaryCard
            label="Annual Insurance Investment Value"
            value={fmtINR(annualInsuranceInvestment)}
            color="bg-cyan-600"
          />
          <SummaryCard
            label="Current Insurance Policies Value"
            value={fmtINR(currentInsuranceValue)}
            color="bg-cyan-700"
          />
        </div>
      </div>

      {/* Grand Total Summary */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-semibold text-lg mb-3">Grand Total Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <SummaryCard
            label="Total Annual Investment Value (All Assets)"
            value={fmtINR(totalAnnualAcrossAll)}
            color="bg-blue-700"
          />
          <SummaryCard
            label="Total Current Value of Investments (All Assets)"
            value={fmtINR(totalCurrentAcrossAll)}
            color="bg-blue-800"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Liabilities */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="font-semibold text-lg mb-3">Liabilities</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Outstanding Amount (₹)</th>
                <th className="border p-2 text-left">Closure Year</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: "vehicleLoanOutstanding", label: "Total Outstanding Vehicle Loan" },
                { key: "personalLoanOutstanding", label: "Total Outstanding Personal Loan" },
                { key: "consumerLoanOutstanding", label: "Total Outstanding Consumer Loan" },
                { key: "homeLoanOutstanding", label: "Total Outstanding Home Loan" },
                { key: "creditCardOutstanding", label: "Total Outstanding Credit Card Due" },
                { key: "otherLoanOutstanding", label: "Total Outstanding (Others)" },
              ].map((item) => (
                <tr key={item.key}>
                  <td className="border p-2">{item.label}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name={item.key}
                      value={form[item.key] || ""}
                      // Use wrapper that marks liabilities as edited from this page
                      onChange={handleLiabilityChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name={`${item.key}Year`}
                      value={form[`${item.key}Year`] || ""}
                      onChange={handleLiabilityChange}
                      className="w-full border rounded p-1"
                      placeholder="Year"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Liabilities */}
          <div className="bg-pink-600 text-white text-lg font-semibold rounded-md mt-4 p-3 flex justify-between">
            <span>Total Liabilities</span>
            <span>{fmtINR(totalLiabilities)}</span>
          </div>

          {!liabilitiesTouched && (
            <div className="text-sm text-gray-600 mt-2">
              Tip: Outstanding fields here use distinct keys (e.g. <code>vehicleLoanOutstanding</code>) to avoid collision
              with monthly EMI / income keys used elsewhere.
            </div>
          )}
        </div>
      </div>

      {/* Current Insurance Coverage */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-semibold text-lg mb-3">Current Insurance Coverage</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Particulars</th>
              <th className="border p-2">Sum Assured (₹)</th>
            </tr>
          </thead>
          <tbody>
            {["Health Insurance", "Term Insurance"].map((ins) => (
              <tr key={ins}>
                <td className="border p-2">{ins}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    name={ins.toLowerCase().replace(" ", "")}
                    value={form[ins.toLowerCase().replace(" ", "")] || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Summary Card Component
const SummaryCard = ({ label, value, color }) => (
  <div className={`${color} text-white rounded-lg p-4 text-center`}>
    <div className="text-sm font-medium">{label}</div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);
