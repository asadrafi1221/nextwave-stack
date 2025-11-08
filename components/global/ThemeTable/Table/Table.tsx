/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { EllipsisVertical, Link, Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ColumnVisibility } from './ColumnVisibility'
import { ExportDropdown } from './ExportDropdown'
import { useTable } from './hooks/useTable'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { TablePagination } from './TablePagination'
import type { TableProps } from './types'
import TableDropdown from './TableDropdown'

export function Table<T extends Record<string, any>>(props: TableProps<T>) {
  const {
    enablePagination = true,
    loadonAction,
    enableColumnVisibility = true,
    enableExport = true,
    pageSizeOptions = [10, 20, 30, 40, 50, 100],
    loading = false,
    emptyMessage = 'No data available',
    className = '',
    exportFilename = 'table-data',
    onExport,
    onExportAll,
    exportFormats = ['csv', 'json', 'txt'],
    exportLoading = false,
    apiControlled = false,
    urlSync = false,
    isActionsDisabled,
  } = props

  const { table, selectedRows, clearSelection, resetColumnSizes, paginationInfo, apiState, urlParams } = useTable(props)

  const [showShareUrl, setShowShareUrl] = useState(false)
  const shareDropdownRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)

  const shareableUrl = urlParams?.getShareableUrl() || ''
  const paramsString = urlParams?.getParamsString() || ''

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        setShowShareUrl(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDropdownPosition = () => {
    if (!shareButtonRef.current) return {}
    const buttonRect = shareButtonRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const dropdownHeight = 280
    const dropdownWidth = 384

    const position: React.CSSProperties = { position: 'fixed', zIndex: 9999 }
    const spaceBelow = viewportHeight - buttonRect.bottom
    const spaceAbove = buttonRect.top
    const spaceRight = viewportWidth - buttonRect.left
    const spaceLeft = buttonRect.right

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      position.bottom = viewportHeight - buttonRect.top + 8
      position.maxHeight = spaceAbove - 16
    } else {
      position.top = buttonRect.bottom + 8
      position.maxHeight = spaceBelow - 16
    }

    if (spaceRight >= dropdownWidth) {
      position.left = buttonRect.left
    } else if (spaceLeft >= dropdownWidth) {
      position.right = viewportWidth - buttonRect.right
    } else {
      position.left = Math.max(8, (viewportWidth - dropdownWidth) / 2)
    }

    return position
  }

  return (
    <div className={`overflow-hidden rounded-lg border font-poppins shadow-sm ${className}`}>
      <div className="flex flex-col items-end justify-between border-b px-3 py-2 md:flex-row md:items-center md:px-6 md:py-4">
        <div className="flex items-center space-x-4">
          {props.enableSelection && selectedRows.length > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
              </span>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            </div>
          ) : (
            <span className="text-xxs md:text-xs lg:text-sm">
              {apiControlled
                ? `${paginationInfo.totalRows} total rows`
                : `${table.getFilteredRowModel().rows.length} total rows`}
            </span>
          )}
        </div>

        <TableDropdown
          leftIcon={EllipsisVertical}
          label="Table Options"
          items={[
            {
              visible: urlSync && urlParams,
              render: () => (
                <div className="relative">
                  <button
                    type="button"
                    ref={shareButtonRef}
                    style={{
                      backgroundColor: 'var(--primaryBg)',
                      color: 'var(--primaryColor)',
                    }}
                    onClick={() => setShowShareUrl(!showShareUrl)}
                    className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium md:px-3 md:py-1 md:text-sm lg:px-3 lg:py-1 lg:text-sm"
                  >
                    <Share2 className="mr-2 h-4 w-4 md:mr-4" />
                    Share
                  </button>

                  {showShareUrl && (
                    <div
                      ref={shareDropdownRef}
                      className="w-96 overflow-hidden rounded-md border shadow-lg"
                      style={{
                        ...getDropdownPosition(),
                        background: 'var(--primaryBg)',
                        color: 'var(--primaryColor)',
                      }}
                    >
                      <div className="max-h-full overflow-y-auto p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-medium">Share Table State</h3>
                          <button
                            type="button"
                            onClick={() => setShowShareUrl(false)}
                            className="text-lg"
                            style={{ color: 'var(--secondaryColor)' }}
                          >
                            ×
                          </button>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <label className="mb-1 block text-xs font-medium">Shareable URL</label>
                            <div className="flex">
                              <input
                                type="text"
                                value={shareableUrl}
                                readOnly
                                className="flex-1 rounded-l-md border px-3 py-2 text-sm"
                                style={{
                                  color: 'var(--primaryColor)',
                                  backgroundColor: 'var(--primaryBg)',
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => copyToClipboard(shareableUrl)}
                                className="rounded-r-md border border-l-0 px-3 py-2"
                                style={{
                                  color: 'var(--secondaryColor)',
                                  backgroundColor: 'var(--secondaryBg)',
                                }}
                              >
                                <Link className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-medium">Parameters String</label>
                            <div className="flex">
                              <input
                                type="text"
                                value={paramsString}
                                readOnly
                                className="flex-1 rounded-l-md border px-3 py-2 text-sm"
                                style={{
                                  color: 'var(--primaryColor)',
                                  backgroundColor: 'var(--primaryBg)',
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => copyToClipboard(paramsString)}
                                className="rounded-r-md border border-l-0 px-3 py-2"
                                style={{
                                  color: 'var(--secondaryColor)',
                                  backgroundColor: 'var(--secondaryBg)',
                                }}
                              >
                                <Link className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 text-xs" style={{ color: 'var(--primaryColor)' }}>
                            <p>• URL includes current page, sorting, filters, and search</p>
                            <p>• Parameters string can be used programmatically</p>
                            <p>• Share this URL to restore the exact table state</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              visible: enableExport,
              render: () => (
                <ExportDropdown
                  table={table}
                  data={props.data}
                  filename={exportFilename}
                  onExport={onExport}
                  onExportAll={onExportAll}
                  exportFormats={exportFormats}
                  exportLoading={exportLoading}
                  apiState={apiState}
                />
              ),
            },
            {
              visible: enableColumnVisibility,
              render: () => <ColumnVisibility table={table} onResetColumnSizes={resetColumnSizes} />,
            },
          ]}
        />
      </div>

      <div className="relative max-h-[600px] overflow-auto rounded-md border border-gray-200">
        <table
          className="min-w-full border-collapse divide-y divide-gray-200"
          style={{ width: table.getCenterTotalSize() }}
        >
          <TableHeader loadonAction={loadonAction} headers={table.getHeaderGroups()[0]?.headers || []} />
          <TableBody
            rows={table.getRowModel().rows}
            loading={loading}
            emptyMessage={emptyMessage}
            columnCount={table.getHeaderGroups()[0]?.headers.length || 5}
            isRowDisabled={props.isRowDisabled}
            isActionsDisabled={isActionsDisabled}
          />
        </table>
      </div>

      {enablePagination && !loading && paginationInfo.totalRows > 0 && (
        <TablePagination
          paginationInfo={paginationInfo}
          onPageChange={paginationInfo.onPageChange}
          onPageSizeChange={paginationInfo.onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  )
}
