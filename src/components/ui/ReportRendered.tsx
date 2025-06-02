import React from "react";
import ImageScroller from "./ImageScroller";

const MOCK_IMAGE = "https://picsum.photos/800/1600";

export default function ReportRendered({
  onClose,
  onPrint,
}: {
  onClose?: () => void;
  onPrint?: () => void;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          flex: "0 0 90%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageScroller src={MOCK_IMAGE} />
      </div>
      <div
        style={{
          flex: "0 0 10%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 2rem",
        }}
      >
        <button
          style={{
            background: "#e11d48",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "12px 32px",
            fontWeight: 600,
            fontSize: 18,
            cursor: "pointer",
          }}
          onClick={onClose || (() => alert("Close"))}
        >
          Close
        </button>
        <button
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "12px 32px",
            fontWeight: 600,
            fontSize: 18,
            cursor: "pointer",
          }}
          onClick={onPrint || (() => alert("Print"))}
        >
          Print
        </button>
      </div>
    </div>
  );
}
