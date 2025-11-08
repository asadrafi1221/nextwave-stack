/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable default-case */
import {
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  FileX,
  Globe,
  Loader2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import type { ExportDropdownProps, ExportParams } from './types';

export function ExportDropdown<T extends Record<string, any>>({
  table,
  data,
  filename = 'table-data',
  onExport,
  onExportAll,
  exportFormats = ['csv', 'json', 'txt'],
  exportLoading = false,
  apiState = {},
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const dropdownHeight = 500;
    const dropdownWidth = 320;

    const position: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };

    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const spaceRight = viewportWidth - buttonRect.left;
    const spaceLeft = buttonRect.right;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      position.bottom = viewportHeight - buttonRect.top + 8;
      position.maxHeight = Math.min(dropdownHeight, spaceAbove - 16);
    } else if (spaceBelow >= dropdownHeight) {
      position.top = buttonRect.bottom + 8;
      position.maxHeight = Math.min(dropdownHeight, spaceBelow - 16);
    } else {
      if (spaceAbove > spaceBelow) {
        position.bottom = viewportHeight - buttonRect.top + 8;
        position.maxHeight = spaceAbove - 16;
      } else {
        position.top = buttonRect.bottom + 8;
        position.maxHeight = spaceBelow - 16;
      }
    }

    if (spaceRight >= dropdownWidth) {
      position.left = buttonRect.left;
    } else if (spaceLeft >= dropdownWidth) {
      position.right = viewportWidth - buttonRect.right;
    } else {
      position.left = Math.max(8, (viewportWidth - dropdownWidth) / 2);
    }

    return position;
  };

  const getVisibleColumns = () => {
    return table
      .getAllColumns()
      .filter(
        (column: any) =>
          column.getIsVisible() &&
          column.id !== 'select' &&
          column.id !== 'actions',
      )
      .map((column: any) => ({
        id: column.id,
        header:
          typeof column.columnDef.header === 'string'
            ? column.columnDef.header
            : column.id,
      }));
  };

  const getExportData = (exportAll: boolean = false) => {
    const visibleColumns = getVisibleColumns();
    const sourceData = exportAll
      ? data
      : table.getRowModel().rows.map((row: any) => row.original);

    return sourceData.map((row: any) => {
      const exportRow: Record<string, any> = {};
      visibleColumns.forEach((column: any) => {
        exportRow[column.header] = row[column.id];
      });
      return exportRow;
    });
  };

  const convertToCSV = (data: Record<string, any>[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0] ?? {});
    const csvHeaders = headers.join(',');
    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"') || value.includes('\n'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(','),
    );
    return [csvHeaders, ...csvRows].join('\n');
  };

  const convertToTXT = (data: Record<string, any>[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0] ?? '');
    const txtHeaders = headers.join('\t');
    const txtRows = data.map((row) =>
      headers.map((header) => String(row[header] || '')).join('\t'),
    );
    return [txtHeaders, ...txtRows].join('\n');
  };

  const downloadFile = (
    content: string | Blob,
    filename: string,
    mimeType: string,
  ) => {
    const blob =
      content instanceof Blob
        ? content
        : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBuiltInExport = (
    format: 'csv' | 'json' | 'txt',
    exportAll: boolean = false,
  ) => {
    const exportData = getExportData(exportAll);
    if (onExport) {
      onExport(exportData as T[], format);
      setIsOpen(false);
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const baseFilename = `${filename}-${timestamp}`;
    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (format) {
      case 'csv':
        content = convertToCSV(exportData);
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'json':
        content = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'txt':
        content = convertToTXT(exportData);
        mimeType = 'text/plain';
        fileExtension = 'txt';
        break;
    }

    downloadFile(content, `${baseFilename}.${fileExtension}`, mimeType);
    setIsOpen(false);
  };

  const handleApiExport = async (
    format: 'csv' | 'json' | 'txt' | 'xlsx' | 'pdf',
  ) => {
    if (!onExportAll) return;
    setLoadingFormat(format);

    try {
      const visibleColumns = getVisibleColumns();
      const exportParams: ExportParams = {
        format,
        columns: visibleColumns.map((col: any) => col.id),
        sortField: apiState.sortField,
        sortOrder: apiState.sortOrder,
        search: apiState.search,
        filters: apiState.filters,
      };

      const response = await onExportAll(exportParams);

      if (response.success) {
        if (response.data) {
          const timestamp = new Date().toISOString().split('T')[0];
          const defaultFilename = `${filename}-all-${timestamp}.${format}`;
          const finalFilename = response.filename || defaultFilename;

          if (response.data instanceof Blob) {
            downloadFile(response.data, finalFilename, response.data.type);
          } else if (typeof response.data === 'string') {
            const mimeTypes = {
              csv: 'text/csv',
              json: 'application/json',
              txt: 'text/plain',
              xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              pdf: 'application/pdf',
            };
            downloadFile(response.data, finalFilename, mimeTypes[format]);
          } else if (response.data instanceof ArrayBuffer) {
            const blob = new Blob([response.data]);
            downloadFile(blob, finalFilename, 'application/octet-stream');
          }
        } else if (response.url) {
          const link = document.createElement('a');
          link.href = response.url;
          link.target = '_blank';
          link.download = response.filename || `export.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFormat(null);
      setIsOpen(false);
    }
  };

  const builtInFormats = [
    { format: 'csv' as const, label: 'CSV', icon: FileSpreadsheet },
    { format: 'json' as const, label: 'JSON', icon: Database },
    { format: 'txt' as const, label: 'TXT', icon: FileText },
  ];

  const apiFormats = [
    { format: 'xlsx' as const, label: 'Excel', icon: FileSpreadsheet },
    { format: 'pdf' as const, label: 'PDF', icon: FileX },
  ];

  const availableBuiltInFormats = builtInFormats.filter((f) =>
    exportFormats.includes(f.format),
  );
  const availableApiFormats = apiFormats.filter((f) =>
    exportFormats.includes(f.format),
  );

  return (
    <div className="relative text-black bg-white">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={exportLoading}
        className="inline-flex items-center px-3 py-1 text-sm font-medium"
      >
        {exportLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Export
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="flex w-80 flex-col bg-white rounded-md border shadow-lg"
          style={getDropdownPosition()}
        >
          <div className="shrink-0 border-b px-3 py-2 text-xs font-medium uppercase">
            Export Options
          </div>

          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 40px)' }}>
            {availableBuiltInFormats.length > 0 && (
              <div className="border-b px-3 py-2">
                <div className="mb-2 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Quick Export</span>
                </div>
                <p className="mb-3 text-xs">Export visible data only</p>

                {availableBuiltInFormats.map((option) => (
                  <div key={option.format} className="mb-3 last:mb-0">
                    <div className="mb-2 flex items-center">
                      <option.icon className="mr-2 h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleBuiltInExport(option.format, false)}
                        className="flex-1 bg-gray-100 rounded px-2 py-1 text-xs"
                      >
                        Current Page ({table.getRowModel().rows.length} rows)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBuiltInExport(option.format, true)}
                        className="flex-1 bg-gray-100 rounded px-2 py-1 text-xs"
                      >
                        All Visible ({data.length} rows)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {onExportAll && availableApiFormats.length > 0 && (
              <div className="px-3 py-2">
                <div className="mb-2 flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Full Export (API)</span>
                </div>
                <p className="mb-3 text-xs">Export all data with current filters</p>

                {availableApiFormats.map((option) => (
                  <div key={option.format} className="mb-3 last:mb-0">
                    <button
                      type="button"
                      onClick={() => handleApiExport(option.format)}
                      disabled={loadingFormat === option.format}
                      className="flex w-full items-center rounded-md p-2 text-left disabled:opacity-50"
                    >
                      {loadingFormat === option.format ? (
                        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                      ) : (
                        <option.icon className="mr-3 h-4 w-4" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs">{option.label} file export</div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t px-3 py-2 text-xs">
            Export options: Current Page / All Visible / Full API Export
          </div>
        </div>
      )}
    </div>
  );
}
