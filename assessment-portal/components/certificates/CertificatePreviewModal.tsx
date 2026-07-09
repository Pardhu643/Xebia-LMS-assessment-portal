import React from "react";
import { X, Download, Award } from "lucide-react";
import { Certificate } from "../../types";
import { apiService } from "../../lib/apiService";

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  pdfLoading: boolean;
  onIframeLoad: () => void;
}

export default function CertificatePreviewModal({
  isOpen,
  onClose,
  certificate,
  pdfLoading,
  onIframeLoad
}: CertificatePreviewModalProps) {
  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-[#F7F8FC]">
          <div className="flex items-center gap-2 text-[#84117C]">
            <Award size={20} />
            <span className="text-sm font-black uppercase tracking-wider">Xebia Certificate Preview</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-border rounded-xl text-text-muted hover:bg-white hover:text-rose-500 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body / Inline PDF Viewer */}
        <div className="flex-1 bg-[#F1F3F9] p-4 flex items-center justify-center overflow-hidden relative">
          {pdfLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <iframe
            src={apiService.getCertificatePreviewUrl(certificate.id)}
            onLoad={onIframeLoad}
            className="w-full h-full rounded-xl border border-border bg-white"
            title="Certificate PDF Viewer"
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-[#F7F8FC]">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            ID: {certificate.id}
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-text-muted hover:bg-white cursor-pointer"
            >
              Close
            </button>
            <a
              href={apiService.getCertificateDownloadUrl(certificate.id)}
              download={`certificate_${certificate.id}.pdf`}
              className="px-5 py-2 bg-[#84117C] hover:bg-[#6c0e66] text-white font-bold rounded-xl text-xs uppercase cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download size={14} /> Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
