import React from "react";
import { Certificate } from "../../types";

interface CertificateTemplateProps {
  certificate: Certificate;
}

export default function CertificateTemplate({ certificate }: CertificateTemplateProps) {
  const {
    studentName,
    subject,
    marksObtained,
    totalMarks,
    percentage,
    issueDate,
    id
  } = certificate;

  // Formatting date nicely if it's ISO format
  const formattedDate = React.useMemo(() => {
    try {
      if (issueDate.includes("-")) {
        const parts = issueDate.split("T")[0].split("-");
        if (parts.length === 3) {
          return `${parts[0]}-${parts[1]}-${parts[2]}`;
        }
      }
      return issueDate;
    } catch {
      return issueDate;
    }
  }, [issueDate]);

  const displaySubject = subject || certificate.assessmentTitle || "General Curriculum";

  return (
    <div 
      id="certificate-container"
      className="relative bg-white border-[16px] border-[#84117C] p-12 flex flex-col justify-between select-none shadow-2xl mx-auto overflow-hidden text-zinc-800"
      style={{
        width: "1123px",
        height: "794px",
        fontFamily: "'Times New Roman', Times, serif"
      }}
    >
      {/* Decorative Gold Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(132,17,124,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(132,17,124,0.03),transparent_40%)] pointer-events-none" />

      {/* Outer elegant double border */}
      <div className="absolute inset-4 border-2 border-double border-[#84117C]/40 pointer-events-none rounded-sm" />

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col justify-between border border-[#84117C]/15 p-8 rounded-lg">
        {/* Top Header Row with Logo */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img
              src="/images/xebia-logo.png"
              alt="Xebia Logo"
              className="w-14 h-14 object-contain"
            />
            <div className="flex flex-col text-left font-sans">
              <span className="text-[#84117C] font-extrabold text-lg tracking-wider leading-none">Xebia</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Academy</span>
            </div>
          </div>
          <div className="text-right text-[#84117C]/30 font-serif italic text-xs">
            Official Certification
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-1">
          <h1 className="text-5xl font-extrabold tracking-wide text-[#84117C] font-serif uppercase">
            Certificate of Completion
          </h1>
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#84117C]/40 to-transparent mx-auto mt-2" />
        </div>

        {/* Recipient Text */}
        <div className="text-center space-y-4">
          <p className="text-lg text-zinc-500 font-sans italic">
            This is to certify that
          </p>
          <h2 className="text-5xl font-bold text-[#84117C] tracking-wide my-3 py-1 italic font-serif">
            {studentName}
          </h2>
          <p className="text-lg text-zinc-500 font-sans italic">
            has successfully completed the subject
          </p>
          <h3 className="text-3xl font-extrabold text-[#6C1D5F] font-serif tracking-wide">
            {displaySubject}
          </h3>
          <p className="text-base text-zinc-600 font-sans mt-3">
            with an overall score of <strong className="text-[#84117C] font-black">{percentage.toFixed(2)}%</strong>
          </p>
        </div>

        {/* Footer Details Grid */}
        <div className="grid grid-cols-3 items-end text-center mt-6 pt-4 border-t border-zinc-100 font-sans">
          {/* Issue Date */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-[#6C1D5F] uppercase tracking-wider">Issue Date</span>
            <span className="text-sm font-semibold text-zinc-800 mt-1">{formattedDate}</span>
          </div>

          {/* Issued by Xebia Academy & Gold Stamp */}
          <div className="flex flex-col items-center justify-center -mb-8">
            <span className="text-xs font-bold text-[#6C1D5F] uppercase tracking-wider mb-2">Issued by</span>
            <span className="text-sm font-semibold text-zinc-800">Xebia Academy</span>
            <div className="w-20 h-20 my-2 relative flex items-center justify-center">
              <img
                src="/images/gold-stamp.png"
                alt="Gold Stamp Badge"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* CEO Signature Block underneath */}
            <div className="flex flex-col items-center mt-1">
              <div className="h-10 relative w-36 flex items-center justify-center">
                <img
                  src="/images/ceo-signature.png"
                  alt="Anand Sahay Signature"
                  className="max-h-full object-contain"
                />
              </div>
              <span className="text-xs font-extrabold text-zinc-800 mt-1 border-t border-zinc-200 pt-1 w-32">Anand Sahay</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CEO, Xebia</span>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-[#6C1D5F] uppercase tracking-wider">Certificate ID</span>
            <span className="text-[9px] text-zinc-400 font-mono mt-1 w-48 break-all select-all font-semibold uppercase">{id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
