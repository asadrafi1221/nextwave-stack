/* eslint-disable no-plusplus */
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import type { TablePaginationProps } from "./types";

export function TablePagination({
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
}: TablePaginationProps) {
  const {
    pageIndex,
    pageSize,
    pageCount,
    canPreviousPage,
    canNextPage,
    totalRows,
  } = paginationInfo;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages: number[] = [];

    if (pageCount <= maxVisiblePages) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(0, pageIndex - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(pageCount - 1, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="border-t text-[var(--primaryColor)] bg-[var(--primaryBg)] border-gray-200 px-2 py-3 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
        <div className="hidden items-center space-x-2 md:flex">
          <span className="text-[10px] md:text-sm ">Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border text-[var(--primaryColor)] bg-[var(--primaryBg)] border-gray-300 px-2 py-1 text-[10px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-xxs md:text-sm ">entries</span>
        </div>

        <div className="hidden items-center space-x-2 text-xxs md:flex md:text-sm">
          <span>
            Showing {startRow} to {endRow} of {totalRows} entries
          </span>
        </div>
        <div className="flex items-center justify-between space-x-1 md:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xxs md:text-sm ">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border text-[var(--primaryColor)] bg-[var(--primaryBg)] border-gray-300 px-2 py-1 text-xxs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-xxs md:text-sm ">entries</span>
          </div>

          <div className="flex items-center space-x-2 text-xxs md:text-sm ">
            <span>
              Showing {startRow} to {endRow} of {totalRows} entries
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-[var(--primaryColor)] bg-[var(--primaryBg)]">
          <button
            type="button"
            onClick={() => onPageChange(0)}
            disabled={!canPreviousPage}
            className="inline-flex items-center rounded-md border border-gray-300  px-2 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50   md:text-sm lg:text-sm"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-3 w-3 md:h-4 md:w-4 lg:h-4 lg:w-4" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
            className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50   md:text-sm lg:text-sm"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 lg:h-4 lg:w-4" />
          </button>

          <div className="flex items-center space-x-1 text-[var(--primaryColor)] bg-[var(--primaryBg)]">
            {pageNumbers.map((pageNum) => {
              const isCurrentPage = pageNum === pageIndex;
              return (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors md:px-3 md:py-1 md:text-sm lg:px-3 lg:py-1 lg:text-sm ${
                    isCurrentPage
                      ? "border-blue-500  shadow-sm"
                      : "border-gray-300  "
                  }`}
                  aria-current={isCurrentPage ? "page" : undefined}
                  aria-label={`Go to page ${pageNum + 1}`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNextPage}
            className={`inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm lg:text-sm text-[var(--primaryColor)]  hover:opacity-80`}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 lg:h-4 lg:w-4" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(pageCount - 1)}
            disabled={!canNextPage}
            className={`inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm lg:text-sm text-[var(--primaryColor)] hover:opacity-8`}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-3 w-3 md:h-4 md:w-4 lg:h-4 lg:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
