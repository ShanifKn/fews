"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, usePagination, Column, TableInstance, Row, TableState } from "react-table";
import Modal from "./Modal";
import CellModal from "./CellModal";

interface FMCSAData {
  created_dt: string;
  data_source_modified_dt: string;
  entity_type: string;
  operating_status: string;
  legal_name: string;
  dba_name: string;
  physical_address: string;
  phone: string;
  p_zip_code: string;
  mc_mx_ff_number: string;
  power_units: number;
  out_of_service_date: string;
  [key: string]: any;
}

interface Props {
  data: FMCSAData[];
}

interface ExtendedTableInstance<D extends object> extends TableInstance<D> {
  page: Row<D>[];
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  pageOptions: number[];
  setFilter: any;
  state: any;
}

const FMCSATable: React.FC<Props> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FMCSAData | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (data.length > 0) {
      setIsLoading(false);
    }
  }, [data]);

  const columns: Column<FMCSAData>[] = useMemo(
    () => [
      { Header: "Created_DT", accessor: "created_dt", Cell: ({ value }: { value: string }) => formatDate(value) },
      { Header: "Modified_DT", accessor: "data_source_modified_dt", Cell: ({ value }: { value: string }) => formatDate(value) },
      { Header: "Entity", accessor: "entity_type" },
      { Header: "Operating status", accessor: "operating_status" },
      { Header: "Legal name", accessor: "legal_name" },
      { Header: "DBA name", accessor: "dba_name" },
      { Header: "Physical address", accessor: "physical_address" },
      { Header: "Phone", accessor: "phone" },
      { Header: "DOT", accessor: "p_zip_code" },
      { Header: "MC/MX/FF", accessor: "mc_mx_ff_number" },
      { Header: "Power units", accessor: "power_units" },
      { Header: "Out of service date", accessor: "out_of_service_date", Cell: ({ value }: { value: string }) => formatDate(value) },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    state: { pageIndex },
    canPreviousPage,
    canNextPage,
    pageOptions,
    previousPage,
    nextPage,
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 } as Partial<TableState<FMCSAData>> & {
        pageSize: number;
        pageIndex: number;
      },
    },
    useFilters,
    usePagination
  ) as ExtendedTableInstance<FMCSAData>;

  const handleFilter = (columnId: string, value: string) => {
    setFilter(columnId, value || undefined);
  };

  const handleButtonClick = (row: FMCSAData) => {
    setSelectedRow(row);
  };

  const formatDate = (dateStr: string) => {
    // Attempt to parse the date string
    const date = new Date(dateStr);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toISOString().split("T")[0];
  };

  return (
    <div className="p-4 relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-5 px-4 py-2 bg-blue-500 text-white rounded text-xl">
        Filter
      </button>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={`header-group-${headerGroup.id}`}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-4 py-2 border text-sm 2xl:text-base"
                      key={`header-${column.id}`}>
                      {column.render("Header")}
                    </th>
                  ))}
                  <th className="px-4 py-2 border"></th> {/* Empty header for button column */}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200">
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={`row-${row.id}`}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-2 border relative text-xs  2xl:text-sm h-5 "
                        key={`cell-${cell.column.id}-${row.id}`}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleButtonClick(row.original)}
                        className="px-2 py-1 bg-green-500 text-white rounded">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className=" flex justify-between items-center p-4 bg-white shadow-md">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="px-3 py-1 bg-gray-300 rounded">
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="px-3 py-1 bg-gray-300 rounded">
          Next
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        columns={columns.map((column) => ({
          Header: column.Header as string,
          accessor: column.accessor as string,
        }))}
        onFilter={handleFilter}
      />{" "}
      {selectedRow && (
        <CellModal
          isOpen={!!selectedRow}
          onClose={() => setSelectedRow(null)}
          data={selectedRow}
        />
      )}
    </div>
  );
};

export default FMCSATable;
