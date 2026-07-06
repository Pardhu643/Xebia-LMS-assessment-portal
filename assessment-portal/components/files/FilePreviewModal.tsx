import React, { useState, useEffect } from "react";
import { X, Download, FileText, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  originalName: string;
  mimeType?: string;
  fileSize?: number | string;
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl,
  originalName,
  mimeType,
  fileSize
}: FilePreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  
  // SheetJS States for spreadsheets
  const [sheets, setSheets] = useState<{ [sheetName: string]: any[][] }>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>("");

  // TXT/CSV raw text content
  const [textContent, setTextContent] = useState<string>("");

  const formatSize = (size?: number | string) => {
    if (!size) return "0.0 MB";
    if (typeof size === "string") return size;
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileType = (name: string, type?: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (type?.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) return "image";
    if (type?.includes("pdf") || ext === "pdf") return "pdf";
    if (type?.includes("word") || ["docx", "doc"].includes(ext || "")) return "docx";
    if (type?.includes("sheet") || type?.includes("csv") || ["xlsx", "xls", "csv"].includes(ext || "")) return "spreadsheet";
    if (type?.startsWith("text/") || ["txt", "md"].includes(ext || "")) return "text";
    return "unsupported";
  };

  const fileType = getFileType(originalName, mimeType);

  useEffect(() => {
    if (!isOpen || !fileUrl) return;

    const loadFileData = async () => {
      setLoading(true);
      setError(null);
      setHtmlContent("");
      setSheets({});
      setSheetNames([]);
      setActiveSheet("");
      setTextContent("");

      try {
        if (fileType === "docx") {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error("Failed to load file contents.");
          
          const contentType = res.headers.get("content-type");
          const contentLength = res.headers.get("content-length");
          const arrayBuffer = await res.arrayBuffer();
          
          // Verify first 16 bytes
          const uint8Array = new Uint8Array(arrayBuffer.slice(0, 16));
          const hex = Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join(' ');
          const firstBytesAscii = String.fromCharCode(...Array.from(uint8Array).map(b => (b >= 32 && b <= 126) ? b : 46));
          
          console.log("[DOCX Verification Log]");
          console.log("Content-Type:", contentType);
          console.log("Content-Length:", contentLength);
          console.log("First 16 bytes (Hex):", hex);
          console.log("First 16 bytes (ASCII):", firstBytesAscii);
          
          const hasZipHeader = uint8Array[0] === 0x50 && uint8Array[1] === 0x4B; // 'P' 'K'
          if (!hasZipHeader) {
            console.error("Invalid ZIP/DOCX header! First characters:", firstBytesAscii.slice(0, 2));
            throw new Error(`Invalid file format: server did not return a valid DOCX binary (Header: '${firstBytesAscii.slice(0, 4)}').`);
          }
          
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setHtmlContent(result.value || "<p className='text-text-muted italic text-center'>Empty document.</p>");
        } else if (fileType === "spreadsheet") {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error("Failed to load spreadsheet contents.");
          const arrayBuffer = await res.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          
          const sheetDataMap: { [name: string]: any[][] } = {};
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            // Convert to 2D Array of rows and columns
            const json = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
            sheetDataMap[sheetName] = json;
          });

          setSheets(sheetDataMap);
          setSheetNames(workbook.SheetNames);
          if (workbook.SheetNames.length > 0) {
            setActiveSheet(workbook.SheetNames[0]);
          }
        } else if (fileType === "text") {
          const res = await fetch(fileUrl);
          if (!res.ok) throw new Error("Failed to load text file contents.");
          const text = await res.text();
          setTextContent(text);
        }
      } catch (err: any) {
        console.error("Error previewing file:", err);
        setError(err.message || "An error occurred while loading file preview.");
      } finally {
        setLoading(false);
      }
    };

    loadFileData();
  }, [isOpen, fileUrl, fileType]);

  const handleDownload = async () => {
    try {
      const downloadUrl = fileUrl.includes("/files/preview/") 
        ? fileUrl.replace("/files/preview/", "/files/download/") 
        : fileUrl;
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      window.open(fileUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-border rounded-2xl w-full max-w-5xl overflow-hidden shadow-xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-primary p-4 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider">Document Viewer</h3>
              <span className="text-xs text-white/70 block mt-0.5">
                {originalName} ({formatSize(fileSize)})
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white cursor-pointer transition-all font-bold"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-[#F7F8FC] p-6 overflow-auto flex flex-col">
          {loading && fileType !== "image" && fileType !== "pdf" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-primary w-8 h-8" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Generating Live Preview...</span>
            </div>
          )}

          {error && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8 bg-white border border-border rounded-2xl max-w-md mx-auto shadow-2xs">
              <AlertCircle className="text-rose-500 w-10 h-10" />
              <p className="text-sm font-bold text-foreground">Failed to render live preview</p>
              <p className="text-xs text-text-muted leading-relaxed font-semibold">{error}</p>
              <button 
                onClick={handleDownload} 
                className="mt-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs py-2 px-5 rounded-xl shadow-xs cursor-pointer"
              >
                Download Instead
              </button>
            </div>
          )}

          {!error && (
            <div className={`flex-1 flex flex-col min-h-0 bg-white border border-border rounded-2xl p-4 overflow-auto shadow-3xs ${
              (loading && fileType !== "image" && fileType !== "pdf") ? "hidden" : ""
            }`}>
              {fileType === "image" && (
                <div className="flex-1 flex items-center justify-center p-4">
                  <img
                    src={fileUrl}
                    alt={originalName}
                    className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-xs"
                  />
                </div>
              )}

              {fileType === "pdf" && (
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-none rounded-xl bg-white min-h-[55vh]"
                  title="PDF Viewer"
                />
              )}

              {fileType === "docx" && !loading && (
                <div 
                  className="prose max-w-none text-xs p-4 overflow-auto leading-relaxed text-foreground select-text"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              )}

              {fileType === "spreadsheet" && !loading && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Sheet Selector Tabs */}
                  {sheetNames.length > 1 && (
                    <div className="flex border-b border-border/85 pb-2 mb-3 gap-1 overflow-x-auto">
                      {sheetNames.map((name) => (
                        <button
                          key={name}
                          onClick={() => setActiveSheet(name)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeSheet === name
                              ? "bg-primary text-white shadow-3xs"
                              : "bg-gray-100 text-text-muted hover:bg-gray-200"
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Spreadsheet Grid */}
                  <div className="flex-1 overflow-auto border border-border rounded-xl">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <tbody>
                        {(sheets[activeSheet] || []).map((row, rIdx) => (
                          <tr 
                            key={rIdx} 
                            className={`border-b border-border/50 hover:bg-[#F7F8FC]/50 ${
                              rIdx === 0 ? "bg-gray-50/80 font-black text-foreground" : "text-text-muted font-semibold"
                            }`}
                          >
                            {row.map((cell, cIdx) => (
                              <td 
                                key={cIdx} 
                                className="p-2.5 border-r border-border/50 truncate max-w-[180px]"
                                title={cell !== undefined ? String(cell) : ""}
                              >
                                {cell !== undefined ? String(cell) : ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {fileType === "text" && !loading && (
                <pre className="flex-1 whitespace-pre-wrap font-mono text-[11px] p-4 bg-gray-50 border border-border rounded-xl overflow-auto select-text text-foreground">
                  {textContent}
                </pre>
              )}

              {fileType === "unsupported" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <FileText className="w-12 h-12 text-text-muted" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Preview is not available for this file type.</p>
                    <p className="text-xs text-text-muted font-semibold mt-1">
                      You can download this file to open it in its original application.
                    </p>
                  </div>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary hover:bg-primary-dark text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs"
                  >
                    Open in New Tab
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-white flex justify-between items-center flex-shrink-0">
          <button
            onClick={handleDownload}
            className="bg-accent hover:bg-accent-dark text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase cursor-pointer shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download size={14} /> Download File
          </button>
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase cursor-pointer transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
