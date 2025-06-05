import React, { useState } from "react";
import FullScreenImageModal from "./FullScreenImageModal";

const ReportRendered = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Your existing report content
  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      <FullScreenImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPrint={() => {
          console.log("print");
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: `<img src="https://picsum.photos/1200/1600?random=${Math.random()}" alt="Document mockup" style="width: 100%; height: auto; display: block;" />`,
          }}
        />
      </FullScreenImageModal>
    </div>
  );
};

export default ReportRendered;
