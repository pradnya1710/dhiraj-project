import React, { useMemo } from "react";

// small helper to format INR
const fmtINR = (n) =>
  "₹ " + (Number(n || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const Page7 = ({ form = {}, handleChange }) => {
  // Helper: sum numeric values for keys that match a regex
  const sumFormByRegex = (rx) => {
    return Object.keys(form).reduce((acc, k) => {
      if (rx.test(k)) {
        const v = Number(form[k] || 0);
        if (!Number.isNaN(v)) return acc + v;
      }
      return acc;
    }, 0);
  };

  // Memoize heavy calculations
  const { totalCurrentAssets, totalLiabilities, netWorth } = useMemo(() => {
    // 1) TOTAL CURRENT ASSETS
    // We consider keys that represent current values across your app.
    // Supported common suffixes / patterns:
    //  - _current, Current, current
    //  - _currentValue, CurrentValue, currentValue
    //  - AssetsValue / assetsValue (for fields like physicalAssetsValue)
    // This keeps it tolerant to underscore/camelCase naming.
    const currentPattern = /(currentvalue|_currentvalue|currentvalue|current|_current|CurrentValue|Current|AssetsValue|assetsValue|assetsvalue)$/i;

    const totalCurrentAssets = sumFormByRegex(currentPattern);

    // 2) TOTAL LIABILITIES
    // Prefer explicit outstanding keys if present (your updated naming uses ...Outstanding)
    // We will sum:
    //  - explicit known outstanding keys (preferred)
    //  - fallback to older names if present (vehicleLoan, personalLoan, creditCardDue, etc)
    const preferredLiabilityKeys = [
      "vehicleLoanOutstanding",
      "personalLoanOutstanding",
      "consumerLoanOutstanding",
      "homeLoanOutstanding",
      "creditCardOutstanding",
      "otherLoanOutstanding",
      // some apps may store year-suffixed variants, handle with regex below
    ];

    let liabilitiesSum = preferredLiabilityKeys.reduce((acc, k) => {
      const v = Number(form[k] || 0);
      return acc + (Number.isNaN(v) ? 0 : v);
    }, 0);

    // If preferred keys sum to zero, attempt to pick up older keys as fallback as a safety net:
    const fallbackLiabilityKeys = [
      "vehicleLoan",
      "personalLoan",
      "consumerLoan",
      "homeLoan",
      "creditCardDue",
      "creditCard",
      "otherLoan",
      // also accept camelCase variants:
      "vehicleLoanOutstanding",
      "personalLoanOutstanding",
    ];
    if (liabilitiesSum === 0) {
      liabilitiesSum = fallbackLiabilityKeys.reduce((acc, k) => {
        const v = Number(form[k] || 0);
        return acc + (Number.isNaN(v) ? 0 : v);
      }, 0);
    }

    // Additionally, include any key that very clearly looks like an outstanding / liability number:
    // e.g. keys that include 'outstanding' or 'due' or end with 'Loan' (case-insensitive).
    const liabilityPattern = /(outstanding|outstandingamount|due|Loan$|loan$|creditcard|creditcarddue)/i;
    const inferredLiabilities = sumFormByRegex(liabilityPattern);

    // Combine (but avoid double-counting keys that were already summed); to avoid double counting,
    // we will only add inferredLiabilities that come from keys not already seen above.
    const keysAlreadyCounted = new Set([
      ...preferredLiabilityKeys,
      ...fallbackLiabilityKeys,
    ]);
    const inferredSum = Object.keys(form).reduce((acc, k) => {
      if (keysAlreadyCounted.has(k)) return acc;
      if (liabilityPattern.test(k)) {
        const v = Number(form[k] || 0);
        if (!Number.isNaN(v)) return acc + v;
      }
      return acc;
    }, 0);

    const finalLiabilities = liabilitiesSum + inferredSum;

    const net = totalCurrentAssets - finalLiabilities;

    return {
      totalCurrentAssets,
      totalLiabilities: finalLiabilities,
      netWorth: net,
    };
  }, [form]);

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
            <span className="font-semibold">Total Current Value of Assets</span>{" "}
            {fmtINR(totalCurrentAssets)} −{" "}
            <span className="font-semibold">Total Liabilities</span>{" "}
            {fmtINR(totalLiabilities)} ={" "}
            <span className="font-bold text-indigo-600">
              Net Worth {fmtINR(netWorth)}
            </span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow">
            <p className="font-medium">Total Current Assets</p>
            <p className="text-xl font-bold">{fmtINR(totalCurrentAssets)}</p>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-lg text-center shadow">
            <p className="font-medium">Total Liabilities</p>
            <p className="text-xl font-bold">{fmtINR(totalLiabilities)}</p>
          </div>

          <div className="bg-purple-600 text-white p-4 rounded-lg text-center shadow">
            <p className="font-medium">Net Worth</p>
            <p className="text-xl font-bold">{fmtINR(netWorth)}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <b>Net Worth = Total Current Value of Assets − Total Liabilities</b>
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
