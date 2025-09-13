// src/Page5.jsx
import React, { useEffect } from "react";

// Helper to format INR
const fmtINR = (n) =>
  "₹ " +
  (Number(n || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function Page5({ form, handleChange, setForm }) {
  // --- Calculations (derived values) ---
  const totalPhysicalInvestment = Number(form.physicalInvestment || 0);
  const totalPhysicalCurrent = Number(form.physicalCurrent || 0);

  // Annual fields (these will be filled automatically by useEffect below)
  const annualInsuranceInvestment =
    Number(form.endowmentAnnual || 0) +
    Number(form.moneybackAnnual || 0) +
    Number(form.ulipAnnual || 0);

  const currentInsuranceValue =
    Number(form.endowmentCurrent || 0) +
    Number(form.moneybackCurrent || 0) +
    Number(form.ulipCurrent || 0);

  const totalLiabilities =
    Number(form.vehicleLoan || 0) +
    Number(form.personalLoan || 0) +
    Number(form.consumerLoan || 0) +
    Number(form.homeLoan || 0) +
    Number(form.creditCard || 0) +
    Number(form.otherLoan || 0);

  const totalInvestmentValue = totalPhysicalInvestment + annualInsuranceInvestment;

  const totalCurrentInvestment = totalPhysicalCurrent + currentInsuranceValue;

  // ✅ Push liabilities into form so Page6 can use them
  useEffect(() => {
    setForm((prev) => {
      // Only update if different to avoid unnecessary renders
      if (Number(prev.liabilitiesTotal || 0) === Number(totalLiabilities || 0)) {
        return prev;
      }
      return {
        ...prev,
        liabilitiesTotal: totalLiabilities,
      };
    });
  }, [totalLiabilities, setForm]);

  // Auto-calculate policy annual amounts based on Investment + Frequency
  useEffect(() => {
    const computeAnnual = (investment, freq) => {
      const inv = Number(investment || 0);
      // Match the select option strings you're using exactly:
      switch ((freq || "").toLowerCase()) {
        case "monthly":
          return inv * 12;
        case "quarterly":
          return inv * 4;
        case "half yearly":
          return inv * 2;
        case "single yearly":
          return inv;
        // accept some tolerant variants too
        case "half-yearly":
        case "halfyearly":
          return inv * 2;
        case "yearly":
        case "annual":
          return inv;
        default:
          return 0;
      }
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

    // Only update if any computed annual differs from stored value
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

  // Also store totalInvestmentValue in form so other pages can use it
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
                      <option value="Single Yearly">Single Yearly</option>
                      <option value="Half Yearly">Half Yearly</option>
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
                    {/* Annual is computed automatically — show as readOnly so users can't accidentally diverge */}
                    <input
                      type="number"
                      name={`${key}Annual`}
                      value={form[`${key}Annual`] !== undefined ? form[`${key}Annual`] : ""}
                      readOnly
                      onChange={handleChange} // harmless if readOnly
                      className="w-full border rounded p-1 bg-gray-50"
                      title="Automatically computed from Investment × Frequency"
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
            label="Total Annual Investment Value"
            value={fmtINR(totalInvestmentValue)}
            color="bg-blue-700"
          />
          <SummaryCard
            label="Total Current Value of Investments"
            value={fmtINR(totalCurrentInvestment)}
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
                <th className="border p-2 text-left">Amount in Rs.</th>
                <th className="border p-2 text-left">Closure Year</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: "vehicleLoan", label: "Total Outstanding Vehicle Loan" },
                { key: "personalLoan", label: "Total Outstanding Personal Loan" },
                { key: "consumerLoan", label: "Total Outstanding Consumer Loan" },
                { key: "homeLoan", label: "Total Outstanding Home Loan" },
                { key: "creditCard", label: "Total Outstanding Credit Card Due" },
                { key: "otherLoan", label: "Total Outstanding (Others)" },
              ].map((item) => (
                <tr key={item.key}>
                  <td className="border p-2">{item.label}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name={item.key}
                      value={form[item.key] || ""}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name={`${item.key}Year`}
                      value={form[`${item.key}Year`] || ""}
                      onChange={handleChange}
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
