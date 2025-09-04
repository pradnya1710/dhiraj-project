// src/Page5.jsx
import React, { useEffect } from "react";

// Helper to format INR
const fmtINR = (n) =>
  "₹ " +
  (Number(n || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function Page5({ form, handleChange, setForm }) {
  // --- Calculations ---
  const totalPhysicalInvestment = Number(form.physicalInvestment || 0);
  const totalPhysicalCurrent = Number(form.physicalCurrent || 0);

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

  const totalInvestmentValue =
    totalPhysicalInvestment + annualInsuranceInvestment;

  const totalCurrentInvestment =
    totalPhysicalCurrent + currentInsuranceValue;

  // ✅ Push liabilities into form so Page6 can use them
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      liabilitiesTotal: totalLiabilities,
    }));
  }, [totalLiabilities, setForm]);

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
              <th className="border p-2">Annual Investment Value</th>
            </tr>
          </thead>
          <tbody>
            {["Endowment", "Moneyback", "ULIP"].map((policy) => (
              <tr key={policy}>
                <td className="border p-2">{policy} Policy</td>
                <td className="border p-2">
                  <input
                    type="number"
                    name={`${policy.toLowerCase()}Investment`}
                    value={form[`${policy.toLowerCase()}Investment`] || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border p-2">
                  <select
                    name={`${policy.toLowerCase()}Freq`}
                    value={form[`${policy.toLowerCase()}Freq`] || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-1"
                  >
                    <option value="">Select</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </td>
                
                <td className="border p-2">
                  <input
                    type="number"
                    name={`${policy.toLowerCase()}Current`}
                    value={form[`${policy.toLowerCase()}Current`] || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    name={`${policy.toLowerCase()}Annual`}
                    value={form[`${policy.toLowerCase()}Annual`] || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-1"
                  />
                </td>
              </tr>
            ))}
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
