// src/components/YearlyExpenses.jsx
export default function YearlyExpenses({ form, handleChange }) {
  // Fields that belong to the "Yearly Expenses" section
  const insuranceFields = [
    { label: "Medical Insurance", name: "medicalInsurance" },
    { label: "Term Insurance", name: "termInsurance" },
    { label: "Bike Insurance", name: "bikeInsurance" },
    { label: "Car Insurance", name: "carInsurance" },
    { label: "Critical Illness", name: "criticalIllness" },
    { label: "Accidental Policy", name: "accidentalPolicy" },
  ];

  const childrenFields = [
    { label: "School Fees", name: "schoolFees" },
    { label: "Travel Fees", name: "travelFees" },
    { label: "Books / Uniform", name: "booksUniform" },
  ];

  // other yearly fields
  const otherYearly = [
    { label: "Property Tax", name: "propertyTax" },
    { label: "Holiday", name: "holiday" },
    { label: "Miscellaneous (Yearly)", name: "misc" },
    { label: "Investment Expense (Yearly)", name: "yearlyInvestment" },
  ];

  // compute total by summing all yearly-related keys from `form`
  const allYearlyKeys = [
    ...insuranceFields.map(f => f.name),
    ...childrenFields.map(f => f.name),
    ...otherYearly.map(f => f.name),
  ];

  const yearlyTotal = allYearlyKeys.reduce(
    (acc, key) => acc + (parseFloat(form?.[key]) || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Yearly Expenses</h2>

      {/* Insurance Expenses */}
      <div className="mb-6 border rounded-lg p-4 0">
        <h3 className="font-semibold mb-3">Insurance Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insuranceFields.map(({ label, name }) => (
            <div key={name}>
              <label className="text-sm text-gray-700 block mb-1">{label}</label>
              <input
                type="number"
                name={name}
                value={form?.[name] ?? ""}
                onChange={handleChange}
                className="input"
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Property Related */}
      <div className="mb-6 border rounded-lg p-4 ">
        <h3 className="font-semibold mb-3">Property Related</h3>
        <div>
          <label className="text-sm text-gray-700 block mb-1">Property Tax</label>
          <input
            type="number"
            name="propertyTax"
            value={form?.propertyTax ?? ""}
            onChange={handleChange}
            className="input w-full"
            placeholder="Property Tax"
          />
        </div>
      </div>

      {/* Discretionary */}
      <div className="mb-6 border rounded-lg p-4 ">
        <h3 className="font-semibold mb-3">Discretionary Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700 block mb-1">Holiday</label>
            <input
              type="number"
              name="holiday"
              value={form?.holiday ?? ""}
              onChange={handleChange}
              className="input"
              placeholder="Holiday"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Miscellaneous (Yearly)</label>
            <input
              type="number"
              name="misc"
              value={form?.misc ?? ""}
              onChange={handleChange}
              className="input"
              placeholder="Miscellaneous"
            />
          </div>
        </div>
      </div>
<div className="page-break"></div>

{/* Children's Education */}
<div className="mb-6 border rounded-lg p-4 ">

  <h3 className="font-semibold mb-3 text-black">
    Children's Education Expenses
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {childrenFields.map(({ label, name }) => (
      <div key={name}>
        <label className="text-sm text-black block mb-1">{label}</label>
        <input
          type="number"
          name={name}
          value={form?.[name] ?? ""}
          onChange={handleChange}
          className="input bg-white text-black"
          placeholder={label}
        />
      </div>
    ))}
  </div>
</div>


      {/* Investments */}
      <div className="mb-6 border rounded-lg p-4 ">
        <h3 className="font-semibold mb-3">Total Annual Mode Investments</h3>
        <label className="text-sm text-gray-700 block mb-1">Investment Expense</label>
        <input
          type="number"
          name="yearlyInvestment"
          value={form?.yearlyInvestment ?? ""}
          onChange={handleChange}
          className="input w-full"
          placeholder="Investment Expense"
        />
      </div>

      {/* Total */}
      <div className="bg-red-500 text-white text-lg font-bold p-4 rounded-lg flex justify-between">
        <span>Total Annual Yearly Expenses</span>
        <span>₹ {yearlyTotal.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
