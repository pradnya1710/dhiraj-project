import React, { useMemo } from "react";

const Page7 = ({ form, handleChange }) => {
  // --- Calculate totals ---
  const totalPhysicalAssets = Number(form.physicalAssetsValue || 0);
  const totalInsuranceValue = Number(form.insuranceCurrentValue || 0);
  const totalAssets = totalPhysicalAssets + totalInsuranceValue;

  const totalLiabilities =
    Number(form.vehicleLoan || 0) +
    Number(form.personalLoan || 0) +
    Number(form.consumerLoan || 0) +
    Number(form.homeLoan || 0) +
    Number(form.creditCardDue || 0) +
    Number(form.otherLoan || 0);

  const netWorth = totalAssets - totalLiabilities;

  return (
    
    <div className="space-y-6">
      {/* ---------------- Net Worth Analysis ---------------- */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Net Worth Analysis
        </h2>

        {/* Calculation Box */}
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="font-medium text-gray-600">Net Worth Calculation</p>
          <p className="mt-2 text-gray-700">
            <span className="font-semibold">Total Assets</span> ₹{totalAssets} −{" "}
            <span className="font-semibold">Total Liabilities</span> ₹
            {totalLiabilities} ={" "}
            <span className="font-bold text-indigo-600">Net Worth ₹{netWorth}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow">
            <p className="font-medium">Total Assets</p>
            <p className="text-xl font-bold">₹ {totalAssets}</p>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-lg text-center shadow">
            <p className="font-medium">Total Liabilities</p>
            <p className="text-xl font-bold">₹ {totalLiabilities}</p>
          </div>

          <div className="bg-purple-600 text-white p-4 rounded-lg text-center shadow">
            <p className="font-medium">Net Worth</p>
            <p className="text-xl font-bold">₹ {netWorth}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <b>Net Worth = Total Assets − Total Liabilities</b>
          </p>
          <p className="mt-1">
            A positive net worth indicates that your assets exceed your
            liabilities, while a negative net worth suggests you owe more than
            you own.
          </p>
        </div>
      </div>

{/* ---------------- Print to PDF ---------------- */}
<div className="bg-white shadow-md rounded-xl p-4 text-center print:hidden">
  <h2 className="text-lg font-semibold text-gray-700 mb-3">Print to PDF</h2>
  <p className="text-gray-600 mb-4">
    Generate a complete PDF report of your financial analysis. Click the
    button to open your browser’s print dialog, then select{" "}
    <b>“Save as PDF”</b> as your destination.
  </p>
  <button
    onClick={() => window.print()}
    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium shadow"
  >
    Print to PDF
  </button>
</div>
    </div>
  );
};

export default Page7;
