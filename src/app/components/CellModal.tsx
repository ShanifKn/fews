// components/CellModal.tsx

import React from "react";

interface CellModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: { [key: string]: any };
}

const CellModal: React.FC<CellModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded max-w-7xl w-full">
        <h2 className="text-xl mb-4 font-semibold underline">Details</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(data).map((key) => (
            <div
              key={key}
              className="grid gap-1">
              <strong className="text-gray-600">{key.replace(/_/g, " ")}</strong>
              <span>{data[key]}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CellModal;
