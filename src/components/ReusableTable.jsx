import { useRef, useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExpandButton from "./ExpandButton";

import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PdfLogo from "../assets/pdf-file-svgrepo-com.svg";
import ExcelLogo from "../assets/excel-file-svgrepo-com.svg";
import { useTranslation } from "react-i18next";

/* ---------------- Draggable Header ---------------- */

function DraggableHeader({ column, index, sortConfig, handleSort }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minWidth: column.minWidth || "120px",
    maxWidth: column.maxWidth || "300px",
  };

  const align =
    column.align === "center"
      ? "text-center"
      : column.align === "right"
        ? "text-right"
        : "text-left";

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`py-3 px-2 truncate ${
        index !== 0 ? "border-l border-zinc-100" : ""
      } ${align}`}
    >
      <div className="flex items-center gap-4">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-zinc-400 hover:text-zinc-600"
        >
          ⋮⋮
        </span>

        <button
          onClick={() => handleSort(column.key)}
          className="flex items-center gap-1 select-none"
        >
          {column.label}
          {sortConfig?.key === column.key && (
            <span className="text-xs">
              {sortConfig.direction === "asc" ? "▲" : "▼"}
            </span>
          )}
        </button>
      </div>
    </th>
  );
}

/* ---------------- Main Table ---------------- */

export default function ReusableTable({
  title,
  columns = [],
  data = [],
  rowClass,
  footerRow,
}) {
  const tableRef = useRef();

  /* ---------------- Column Order ---------------- */

  const [columnOrder, setColumnOrder] = useState(columns);

  useEffect(() => {
    setColumnOrder(columns);
  }, [columns]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columnOrder.findIndex((c) => c.key === active.id);
    const newIndex = columnOrder.findIndex((c) => c.key === over.id);

    setColumnOrder((items) => arrayMove(items, oldIndex, newIndex));
  };

  /* ---------------- Sorting ---------------- */

  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    setPage(1);

    setSortConfig((prev) => {
      if (prev?.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { key, direction } = sortConfig;

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  /* ---------------- Pagination ---------------- */

  const rowsPerPage = 20;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    if (sortedData.length <= rowsPerPage) return sortedData;

    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page]);

  /* ---------------- Cell Popover ---------------- */

  const [activeCell, setActiveCell] = useState(null);

  /* ---------------- Export ---------------- */

  const exportExcel = () => {
    const allData = footerRow ? [...data, footerRow] : data;

    const sheetData = allData.map((row) => {
      const obj = {};
      columnOrder.forEach((col) => {
        obj[col.label] = col.exportValue ? col.exportValue(row) : row[col.key];
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  const exportPDF = () => {
    const pdf = new jsPDF({ orientation: "landscape" });

    pdf.setFontSize(16);
    pdf.text(title, 14, 20);

    const headers = columnOrder.map((col) => col.label);
    const allData = footerRow ? [...data, footerRow] : data;

    const rows = allData.map((row) =>
      columnOrder.map((col) =>
        col.exportValue ? col.exportValue(row) : row[col.key],
      ),
    );

    autoTable(pdf, {
      startY: 30,
      head: [headers],
      body: rows,
    });

    pdf.save(`${title}.pdf`);
  };

  const { t } = useTranslation("common");
  return (
    <div className="w-full ">


      {/* Export */}
      <div className="w-full   flex justify-end items-center gap-2 mb-4">
        <p className="text-sm font-extralight">{t("exportAs")}:</p>

        <ExpandButton
          onClick={exportExcel}
          className="px-3 py-2 text-sm bg-emerald-500
         text-white rounded-md hover:bg-emerald-600"
          icon={<img src={ExcelLogo} alt="Excel" className="w-4 h-4" />}
          label={"Excel"}
        />
        <ExpandButton
          onClick={exportPDF}
          className="px-3 py-2 text-sm bg-gray-600 text-white 
           rounded-md hover:bg-gray-800"
          icon={<img src={PdfLogo} alt="PDF" className="w-4 h-4" />}
          label={"PDF"}
        />
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-zinc-600 p-6 dark:bg-zinc-800 dark:border-zinc-100 dark:text-zinc-300">
        <h3 className=" w-full text-left text-lg font-semibold text-zinc-600 mb-4 dark:text-zinc-300">{title}</h3>

        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={columnOrder.map((c) => c.key)}
            strategy={horizontalListSortingStrategy}
          >
            <div className=" w-full  overflow-x-auto ">
              <table className="min-w-full text-sm table-fixed">
                <thead className="border-b border-zinc-600 text-[#6b7280] dark:text-zinc-200 dark:border-zinc-100">
                  <tr>
                    {columnOrder.map((col, i) => (
                      <DraggableHeader
                        key={col.key}
                        column={col}
                        index={i}
                        sortConfig={sortConfig}
                        handleSort={handleSort}
                      />
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((row, i) => (
                    <tr
                      key={i}
                      className={`${
                        rowClass ? rowClass(row, i) : ""
                      } border-b border-zinc-600 hover:bg-[#f3f4f6] dark:border-zinc-100 dark:hover:bg-zinc-700 `}
                    >
                      {columnOrder.map((col) => {
                        const align =
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                              ? "text-right"
                              : "text-left";

                        const rawValue = row[col.key];
                        const displayValue = col.render
                          ? col.render(row)
                          : rawValue;

                        return (
                          <td
                            key={col.key}
                            style={{
                              minWidth: col.minWidth || "120px",
                              maxWidth: col.maxWidth || "300px",
                            }}
                            className={`py-3 px-2 truncate overflow-hidden whitespace-nowrap ${align} ${
                              col.expandable !== false ? "cursor-pointer" : ""
                            }`}
                            title={rawValue}
                            onClick={(e) => {
                              if (col.expandable === false) return;

                              setActiveCell({
                                value: rawValue,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
                          >
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>

                {/* Footer */}
                {footerRow && (
                  <tfoot>
                    <tr className="font-bold bg-zinc-100 border-t border-zinc-600 dark:bg-zinc-700 dark:border-zinc-100">
                      {columnOrder.map((col) => (
                        <td key={col.key} className="py-3 px-2">
                          {col.render
                            ? col.render(footerRow)
                            : footerRow[col.key]}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </SortableContext>
        </DndContext>

        {/* Pagination */}
        {sortedData.length > rowsPerPage && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1 border rounded-full border-zinc-600 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1 border rounded-full border-zinc-600 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popover */}
      {activeCell && (
        <div
          className="fixed z-50 bg-white border border-zinc-300 shadow-lg rounded-md p-3 max-w-sm wrap-break-words"
          style={{
            top: activeCell.y + 10,
            left: activeCell.x + 10,
          }}
          onClick={() => setActiveCell(null)}
        >
          {String(activeCell.value)}
        </div>
      )}
    </div>
  );
}
