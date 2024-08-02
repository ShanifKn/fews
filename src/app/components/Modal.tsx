// components/Modal.tsx

import React, { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: { Header: string; accessor: string }[];
  onFilter: (columnId: string, value: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, columns, onFilter }) => {
  const [selectedColumn, setSelectedColumn] = useState(columns[0]?.accessor || "");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedColumn(columns[0]?.accessor || "");
      setFilterValue("");
    }
  }, [isOpen, columns]);

  const handleFilter = () => {
    onFilter(selectedColumn, filterValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-7 rounded">
        <h2 className="text-xl mb-4">Filter Data</h2>
        <div className="mb-4">
          <label className="block mb-2">Select Column</label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="p-2 border rounded w-full">
            {columns.map((column) => (
              <option
                key={column.accessor}
                value={column.accessor}>
                {column.Header}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Filter Value</label>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2">
            Cancel
          </button>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-500 text-white rounded">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
