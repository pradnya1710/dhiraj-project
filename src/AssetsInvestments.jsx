// src/components/AssetsInvestments.jsx
import React from "react";

export default function AssetsInvestments({ form, handleChange }) {
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

  // helper to sum numeric fields given row list and suffix (e.g. "_annual" or "_current")
  const sumFor = (rows, suffix) =>
    rows.reduce(
      (acc, r) => acc + (parseFloat(form?.[`${r.key}${suffix}`]) || 0),
      0
    );

  const debtAnnualTotal = sumFor(debtRows, "_annual");
  const debtCurrentTotal = sumFor(debtRows, "_current");

  const equityAnnualTotal = sumFor(equityRows, "_annual");
  const equityCurrentTotal = sumFor(equityRows, "_current");

  const physicalAnnualTotal = sumFor(physicalRows, "_annual");
  const physicalCurrentTotal = sumFor(physicalRows, "_current");

  const freqOptions = [
    { value: "", label: "Select Frequency" },
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Yearly", label: "Yearly" },
  ];
const rowInputs = (row) => (
  <div key={row.key} className="grid grid-cols-12 gap-2 items-center">
    {/* Label */}
    <div className="col-span-3 text-sm text-gray-700">{row.label}</div>

    {/* Investment Value */}
    <div className="col-span-3">
      <input
        type="number"
        name={`${row.key}_value`}
        value={form?.[`${row.key}_value`] ?? ""}
        onChange={handleChange}
        className="input"
        placeholder="Investment Value (Rs.)"
      />
    </div>

    {/* Frequency */}
    <div className="col-span-2">
      <select
        name={`${row.key}_freq`}
        value={form?.[`${row.key}_freq`] ?? ""}
        onChange={handleChange}
        className="input"
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
        name={`${row.key}_current`}
        value={form?.[`${row.key}_current`] ?? ""}
        onChange={handleChange}
        className="input"
        placeholder="Current Value"
      />
    </div>

    {/* Annual Value */}
    <div className="col-span-2">
      <input
        type="number"
        name={`${row.key}_annual`}
        value={form?.[`${row.key}_annual`] ?? ""}
        onChange={handleChange}
        className="input"
        placeholder="Annual Value"
      />
    </div>
  </div>
);

  return (
    <div className="section-card page-break">
  {/* Debt Investments */}
  <div className="mb-6">
    <div className="text-sm font-medium bg-blue-50 p-2 rounded">
      Debt Investments
    </div>

    <div className="mt-3 space-y-3">
          {/* table header */}
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-semibold">
            <div className="col-span-3">Particulars</div>
            <div className="col-span-3">Investment Value (Rs.)</div>
            <div className="col-span-2">Frequency</div>
            <div className="col-span-2">Current Value (Rs.)</div>
            <div className="col-span-2">Annual Investment Value</div>
          </div>

          {debtRows.map(row => (
            <div key={row.key} className="pt-2 pb-2 border-b last:border-b-0">
              {rowInputs(row)}
            </div>
          ))}
        </div>
        
        <div className="page-break"></div>

        {/* Debt summary boxes */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg">
            <div className="text-sm">Annual Debt Investment Value</div>
            <div className="font-bold text-right">₹ {debtAnnualTotal.toLocaleString("en-IN")}</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg">
            <div className="text-sm">Current Debt Investment Value</div>
            <div className="font-bold text-right">₹ {debtCurrentTotal.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </div>

      {/* Equity Investments */}
      <div className="mb-6">
        <div className="text-sm font-medium bg-pink-50 p-2 rounded">Equity Investments</div>

        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-semibold">
            <div className="col-span-3">Particulars</div>
            <div className="col-span-3">Investment Value (Rs.)</div>
            <div className="col-span-2">Frequency</div>
            <div className="col-span-2">Current Value (Rs.)</div>
            <div className="col-span-2">Annual Investment Value</div>
          </div>

          {equityRows.map(row => (
            <div key={row.key} className="pt-2 pb-2 border-b last:border-b-0">
              {rowInputs(row)}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 rounded-lg">
            <div className="text-sm">Annual Equity Investment Value</div>
            <div className="font-bold text-right">₹ {equityAnnualTotal.toLocaleString("en-IN")}</div>
          </div>

          <div className="bg-gradient-to-r from-rose-400 to-red-500 text-white p-3 rounded-lg">
            <div className="text-sm">Current Equity Investment Value</div>
            <div className="font-bold text-right">₹ {equityCurrentTotal.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </div>

{/* Physical Assets */}
<div className="mb-6">
  <div className="text-sm font-medium bg-yellow-50 p-2 rounded">Physical Assets</div>

  <div className="mt-3 space-y-3">
    <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-semibold">
      <div className="col-span-3">Particulars</div>
      <div className="col-span-3">Investment Value (Rs.)</div>
      <div className="col-span-2">Frequency</div>
      <div className="col-span-2">Current Value (Rs.)</div>
      <div className="col-span-2">Annual Investment Value</div>
    </div>

    {physicalRows.map(row => (
      <div key={row.key} className="pt-2 pb-2 border-b last:border-b-0">
        {rowInputs(row)}
      </div>
    ))}
  </div>

  {/* Physical Assets Summary Boxes */}
  <div className="mt-4 grid grid-cols-2 gap-4">
    {/* Annual Physical Assets Value */}
    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-3 rounded-lg">
      <div className="text-sm">Annual Physical Assets Value</div>
      <div className="font-bold text-right">₹ {physicalAnnualTotal.toLocaleString("en-IN")}</div>
    </div>

    {/* Current Physical Assets Value */}
    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-3 rounded-lg">
      <div className="text-sm">Current Physical Assets Value</div>
      <div className="font-bold text-right">₹ {physicalCurrentTotal.toLocaleString("en-IN")}</div>
    </div>
  </div>
</div>

    </div>
  );
}
