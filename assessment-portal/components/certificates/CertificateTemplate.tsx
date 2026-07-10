import React from "react";
import { Certificate } from "../../types";

interface CertificateTemplateProps {
  certificate: Certificate;
}

export default function CertificateTemplate({ certificate }: CertificateTemplateProps) {
  const {
    studentName,
    subject,
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
      style={{
        position: "relative",
        backgroundColor: "#ffffff",
        border: "16px solid #84117C",
        padding: "48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        width: "1123px",
        height: "794px",
        fontFamily: "'Times New Roman', Times, serif",
        color: "#27272a",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
    >
      {/* Decorative Gold Radial Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle at bottom left, rgba(132, 17, 124, 0.03), transparent 40%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle at top right, rgba(132, 17, 124, 0.03), transparent 40%)",
        pointerEvents: "none"
      }} />

      {/* Outer elegant double border */}
      <div style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        right: "16px",
        bottom: "16px",
        border: "2px double rgba(132, 17, 124, 0.4)",
        pointerEvents: "none",
        borderRadius: "4px"
      }} />

      {/* Main Content Area */}
      <div style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid rgba(132, 17, 124, 0.15)",
        padding: "32px",
        borderRadius: "8px",
        boxSizing: "border-box",
        height: "100%"
      }}>
        {/* Top Header Row with Logo */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <img
              src="/images/xebia-logo.png"
              alt="Xebia Logo"
              style={{
                width: "56px",
                height: "56px",
                objectFit: "contain"
              }}
            />
            <div style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              fontFamily: "sans-serif"
            }}>
              <span style={{
                color: "#84117C",
                fontWeight: "800",
                fontSize: "18px",
                letterSpacing: "0.05em",
                lineHeight: 1
              }}>Xebia</span>
              <span style={{
                fontSize: "10px",
                color: "#71717a",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: "2px"
              }}>Academy</span>
            </div>
          </div>
          <div style={{
            textAlign: "right",
            color: "rgba(132, 17, 124, 0.3)",
            fontFamily: "serif",
            fontStyle: "italic",
            fontSize: "12px"
          }}>
            Official Certification
          </div>
        </div>

        {/* Certificate Title */}
        <div style={{
          textAlign: "center",
          margin: "4px 0"
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            letterSpacing: "0.05em",
            color: "#84117C",
            fontFamily: "serif",
            textTransform: "uppercase",
            margin: 0
          }}>
            Certificate of Completion
          </h1>
          <div style={{
            width: "192px",
            height: "2px",
            background: "linear-gradient(to right, transparent, rgba(132, 17, 124, 0.4), transparent)",
            margin: "8px auto 0 auto"
          }} />
        </div>

        {/* Recipient Text */}
        <div style={{
          textAlign: "center"
        }}>
          <p style={{
            fontSize: "18px",
            color: "#71717a",
            fontFamily: "sans-serif",
            fontStyle: "italic",
            margin: "0 0 8px 0"
          }}>
            This is to certify that
          </p>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#84117C",
            letterSpacing: "0.05em",
            margin: "12px 0",
            padding: "4px 0",
            fontStyle: "italic",
            fontFamily: "serif"
          }}>
            {studentName}
          </h2>
          <p style={{
            fontSize: "18px",
            color: "#71717a",
            fontFamily: "sans-serif",
            fontStyle: "italic",
            margin: "8px 0"
          }}>
            has successfully completed the subject
          </p>
          <h3 style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#6C1D5F",
            fontFamily: "serif",
            letterSpacing: "0.05em",
            margin: "12px 0"
          }}>
            {displaySubject}
          </h3>
          <p style={{
            fontSize: "16px",
            color: "#52525b",
            fontFamily: "sans-serif",
            marginTop: "12px"
          }}>
            with an overall score of <strong style={{ color: "#84117C", fontWeight: "900" }}>{percentage.toFixed(2)}%</strong>
          </p>
        </div>

        {/* Footer Details Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "flex-end",
          textAlign: "center",
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid #f4f4f5",
          fontFamily: "sans-serif"
        }}>
          {/* Issue Date */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#6C1D5F",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>Issue Date</span>
            <span style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#27272a",
              marginTop: "4px"
            }}>{formattedDate}</span>
          </div>

          {/* Issued by Xebia Academy & Gold Stamp */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "-32px"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#6C1D5F",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px"
            }}>Issued by</span>
            <span style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#27272a"
            }}>Xebia Academy</span>
            <div style={{
              width: "80px",
              height: "80px",
              margin: "8px 0",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <img
                src="/images/gold-stamp.png"
                alt="Gold Stamp Badge"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            
            {/* CEO Signature Block underneath */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "4px"
            }}>
              <div style={{
                height: "40px",
                position: "relative",
                width: "144px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <img
                  src="/images/ceo-signature.png"
                  alt="Anand Sahay Signature"
                  style={{
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <span style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "#27272a",
                marginTop: "4px",
                borderTop: "1px solid #e4e4e7",
                paddingTop: "4px",
                width: "128px"
              }}>Anand Sahay</span>
              <span style={{
                fontSize: "10px",
                color: "#71717a",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>CEO, Xebia</span>
            </div>
          </div>

          {/* Certificate ID */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#6C1D5F",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>Certificate ID</span>
            <span style={{
              fontSize: "9px",
              color: "#a1a1aa",
              fontFamily: "monospace",
              marginTop: "4px",
              width: "192px",
              wordBreak: "break-all",
              userSelect: "all",
              fontWeight: "600",
              textTransform: "uppercase"
            }}>{id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
