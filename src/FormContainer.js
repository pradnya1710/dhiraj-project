import React, { useRef } from "react";
import AssestsInvestments from "./AssestsInvestments";
import YearlyExpenses from "./YearlyExpenses";
import Page5 from "./Page5";
import Page6 from "./Page6";
import Page7 from "./Page7";
import html2pdf from "html2pdf.js";

const FormContainer = () => {
  const [form, setForm] = React.useState({
    totalAssets: 0,
    totalLiabilities: 0,
    // put all your form fields here
  });

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

  return (
    <div className="p-4">
      {/* All pages wrapped together */}
      <div ref={pdfRef} className="space-y-6">
        <Page1 form={form} setForm={setForm} />
        <Page2 form={form} setForm={setForm} />
        <Page3 form={form} setForm={setForm} />
        <Page4 form={form} setForm={setForm} />
        <Page5 form={form} setForm={setForm} />
        <Page6 form={form} setForm={setForm} />
        <Page7 form={form} setForm={setForm} hidePrintButton={true} />
      </div>

      {/* Global Print Button */}
      <div className="bg-white shadow-md rounded-xl p-4 mt-6">
        <button
          onClick={handleDownloadPDF}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow hover:bg-red-700"
        >
          📄 Print Full Report
        </button>
      </div>
    </div>
  );
};

export default FormContainer;
