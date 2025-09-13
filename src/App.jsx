// src/App.jsx
import { useState, useRef, useEffect } from "react"; // added useEffect
import html2pdf from "html2pdf.js/dist/html2pdf.bundle.min";
import YearlyExpenses from "./YearlyExpenses.jsx";
import AssetsInvestments from "./AssetsInvestments.jsx";
import Page5 from "./Page5.jsx";
import Page6 from "./Page6.jsx";
import Page7 from "./Page7.jsx";

export default function App() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    contact: "",
    email: "",
    profession: "",
    maritalStatus: "",
    // spouse fields (new)
    spouseName: "",
    spouseDob: "",

    child1Name: "",
    child1Dob: "",
    child2Name: "",
    child2Dob: "",
    child3Name: "",
    child3Dob: "",
    fatherName: "",
    fatherDob: "",
    motherName: "",
    motherDob: "",

    // incomes raw value and frequency + computed annual amount
    salary: "",
    salaryFreq: "",
    salaryAmt: "",
    rent: "",
    rentFreq: "",
    rentAmt: "",
    invest: "",
    investFreq: "",
    investAmt: "",
    other: "",
    otherFreq: "",
    otherAmt: "",

    // ... rest of fields unchanged
    consumerLoan: "",
    vehicleLoan: "",
    personalLoan: "",
    homeLoan: "",
    grocery: "",
    domesticHelp: "",
    gas: "",
    electricity: "",
    wifi: "",
    miscHouse: "",
    rentPayable: "",
    propertyMaint: "",
    fuel: "",
    hotel: "",
    ott: "",
    club: "",
    entertainment: "",
    miscDisc: "",
    school: "",
    extraCurricular: "",
    miscEdu: "",
    investExpense: "",
    medicalInsurance: "",
    termInsurance: "",
    bikeInsurance: "",
    carInsurance: "",
    criticalIllness: "",
    accidentalPolicy: "",
    propertyTax: "",
    holiday: "",
    misc: "",
    schoolFees: "",
    travelFees: "",
    booksUniform: "",
    yearlyInvestment: "",

    // ---------- Page 4 ----------
    debt_savings_value: "",
    debt_savings_date: "",
    debt_savings_freq: "",
    debt_savings_years: "",
    debt_savings_current: "",
    debt_savings_annual: "",

    debt_fd_value: "",
    debt_fd_date: "",
    debt_fd_freq: "",
    debt_fd_years: "",
    debt_fd_current: "",
    debt_fd_annual: "",

    debt_rd_value: "",
    debt_rd_date: "",
    debt_rd_freq: "",
    debt_rd_years: "",
    debt_rd_current: "",
    debt_rd_annual: "",

    equity_shares_value: "",
    equity_shares_date: "",
    equity_shares_freq: "",
    equity_shares_years: "",
    equity_shares_current: "",
    equity_shares_annual: "",

    equity_mutual_value: "",
    equity_mutual_date: "",
    equity_mutual_freq: "",
    equity_mutual_years: "",
    equity_mutual_current: "",
    equity_mutual_annual: "",

    equity_sip_value: "",
    equity_sip_date: "",
    equity_sip_freq: "",
    equity_sip_years: "",
    equity_sip_current: "",
    equity_sip_annual: "",

    physical_property_value: "",
    physical_property_date: "",
    physical_property_freq: "",
    physical_property_years: "",
    physical_property_current: "",
    physical_property_annual: "",

    physical_gold_value: "",
    physical_gold_date: "",
    physical_gold_freq: "",
    physical_gold_years: "",
    physical_gold_current: "",
    physical_gold_annual: "",

    // ---------- Page 5 ----------
    insurance_endowment_value: "",
    insurance_endowment_date: "",
    insurance_endowment_freq: "",
    insurance_endowment_years: "",
    insurance_endowment_current: "",
    insurance_endowment_annual: "",

    insurance_moneyback_value: "",
    insurance_moneyback_date: "",
    insurance_moneyback_freq: "",
    insurance_moneyback_years: "",
    insurance_moneyback_current: "",
    insurance_moneyback_annual: "",

    insurance_ulip_value: "",
    insurance_ulip_date: "",
    insurance_ulip_freq: "",
    insurance_ulip_years: "",
    insurance_ulip_current: "",
    insurance_ulip_annual: "",

    liability_vehicle_amount: "",
    liability_vehicle_year: "",
    liability_personal_amount: "",
    liability_personal_year: "",
    liability_consumer_amount: "",
    liability_consumer_year: "",
    liability_home_amount: "",
    liability_home_year: "",
    liability_credit_amount: "",
    liability_credit_year: "",
    liability_other_amount: "",
    liability_other_year: "",

    coverage_health_sum: "",
    coverage_term_sum: "",
  });

  // Standard handleChange used across components
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // PDF ref & generator
  const pdfRef = useRef();
  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.3,
      filename: "Financial_Report.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // ---------------------------
  // Auto-calc income annual amounts
  // ---------------------------
  // Utility: get multiplier from frequency
  const freqMultiplier = (freq) => {
    if (!freq) return 0;
    const f = String(freq).toLowerCase().replace(/\s+/g, "");
    if (f.includes("monthly")) return 12;
    if (f.includes("quarter")) return 4;
    if (f.includes("half")) return 2;
    if (f.includes("year") || f.includes("single") || f.includes("annual"))
      return 1;
    // fallback: if freq is numeric months like "3" meaning every 3 months -> annual multiplier = 12 / 3 = 4
    const asNum = Number(freq);
    if (!Number.isNaN(asNum) && asNum > 0) return 12 / asNum;
    return 0;
  };

  // When the raw income amount or its frequency changes, compute the corresponding annual amount
  useEffect(() => {
    // prefixes we manage
    const incomes = ["salary", "rent", "invest", "other"];
    const updates = {};
    let any = false;

    incomes.forEach((p) => {
      const raw = form[p];
      const freq = form[`${p}Freq`];
      const multiplier = freqMultiplier(freq);
      const numeric = Number(raw || 0);
      const computed = Math.round(numeric * multiplier);

      const key = `${p}Amt`;
      // only set if different (avoid cycles)
      if (Number(form[key] || 0) !== computed) {
        updates[key] = computed;
        any = true;
      }
    });

    if (any) {
      setForm((prev) => ({ ...prev, ...updates }));
    }
    // We want this effect to run when any of these fields change:
    // (explicit dependencies help avoid stale closures)
  }, [
    form.salary,
    form.salaryFreq,
    form.rent,
    form.rentFreq,
    form.invest,
    form.investFreq,
    form.other,
    form.otherFreq,
    setForm,
  ]);

  // ---------------------------
  // Derived totals (display-only)
  // ---------------------------
  const totalAnnualIncome =
    Number(form.salaryAmt || 0) +
    Number(form.rentAmt || 0) +
    Number(form.investAmt || 0) +
    Number(form.otherAmt || 0);

  const totalMonthlyExpenses = [
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

  const totalAnnualExpenses = totalMonthlyExpenses * 12;

  // Optionally, you may want to write these totals into form if other pages expect them
  // e.g. setForm(prev => ({...prev, totalAnnualIncome, totalMonthlyExpenses, totalAnnualExpenses}))
  // but not doing it automatically here to avoid overwriting if you need to persist differently.
  // If you want them in form, uncomment the useEffect below:
  /*
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      totalAnnualIncome,
      totalMonthlyExpenses,
      totalAnnualExpenses
    }));
  }, [totalAnnualIncome, totalMonthlyExpenses, totalAnnualExpenses, setForm]);
  */

  return (
    <div ref={pdfRef}>
      <div className="min-h-screen bg-gray-100 py-6 px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-700 to-purple-600 text-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-semibold">STEWARD FAMILY OFFICE</h2>
            <p className="text-sm">
              Transparent Solutions – Ethical Services – Delightful Experience
            </p>
            <h3 className="text-xl font-bold mt-2">Need Analysis Sheet</h3>
            <p className="text-sm">
              Complete your personal and family information for comprehensive
              financial planning
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-6 space-y-6">
          {/* Personal Information */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
              <Input
                type="date"
                label="Date of Birth"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
              <Input
                label="Contact Number"
                name="contact"
                value={form.contact}
                onChange={handleChange}
              />
              <Input
                label="Email ID"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                label="Profession"
                name="profession"
                value={form.profession}
                onChange={handleChange}
              />
              <Select
                label="Marital Status"
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
                options={["Single", "Married", "Divorced", "Widowed"]}
              />
            </div>

            {/* Show spouse fields when Married */}
            {form.maritalStatus === "Married" && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Spouse Name"
                  name="spouseName"
                  value={form.spouseName}
                  onChange={handleChange}
                />
                <Input
                  type="date"
                  label="Spouse Date of Birth"
                  name="spouseDob"
                  value={form.spouseDob}
                  onChange={handleChange}
                />
                {/* optional: spouse profession or contact if needed */}
              </div>
            )}
          </Section>

          {/* Children Information */}
          <div className="page-break"></div>
          <Section title="Children Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Child 1 Name"
                name="child1Name"
                value={form.child1Name}
                onChange={handleChange}
              />
              <Input
                type="date"
                label="Child 1 Date of Birth"
                name="child1Dob"
                value={form.child1Dob}
                onChange={handleChange}
              />
              <Input
                label="Child 2 Name"
                name="child2Name"
                value={form.child2Name}
                onChange={handleChange}
              />
              <Input
                type="date"
                label="Child 2 Date of Birth"
                name="child2Dob"
                value={form.child2Dob}
                onChange={handleChange}
              />
              <Input
                label="Child 3 Name"
                name="child3Name"
                value={form.child3Name}
                onChange={handleChange}
              />
              <Input
                type="date"
                label="Child 3 Date of Birth"
                name="child3Dob"
                value={form.child3Dob}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* Parents Information */}
          <Section title="Parents Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Father's Name"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
              />
              <Input
                type="date"
                label="Father's Date of Birth"
                name="fatherDob"
                value={form.fatherDob}
                onChange={handleChange}
              />
              <Input
                label="Mother's Name"
                name="motherName"
                value={form.motherName}
                onChange={handleChange}
              />
              <Input
                type="date"
                label="Mother's Date of Birth"
                name="motherDob"
                value={form.motherDob}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* === Age Summary === */}
          <div className="page-break"></div>
          <div className="section-card page-break-avoid">
            <Section title="Age Summary">
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
                <AgeCard label="Your Age" dob={form.dob} color="bg-blue-500" />
                <AgeCard label="Spouse Age" dob={form.spouseDob} color="bg-teal-500" />
                <AgeCard label="Father Age" dob={form.fatherDob} color="bg-indigo-500" />
                <AgeCard label="Mother Age" dob={form.motherDob} color="bg-red-500" />
                <AgeCard label="Child 1 Age" dob={form.child1Dob} color="bg-pink-500" />
                <AgeCard label="Child 2 Age" dob={form.child2Dob} color="bg-green-500" />
                <AgeCard label="Child 3 Age" dob={form.child3Dob} color="bg-orange-500" />
              </div>
            </Section>
          </div>

          {/* Income Information */}
          <Section title="Income Information">
            <div className="space-y-4">
              <IncomeRow
                label="Salary/Business Income"
                prefix="salary"
                form={form}
                handleChange={handleChange}
              />
              <IncomeRow
                label="Rent Receivables"
                prefix="rent"
                form={form}
                handleChange={handleChange}
              />
               <div className="page-break"></div>
              <IncomeRow
                label="Investment Income"
                prefix="invest"
                form={form}
                handleChange={handleChange}
              />
              <IncomeRow label="Others" prefix="other" form={form} handleChange={handleChange} />
            </div>

            <div className="bg-green-600 text-white text-left font-semibold rounded-lg p-3 mt-4">
              Total Annual Income ₹ {totalAnnualIncome}
            </div>
          </Section>

          {/* Monthly Expenses */}
          <Section title="Monthly Expenses">
            {/* Loans */}
            <SubSection title="Loans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Consumer Loan EMI"
                  name="consumerLoan"
                  value={form.consumerLoan}
                  onChange={handleChange}
                />
                <Input
                  label="Vehicle Loan EMI"
                  name="vehicleLoan"
                  value={form.vehicleLoan}
                  onChange={handleChange}
                />
                <Input
                  label="Personal Loan EMI"
                  name="personalLoan"
                  value={form.personalLoan}
                  onChange={handleChange}
                />
                <Input
                  label="Home Loan EMI"
                  name="homeLoan"
                  value={form.homeLoan}
                  onChange={handleChange}
                />
              </div>
            </SubSection>

            {/* Household */}
            <SubSection title="Household Expenses">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Grocery, Vegetables, Fruits" name="grocery" value={form.grocery} onChange={handleChange} />
                <Input label="Domestic Help" name="domesticHelp" value={form.domesticHelp} onChange={handleChange} />
                <Input label="Piped Gas Bill" name="gas" value={form.gas} onChange={handleChange} />
                <Input label="Electricity Bill" name="electricity" value={form.electricity} onChange={handleChange} />
                <Input label="Telephone / WiFi Bill" name="wifi" value={form.wifi} onChange={handleChange} />
                <Input label="Miscellaneous Expenses" name="miscHouse" value={form.miscHouse} onChange={handleChange} />
              </div>
            </SubSection>

            {/* Property */}
            <SubSection title="Property Related">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Rent Payable" name="rentPayable" value={form.rentPayable} onChange={handleChange} />
                <Input label="Property Maintenance" name="propertyMaint" value={form.propertyMaint} onChange={handleChange} />
              </div>
            </SubSection>

            {/* Discretionary */}
            <SubSection title="Discretionary Expenses">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Fuel" name="fuel" value={form.fuel} onChange={handleChange} />
                <Input label="Hotel & Hospitality" name="hotel" value={form.hotel} onChange={handleChange} />
                <Input label="OTT Subscriptions" name="ott" value={form.ott} onChange={handleChange} />
                <Input label="Club Memberships" name="club" value={form.club} onChange={handleChange} />
                <Input label="Entertainment" name="entertainment" value={form.entertainment} onChange={handleChange} />
                <Input label="Miscellaneous Expenses" name="miscDisc" value={form.miscDisc} onChange={handleChange} />
              </div>
            </SubSection>

            {/* Children */}
            <SubSection title="Children's Education Expenses">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Classes Fees / Tuition Fees" name="school" value={form.school} onChange={handleChange} />
                <Input label="Extra Curricular Activities Fees" name="extraCurricular" value={form.extraCurricular} onChange={handleChange} />
                <Input label="Miscellaneous Expenses" name="miscEdu" value={form.miscEdu} onChange={handleChange} />
              </div>
            </SubSection>

            {/* Investments */}
            <SubSection title="Total Monthly Mode Investments">
              <Input label="Investment Expenses" name="investExpense" value={form.investExpense} onChange={handleChange} />
            </SubSection>

            {/* Totals */}
            <div className="bg-red-500 text-white font-semibold rounded-lg p-3 mt-4 flex justify-between">
              <span>Total Monthly Expenses</span>
              <span>₹ {totalMonthlyExpenses}</span>
            </div>
            <div className="bg-red-600 text-white font-semibold rounded-lg p-3 mt-2 flex justify-between">
              <span>Total Monthly Mode Expenses Calculated Annually</span>
              <span>₹ {totalAnnualExpenses}</span>
            </div>
          </Section>

          {/* Other components */}
          <YearlyExpenses form={form} handleChange={handleChange} />
          {/* pass setForm to AssetsInvestments so it can batch write annuals */}
          <AssetsInvestments form={form} handleChange={handleChange} setForm={setForm} />
          <Page5 form={form} handleChange={handleChange} setForm={setForm} />
          <Page6 form={form} setForm={setForm} />

          <Page7 form={form} handleDownloadPDF={handleDownloadPDF} hidePrintButton={false} />
        </div>
      </div>
    </div>
  );
}

// Reusable Section wrapper
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="font-semibold mb-3">{title}</h4>
      {children}
    </div>
  );
}

// Input component
function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-600">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
      />
    </label>
  );
}

// Select component
function Select({ label, name, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-600">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

// ✅ AgeCard (calculates age from DOB)
function AgeCard({ label, dob, color }) {
  const calculateAge = (dobStr) => {
    if (!dobStr) return "-";
    const birthDate = new Date(dobStr);
    if (isNaN(birthDate.getTime())) return "-";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 0 ? age : "-";
  };

  return (
    <div className={`${color} text-white rounded-lg p-3`}>
      <p className="text-sm">{label}</p>
      <p className="font-bold">{calculateAge(dob)}</p>
    </div>
  );
}

// SubSection component
function SubSection({ title, color, children }) {
  return (
    <div className={`${color || ""} rounded-lg p-3 mb-4`}>
      <h5 className="font-medium mb-2">{title}</h5>
      {children}
    </div>
  );
}

// Income row
function IncomeRow({ label, prefix, form, handleChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        label={`${label} (Amount in ₹)`}
        name={`${prefix}`}
        value={form[prefix]}
        onChange={handleChange}
      />
      <Select
        label="Frequency"
        name={`${prefix}Freq`}
        value={form[`${prefix}Freq`]}
        onChange={handleChange}
        options={["Monthly", "Quarterly", "Yearly"]}
      />
      <Input
        label="Annual Amount"
        name={`${prefix}Amt`}
        value={form[`${prefix}Amt`]}
        onChange={handleChange}
      />
    </div>
  );
}
