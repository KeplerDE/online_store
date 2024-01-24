"use client";

import { useProduct } from "@/context/product";

export default function Modal({ children }) {
  // Использование контекста
  const { closeModal } = useProduct();

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", maxHeight: "100vh", overflow: "auto" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
