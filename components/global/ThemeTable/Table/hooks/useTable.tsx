/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */

import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Check, Copy, Download, Edit, Eye, Loader, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconWrapper } from '@/components/wrappers';

import { EditableCell } from '../EditableCell';
import type { EditableCellRef, EditingState, TableProps } from '../types';
import { useUrlParams } from './useUrlParams';
// Helper function to format column headers
const formatHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};



// Helper function to format cell values

// Helper function to resolve dynamic configuration
const resolveConfig = (config: any, rowData: any) => {
  return {
    editable: typeof config.editable === 'function' ? config.editable(rowData) : config.editable,
    editType: typeof config.editType === 'function' ? config.editType(rowData) : config.editType,
    editOptions: typeof config.editOptions === 'function' ? config.editOptions(rowData) : config.editOptions,
    editValidation: config.editValidation,
    editProps: typeof config.editProps === 'function' ? config.editProps(rowData) : config.editProps,
  };
};

export function useTable<T extends Record<string, any>>(props: TableProps<T>) {
  const {
    data,
    actions,
    columnConfig = {},
    enableSelection = false,
    enablePagination = true,
    enableSorting = true,
    enableInlineEditing = false,
    pageSize: initialPageSize = 10,
    onSelectionChange,
    onRowSave,
    onRowCancel,
    hiddenColumns = [],
    onApiStateChange,
    apiControlled = false,
    urlSync = false,
    urlSyncOptions = {},
  } = props;

  // URL parameter synchronization
  const urlParams = useUrlParams(urlSync ? {
    defaults: {
      page: 1,
      pageSize: initialPageSize,
    },
    updateUrl: true,
    ...urlSyncOptions,
  } : { updateUrl: false });

  // Use URL state if URL sync is enabled, otherwise use internal state
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);
  const [internalSortField, setInternalSortField] = useState<string | undefined>();
  const [internalSortOrder, setInternalSortOrder] = useState<'asc' | 'desc' | undefined>();
  const [internalSearch, setInternalSearch] = useState('');
  const [internalFilters, setInternalFilters] = useState<Record<string, any>>({});
  // Inline editing state
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [editingData, setEditingData] = useState<EditingState>({});
  const [editingErrors, setEditingErrors] = useState<Record<string, Record<string, string>>>({});

  // Refs to access current values from EditableCell components
  const editingRefs = useRef<any>({});

  // Get current state (from URL or internal)
  const currentPage = urlSync ? urlParams.urlState.page : internalPage;
  const currentPageSize = urlSync ? urlParams.urlState.pageSize : internalPageSize;
  const currentSortField = urlSync ? urlParams.urlState.sortField : internalSortField;
  const currentSortOrder = urlSync ? urlParams.urlState.sortOrder : internalSortOrder;
  const currentSearch = urlSync ? urlParams.urlState.search : internalSearch;
  const currentFilters = urlSync ? urlParams.urlState.filters : internalFilters;
  const { t } = useTranslation();

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    // Initialize column visibility based on hiddenColumns prop
    const initialVisibility: VisibilityState = {};
    hiddenColumns.forEach(columnId => {
      initialVisibility[columnId] = false;
    });
    return initialVisibility;
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // Use ref to track previous API state to prevent infinite loops
  const prevApiStateRef = useRef<string>('');
const getRowId = useCallback((originalRow: any) => {
    if (originalRow.rangeId) {
      return originalRow.rangeId;
    }
    return (originalRow as any)?._original?._id;
  }, []);
  // Initialize sorting from URL state
  useEffect(() => {
    if (urlSync && currentSortField) {
      setSorting([{
        id: currentSortField,
        desc: currentSortOrder === 'desc'
      }]);
    }
  }, [urlSync, currentSortField, currentSortOrder]);

  useEffect(() => {
    if (apiControlled && onApiStateChange) {
      const newApiState = {
        page: currentPage,
        pageSize: currentPageSize,
        sortField: currentSortField,
        sortOrder: currentSortOrder,
        search: currentSearch,
        filters: currentFilters,
      };

      // Create a string representation to compare with previous state
      const apiStateString = JSON.stringify(newApiState);

      // Only call onApiStateChange if the state actually changed
      if (apiStateString !== prevApiStateRef.current) {
        prevApiStateRef.current = apiStateString;
        onApiStateChange(newApiState);
      }
    }
  }, [currentPage, currentPageSize, currentSortField, currentSortOrder, currentSearch, currentFilters, apiControlled, onApiStateChange]);

  // Helper function to set ref for a specific cell
  const setCellRef = useCallback((rowId: string, columnId: string, ref: EditableCellRef | null) => {
    if (!editingRefs.current[rowId]) {
      editingRefs.current[rowId] = {};
    }
    if (ref) {
      editingRefs.current[rowId][columnId] = ref;
    } else {
      delete editingRefs.current[rowId][columnId];
    }
  }, []);

  // Clean up refs for a row
  const cleanupRowRefs = useCallback((rowId: string) => {
    if (editingRefs.current[rowId]) {
      delete editingRefs.current[rowId];
    }
  }, []);

  // Stable inline editing functions - memoized with proper dependencies
  const startEditing = useCallback((rowId: string, rowData: T) => {
    setEditingRows(prev => new Set([...prev, rowId]));
    setEditingData(prev => ({
      ...prev,
      [rowId]: { ...rowData }
    }));
    setEditingErrors(prev => ({
      ...prev,
      [rowId]: {}
    }));
  }, []);
const formatCellValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">—</span>;
  }

  // if (typeof value === 'boolean') {
  //   return (
  //     <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  //       }`}>
  //       {value ? 'Yes' : 'No'}
  //     </span>
  //   );
  // }
  if (typeof value === 'boolean') {
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs
        font-semibold`}>
        {value ? t('globaltable.table.Yes') : t('globaltable.table.No')}
      </span>
    );
  }
  if (typeof value === 'number') {

    return <span className="font-medium">{value.toLocaleString()}</span>;
  }

  if (typeof value === 'string') {
    // Check if it's a date
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (dateRegex.test(value)) {
      return <span className='text-[var(--primaryColor)]'>{value}</span>;
    }

    // Check if it's an email
    if (value.includes('@')) {
      return <span className='text-[var(--primaryColor)]'>{value}</span>;
    }

    return <span>{value}</span>;
  }

  return <span>{String(value)}</span>;
};

  const cancelEditing = useCallback((rowId: string, rowData: T) => {
    setEditingRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });
    setEditingData(prev => {
      const newData = { ...prev };
      delete newData[rowId];
      return newData;
    });
    setEditingErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[rowId];
      return newErrors;
    });

    // Clean up refs for this row
    cleanupRowRefs(rowId);

    if (onRowCancel) {
      onRowCancel(rowData);
    }
  }, [onRowCancel, cleanupRowRefs]);

  const saveEditing = useCallback(async (rowId: string, rowData: T) => {
    // Get current values from refs instead of state
    const currentValues: Record<string, any> = {};
    const rowRefs = editingRefs.current[rowId];

    if (!rowRefs) {
      console.warn('No refs found for row', rowId);
      return;
    }

    // Collect current values from all editable cells
    Object.keys(rowRefs).forEach(columnId => {
      const cellRef = rowRefs[columnId];
      if (cellRef) {
        currentValues[columnId] = cellRef.getValue();
      }
    });

    // Calculate changes by comparing with original data
    const changes: Record<string, any> = {};
    Object.keys(currentValues).forEach(columnId => {
      if (currentValues[columnId] !== rowData[columnId]) {
        changes[columnId] = currentValues[columnId];
      }
    });

    // If no changes, just exit editing mode
    if (Object.keys(changes).length === 0) {
      // Use the same cleanup logic as cancelEditing but without calling onRowCancel
      setEditingRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(rowId);
        return newSet;
      });
      setEditingData(prev => {
        const newData = { ...prev };
        delete newData[rowId];
        return newData;
      });
      setEditingErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[rowId];
        return newErrors;
      });
      cleanupRowRefs(rowId);
      return;
    }

    // Validate all changed fields
    const errors: Record<string, string> = {};
    Object.keys(changes).forEach(columnId => {
      const config = columnConfig[columnId];
      if (config?.editValidation) {
        const error = config.editValidation(changes[columnId], rowData); // Pass row data to validation
        if (error) {
          errors[columnId] = error;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setEditingErrors(prev => ({
        ...prev,
        [rowId]: errors
      }));
      return;
    }

    // Call save handler
    if (onRowSave) {
      try {
        const success = await onRowSave(rowData, changes);
        if (success) {
          // Clear editing state
          setEditingRows(prev => {
            const newSet = new Set(prev);
            newSet.delete(rowId);
            return newSet;
          });
          setEditingData(prev => {
            const newData = { ...prev };
            delete newData[rowId];
            return newData;
          });
          setEditingErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[rowId];
            return newErrors;
          });

          // Clean up refs for this row
          cleanupRowRefs(rowId);
        }
      } catch (error) {
        console.error('Save failed:', error);
      }
    }
  }, [columnConfig, onRowSave, cleanupRowRefs]);

  // Handle sorting changes
  const handleSortingChange = useCallback((updaterOrValue: any) => {
    let newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

    // Changed by me: Prevent clearing sort, toggle between asc/desc instead
    if (apiControlled && newSorting.length === 0 && sorting.length > 0) {
      // If trying to clear sort but we have current sorting, toggle the direction instead
      const currentSort = sorting[0];
      newSorting = [{
        id: currentSort?.id,
        desc: !currentSort?.desc
      }];
    }

    setSorting(newSorting);

    if (apiControlled) {
      // For API-controlled tables, update state and notify parent
      if (newSorting.length > 0) {
        const sortInfo = newSorting[0];
        const newSortField = sortInfo.id;
        const newSortOrder = sortInfo.desc ? 'desc' : 'asc';

        if (urlSync) {
          urlParams.setSorting(newSortField, newSortOrder);
          urlParams.setPage(1); // Reset to first page when sorting changes
        } else {
          setInternalSortField(newSortField);
          setInternalSortOrder(newSortOrder);
          setInternalPage(1);
        }
      } else if (urlSync) {
        urlParams.setSorting(undefined, undefined);
      } else {
        setInternalSortField(undefined);
        setInternalSortOrder(undefined);
      }
    }
  }, [sorting, apiControlled, urlSync, urlParams]);

  // Handle pagination changes
  const handlePageChange = useCallback((pageIndex: number) => {
    const newPage = pageIndex + 1; // Convert from 0-based to 1-based

    if (apiControlled) {
      if (urlSync) {
        urlParams.setPage(newPage);
      } else {
        setInternalPage(newPage);
      }
    } else {
      setPagination(prev => ({ ...prev, pageIndex }));
    }
  }, [apiControlled, urlSync, urlParams]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (apiControlled) {
      if (urlSync) {
        urlParams.setPageSize(newPageSize);
      } else {
        setInternalPageSize(newPageSize);
        setInternalPage(1); // Reset to first page when changing page size
      }
    } else {
      setPagination(prev => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
    }
  }, [apiControlled, urlSync, urlParams]);

  // Handle search changes
  const handleSearchChange = useCallback((search: string) => {
    if (urlSync) {
      urlParams.setSearch(search);
    } else {
      setInternalSearch(search);
      setInternalPage(1);
    }
  }, [urlSync, urlParams]);

  // Handle filter changes
  const handleFiltersChange = useCallback((filters: Record<string, any>) => {
    if (urlSync) {
      urlParams.setFilters(filters);
    } else {
      setInternalFilters(filters);
      setInternalPage(1);
    }
  }, [urlSync, urlParams]);

  const handleRowSelectionChange = useCallback((updaterOrValue: any) => {
  setRowSelection(prev => {
    const newSelection = typeof updaterOrValue === 'function'
      ? updaterOrValue(prev)
      : updaterOrValue;
    
    // Convert to array of selected IDs
    const selectedIds = Object.keys(newSelection).filter(id => newSelection[id]);
    
    // Notify parent if callback exists
    if (onSelectionChange) {
      onSelectionChange(selectedIds);
    }
    
    return newSelection;
  });
}, [onSelectionChange]);

  // Auto-generate columns from data
  const tableColumns = useMemo(() => {
    const cols: any[] = [];

    // Add selection column if enabled
    if (enableSelection) {
      cols.push({
        id: 'select',
        header: ({ table }: any) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[var(--secondaryColor)]"
            
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[var(--secondaryColor)]"
            
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            aria-label={`Select row ${row.id}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
      });
    }




    // Auto-generate columns from first data item
    if (data.length > 0) {
      const firstItem = data[0];

      Object.keys(firstItem).forEach((key) => {
        if (key === '_original') return;
        const config = columnConfig[key] || {};

        cols.push({
          id: key,
          header: config.label || formatHeader(key),
          accessorKey: key,
          cell: ({ getValue, row }: any) => {
            const value = getValue();
            const rowData = row.original;
            const rowId = row.id;

            // Resolve dynamic configuration based on row data
            const resolvedConfig = resolveConfig(config, rowData);

            // Check if this column is editable and we're in editing mode
            if (enableInlineEditing && resolvedConfig.editable && editingRows.has(rowId)) {
              const editValue = editingData[rowId]?.[key] ?? value;
              const error = editingErrors[rowId]?.[key];

              return (
                <EditableCell
                  ref={(ref) => setCellRef(rowId, key, ref)}
                  value={value}
                  rowId={rowId}
                  columnId={key}
                  rowData={rowData}
                  config={resolvedConfig}
                  editValue={editValue}
                  error={error}
                  onUpdate={() => { }} // No-op since we use refs
                />
              );
            }

            // Use custom formatter if provided
            if (config.formatter) {
              return config.formatter(value, rowData);
            }

            // Default formatting
            return formatCellValue(value);
          },
          enableSorting: config.sortable ?? enableSorting,
          enableResizing: true,
          enableHiding: true,
          minSize: 80,
          maxSize: 800,
          size: 150,
        });
      });
    }

    // Add actions column if any actions are enabled or inline editing is enabled
    const enabledActions = actions ? Object.entries(actions).filter(([_, config]) => config?.enabled) : [];
    const hasInlineEdit = enableInlineEditing && Object.values(columnConfig).some((config: any) => {
      // Check if any column is editable (considering dynamic editable functions)
      return typeof config.editable === 'function' || config.editable === true;
    });

    if (enabledActions.length > 0 || hasInlineEdit) {
      const baseWidth = hasInlineEdit ? 120 : 0;
      const actionsWidth = Math.max(120, enabledActions.length * 40 + baseWidth);

      cols.push({
        id: 'actions',
        header: t("globaltable.table.actions"),
        cell: ({ row, actionsDisabled }: any) => {
          const rowId = row.id;
          const rowData = row.original;
          const isEditing = editingRows.has(rowId);
          const isDisabled = actionsDisabled ;
          // Check if this row can be edited (considering dynamic editable functions)
          const canEdit = hasInlineEdit && Object.values(columnConfig).some(config => {
            const resolvedConfig = resolveConfig(config, rowData);
            return resolvedConfig.editable;
          });

          return (
            <div className="flex items-center justify-center space-x-0.5 text-center md:space-x-1 lg:space-x-1 text-[var(--primaryColor)] bg-[var(--primaryBg)]" >
              {/* Inline editing controls */}
              {canEdit && (
                <>
                  {!isEditing ? (
                    <button type='button'
                      onClick={() => startEditing(rowId, row.original)}
                      className="inline-flex items-center rounded-md p-1 transition-colors hover:text-blue-600  md:p-1.5  lg:p-1.5"
                      aria-label="Edit row"
                      title="Edit"
                      disabled={isDisabled}
                    >

                      <IconWrapper>
                        <Edit className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                      </IconWrapper>
                    </button>
                  ) : (
                    <>
                      {actions?.edit?.onLoad ? <Loader/>
                        :
                        <button type='button'
                          onClick={() => saveEditing(rowId, row.original)}
                          className="inline-flex items-center rounded-md p-1 text-gray-600 transition-colors hover:cursor-pointer hover:bg-green-50 hover:text-green-600 md:p-1.5 lg:p-1.5"
                          aria-label="Save changes"
                          title="Save"
                        >
                          <IconWrapper>
                            <Check className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                          </IconWrapper>
                        </button>}
                      <button type='button'
                        onClick={() => cancelEditing(rowId, row.original)}
                        className="inline-flex items-center rounded-md p-1 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 md:p-1.5 lg:p-1.5"
                        aria-label="Cancel editing"
                        title="Cancel"
                      >
                        <X className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                      </button>
                    </>
                  )}
                </>
              )}

              {/* Regular action buttons (only show when not editing) */}
              {!isEditing && (
                <>
                  {actions?.view?.enabled && (
                    <button type='button'
                      onClick={() => actions.view?.onPress?.(row.original)}
                      disabled={actions.view?.isDisabled?.(row.original)}
                      className="inline-flex cursor-pointer items-center rounded-md p-1 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 md:p-1.5 lg:p-1.5"
                      aria-label="Edit"
                      title={t("globaltable.table.Edit")}
                    >

                      <IconWrapper>
                        <Eye className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                      </IconWrapper>
                    </button>
                  )}

                  {actions?.edit?.enabled && !hasInlineEdit && (
                    <button
                      type='button'
                      onClick={() => actions.edit?.onPress?.(row.original)}
                      disabled={actions.edit?.isDisabled?.(row.original)}
                      className="inline-flex items-center rounded-md p-1.5 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Edit"
                      title={t("globaltable.table.Edit")}
                    >
                      <IconWrapper>
                        <Edit className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                      </IconWrapper>
                    </button>
                  )}
                  {actions?.duplicate?.enabled && (
                    <button type='button'
                      onClick={() => actions.duplicate?.onPress?.(row.original)}
                      disabled={actions.duplicate?.isDisabled?.(row.original) || isDisabled}
                      className="inline-flex items-center rounded-md p-1 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50 md:p-1.5 lg:p-1.5"
                      aria-label="Duplicate"
                      title={t("globaltable.table.Duplicate")}
                    >
                      <IconWrapper>
                        <Copy className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                      </IconWrapper>
                    </button>
                  )}

                  {actions?.download?.enabled && (
                    <button type='button'
                      onClick={() => actions.download?.onPress?.(row.original)}
                      disabled={actions.download?.isDisabled?.(row.original)}
                      className="inline-flex items-center rounded-md p-1 text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-50 md:p-1.5 lg:p-1.5"
                      aria-label="Download"
                      title={t("globaltable.table.Download")}
                    >
                      <Download className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                    </button>
                  )}

                  {actions?.delete?.enabled && (
                    <button type='button'
                      onClick={() => actions.delete?.onPress?.(row.original)}
                      disabled={actions.delete?.isDisabled?.(row.original)}
                      className="inline-flex items-center rounded-md p-1 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 md:p-1.5 lg:p-1.5"
                      aria-label="Delete"
                      title={t("globaltable.table.Delete")}
                    >
                      <Trash2 className="h-3 w-3 hover:cursor-pointer md:h-4 md:w-4 lg:h-4 lg:w-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: actionsWidth,
        minSize: actionsWidth,
        maxSize: actionsWidth,
      });
    }

    return cols;
  }, [
    data,
    actions,
    columnConfig,
    enableSelection,
    enableSorting,
    enableInlineEditing,
    editingRows,
    editingData,
    editingErrors,
    startEditing,
    saveEditing,
    cancelEditing,
    setCellRef
  ]);

  // Initialize column order when columns change
  useEffect(() => {
    if (tableColumns.length > 0) {
      const newOrder = tableColumns.map(col => col.id);
      setColumnOrder(prevOrder => {
        // Only update if we don't have an order yet or if the columns have changed
        if (prevOrder.length === 0 || prevOrder.length !== newOrder.length) {
          return newOrder;
        }
        return prevOrder;
      });
    }
  }, [tableColumns]);

  // Create table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    // getRowId: (originalRow) => {
    //   return (originalRow as any)?._original?._id;
    // },
    getRowId: (originalRow) => getRowId(originalRow),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: apiControlled ? { pageIndex: currentPage - 1, pageSize: currentPageSize } : pagination,
      columnOrder,
      columnSizing,
    },
    enableRowSelection: enableSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: apiControlled ? undefined : setPagination,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination && !apiControlled ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting && !apiControlled ? getSortedRowModel() : undefined,
    manualPagination: apiControlled,
    manualSorting: apiControlled,
    pageCount: apiControlled ? (props.totalPages ?? -1) : -1,
    debugTable: false,
  });

  // Handle selection changes
  const selectedRows = useMemo(() => {
  if (!enableSelection) return [];
  return Object.keys(rowSelection).filter(id => rowSelection[id]);
}, [rowSelection, enableSelection]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange && enableSelection) {
      onSelectionChange(selectedRows);
    }
  }, [selectedRows, onSelectionChange, enableSelection]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  // Reset column sizes
  const resetColumnSizes = useCallback(() => {
    setColumnSizing({});
  }, []);

  // Get current API state for export
  const apiState = useMemo(() => ({
    sortField: currentSortField,
    sortOrder: currentSortOrder,
    search: currentSearch,
    filters: currentFilters,
  }), [currentSortField, currentSortOrder, currentSearch, currentFilters]);

  // Get pagination info
  const paginationInfo = useMemo(() => {
    if (apiControlled) {
      return {
        pageIndex: currentPage - 1,
        pageSize: currentPageSize,
        pageCount: props.totalPages ?? 0,
        canPreviousPage: currentPage > 1,
        canNextPage: currentPage < (props.totalPages ?? 0),
        totalRows: props.totalRows ?? 0,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      };
    }

    return {
      pageIndex: table.getState().pagination.pageIndex,
      pageSize: table.getState().pagination.pageSize,
      pageCount: table.getPageCount(),
      canPreviousPage: table.getCanPreviousPage(),
      canNextPage: table.getCanNextPage(),
      totalRows: table.getFilteredRowModel().rows.length,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    };
  }, [table, apiControlled, currentPage, currentPageSize, props.totalPages, props.totalRows, handlePageChange, handlePageSizeChange]);

  return {
    table,
    selectedRows,
    clearSelection,
    resetColumnSizes,
    paginationInfo,
    apiState,

    // Inline editing state
    editingRows,
    editingData,
    startEditing,
    cancelEditing,
    saveEditing,

    // URL sync utilities
    urlParams: urlSync ? urlParams : null,
    currentSearch,
    currentFilters,
    handleSearchChange,
    handleFiltersChange,
  };
}