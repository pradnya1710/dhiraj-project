// src/Page6.jsx
import React, { useState, useEffect } from "react";

const Page6 = ({ form, setForm }) => {
  const [goals, setGoals] = useState([
    { name: "", category: "", amount: "", years: "", priority: "" },
  ]);

  // ----------------- GOALS HANDLING -----------------
  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    setGoals([
      ...goals,
      { name: "", category: "", amount: "", years: "", priority: "" },
    ]);
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  // ----------------- GOALS SUMMARY -----------------
  const totalGoals = goals.length;
  const highPriority = goals.filter((g) => g.priority === "High").length;
  const mediumPriority = goals.filter((g) => g.priority === "Medium").length;
  const totalTargetAmount = goals.reduce(
    (sum, g) => sum + Number(g.amount || 0),
    0
  );

  // ----------------- BALANCE SHEET CALCULATIONS -----------------
  // ✅ Incomes (from App.js keys)
  const salaryIncome = Number(form.salaryAmt || 0);
  const rentIncome = Number(form.rentAmt || 0);
  const investmentIncome = Number(form.investAmt || 0);
  const otherIncome = Number(form.otherAmt || 0);

  // ✅ Expenses (monthly × 12 + annual)
  const monthlyExpenses = [
    "consumerLoan",
    "vehicleLoan",
    "personalLoan",
    "homeLoan",
    "grocery",
    "domesticHelp",
    "gas",
    "electricity",
    "wifi",
    "miscHouse",
    "rentPayable",
    "propertyMaint",
    "fuel",
    "hotel",
    "ott",
    "club",
    "entertainment",
    "miscDisc",
    "school",
    "extraCurricular",
    "miscEdu",
    "investExpense",
  ].reduce((acc, key) => acc + Number(form[key] || 0), 0);

  const annualExpenses = [
    "medicalInsurance",
    "termInsurance",
    "bikeInsurance",
    "carInsurance",
    "criticalIllness",
    "accidentalPolicy",
    "propertyTax",
    "holiday",
    "misc",
    "schoolFees",
    "travelFees",
    "booksUniform",
    "yearlyInvestment",
  ].reduce((acc, key) => acc + Number(form[key] || 0), 0);

    const totalLiabilities = Number(form.liabilitiesTotal || 0);


  // ✅ Totals
  const totalIncome =
    salaryIncome + rentIncome + investmentIncome + otherIncome;
  const totalExpenses = monthlyExpenses * 12 + annualExpenses + totalLiabilities;
  const investibleSurplus = totalIncome - totalExpenses;

  // ✅ Push values into form (so Page7 or summary can use them)
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      totalIncome,
      totalExpenses,
      investibleSurplus,
      liabilitiesTotal: totalLiabilities,
    }));
  }, [totalIncome, totalExpenses, investibleSurplus, totalLiabilities, setForm]);

  // INR formatting
  const fmtINR = (n) =>
    "₹ " +
    (Number(n || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      {/* ---------------- GOAL PLANNING ---------------- */}
      <div className="bg-white p-6 rounded-2xl shadow section-card">
        <h2 className="text-lg font-bold mb-4">Goal Planning</h2>
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700 mb-4">
          Plan for your future financial goals like Car, Home, Education,
          Marriage, Vacation, Retirement, etc.
        </div>

          {/* ---- Table Header ---- */}
          <div className="grid grid-cols-6 gap-3 font-semibold text-gray-600 border-b pb-2 text-sm">
            <div>Goal Name</div>
            <div>Goal Category</div>
            <div>Target Amount (Rs.)</div>
            <div>Years to Achieve</div>
            <div>Priority</div>
            <div>Action</div>
          </div>

        <div className="space-y-3">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-3 items-center border-b pb-2"
            >
              <input
                type="text"
                placeholder="e.g., New Car"
                value={goal.name}
                onChange={(e) =>
                  handleGoalChange(index, "name", e.target.value)
                }
                className="border p-2 rounded"
              />
              <select
                value={goal.category}
                onChange={(e) =>
                  handleGoalChange(index, "category", e.target.value)
                }
                className="border p-2 rounded"
              >
                <option value="">Select Category</option>
                <option>Education</option>
                <option>Home</option>
                <option>Marriage</option>
                <option>Retirement</option>
                <option>Vacation</option>
              </select>
              <input
                type="number"
                placeholder="Target Amount"
                value={goal.amount}
                onChange={(e) =>
                  handleGoalChange(index, "amount", e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Years"
                value={goal.years}
                onChange={(e) =>
                  handleGoalChange(index, "years", e.target.value)
                }
                className="border p-2 rounded"
              />
              <select
                value={goal.priority}
                onChange={(e) =>
                  handleGoalChange(index, "priority", e.target.value)
                }
                className="border p-2 rounded"
              >
                <option value="">Select Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button
                className="text-red-600 font-semibold"
                onClick={() => removeGoal(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={addGoal}
        >
          + Add New Goal
        </button>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <SummaryCard label="Total Goals" value={totalGoals} color="bg-blue-600" />
          <SummaryCard
            label="High Priority Goals"
            value={highPriority}
            color="bg-red-600"
          />
          <SummaryCard
            label="Medium Priority Goals"
            value={mediumPriority}
            color="bg-orange-500"
          />
          <SummaryCard
            label="Total Target Amount"
            value={fmtINR(totalTargetAmount)}
            color="bg-green-600"
          />
        </div>
      </div>

      <div className="page-break"></div>

      {/* ---------------- BALANCE SHEET ---------------- */}
      <div className="bg-white p-6 rounded-2xl shadow section-card">
        <h2 className="text-lg font-bold mb-6">Balance Sheet Calculation</h2>

        {/* Income Sources */}
        <div className="mb-6">
          <h3 className="font-semibold text-green-600 mb-2">Income Sources</h3>
          <table className="w-full border-collapse">
            <tbody className="text-sm text-gray-700">
              <tr>
                <td className="p-2">Salary / Business Income</td>
                <td className="p-2 text-right">{fmtINR(salaryIncome)}</td>
              </tr>
              <tr>
                <td className="p-2">Rent Receivables</td>
                <td className="p-2 text-right">{fmtINR(rentIncome)}</td>
              </tr>
              <tr>
                <td className="p-2">Investment Income</td>
                <td className="p-2 text-right">{fmtINR(investmentIncome)}</td>
              </tr>
              <tr>
                <td className="p-2">Others</td>
                <td className="p-2 text-right">{fmtINR(otherIncome)}</td>
              </tr>
              <tr className="bg-green-50 font-semibold">
                <td className="p-2">Total Annual Income</td>
                <td className="p-2 text-right">{fmtINR(totalIncome)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Categories */}
        <div className="mb-6">
          <h3 className="font-semibold text-red-600 mb-2">Expense Categories</h3>
          <table className="w-full border-collapse">
            <tbody className="text-sm text-gray-700">
              <tr>
                <td className="p-2">Total Monthly Expenses × 12</td>
                <td className="p-2 text-right">{fmtINR(monthlyExpenses * 12)}</td>
              </tr>
              <tr>
                <td className="p-2">Total Annual Expenses</td>
                <td className="p-2 text-right">{fmtINR(annualExpenses)}</td>
              </tr>
              <tr>
                <td className="p-2">Liabilities (Loans etc.)</td>
                <td className="p-2 text-right">{fmtINR(totalLiabilities)}</td>
              </tr>
              <tr className="bg-red-50 font-semibold">
                <td className="p-2">Total Annual Expenses (incl. Liabilities)</td>
                <td className="p-2 text-right">{fmtINR(totalExpenses)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Final Surplus */}
        <div className="border-t pt-4 text-center font-semibold">
          <div className="flex justify-around">
            <div>Total Income: {fmtINR(totalIncome)}</div>
            <div>Total Expenses: {fmtINR(totalExpenses)}</div>
            <div>Investible Surplus: {fmtINR(investibleSurplus)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- REUSABLE SUMMARY CARD ----------------
const SummaryCard = ({ label, value, sub, color }) => (
  <div className={`${color} text-white p-4 rounded-lg text-center`}>
    <div className="text-sm">{label}</div>
    <div className="font-bold text-lg">{value}</div>
    {sub && <div className="text-xs">{sub}</div>}
  </div>
);

export default Page6;
