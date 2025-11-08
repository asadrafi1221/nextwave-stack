/* eslint-disable unused-imports/no-unused-vars */
import type { Header, Row, RowData, Table } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export interface ColumnConfig {
  [key: string]: {
    label?: string;
    hidden?: boolean;
    sortable?: boolean;
    formatter?: (value: any, row: any) => React.ReactNode;

    // Inline editing
    editable?: boolean | ((row: any) => boolean); // Can be dynamic based on row
    editType?:
      | 'text'
      | 'email'
      | 'number'
      | 'select'
      | 'textarea'
      | ((row: any) => 'text' | 'email' | 'number' | 'select' | 'textarea'); // Can be dynamic

    editOptions?:
      | Array<{ label: string; value: any }>
      | ((row: any) => Array<{ label: string; value: any }>); // Can be dynamic

    editValidation?: (value: any, row?: any) => string | null; // Receives row data

    editProps?: Record<string, any> | ((row: any) => Record<string, any>); // Can be dynamic

    /** ✅ NEW: Live onChange handler */
    onChange?: (value: any, row?: any) => void;
  };
}

export interface TableActions<T = any> {
  view?: {
    enabled?: boolean;
    onPress?: (row: T) => void;
    isDisabled?: (row: T) => boolean;
  };
  edit?: {
    enabled?: boolean;
    onPress?: (row: T) => void;
    onEditDone?: any;
    isDisabled?: (row: T) => boolean;
    onLoad?: boolean;
  };
  add?: {
    enabled?: boolean;
    onPress?: (row: T) => void;
    onEditDone?: any;
    isDisabled?: (row: T) => boolean;
    onLoad?: boolean;
  };
  delete?: {
    enabled?: boolean;
    onPress?: (row: T) => void;
    isDisabled?: (row: T) => boolean;
  };
  duplicate?: {
    enabled?: boolean;
    onPress?: (row: T) => void;
    isDisabled?: (row: T) => boolean;
  };
  download?: {
    enabled?: boolean;
    onPress?: (row: T) => void;
    isDisabled?: (row: T) => boolean;
  };
  popup?: {
    enabled?: boolean;
    onPress?: (row: T) => void;
    isDisabled?: (row: T) => boolean;
  };
}

export interface ApiState {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface ExportParams {
  format: 'csv' | 'json' | 'txt' | 'xlsx' | 'pdf';
  filters?: Record<string, any>;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  columns?: string[];
  [key: string]: any; // Allow additional custom parameters
}

export interface ExportResponse {
  success: boolean;
  data?: Blob | string | ArrayBuffer;
  filename?: string;
  url?: string; // For cases where API returns a download URL
  message?: string;
  error?: string;
}

export interface EditingState {
  [rowId: string]: {
    [columnId: string]: any;
  };
}

export interface ButtonConfig {
  buttonText: string;
  onPress: () => void;
  isDisabled?: () => boolean;
  isLoading?: any;
  isHidden?: boolean | (() => boolean);
  outline?: boolean;
  startIcon?: React.ReactNode;
}

export interface TableProps<T = any> {
  data: any;
  enableInlineEditing?: boolean;
  actions?: TableActions<T>;
  columnConfig?: any;
  getRowId?: (originalRow: T) => string;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  isRowDisabled?: (row: any) => boolean;
  isActionsDisabled?: (row: any) => boolean;

  onRowSave?: any;
  onRowCancel?: any;
  loadonAction?: {
    onPress: () => void;
    isLoading?: boolean;
  };
  pageSize?: number;
  pageSizeOptions?: number[];
  onSelectionChange?: (selectedRows: any) => void;
  onDataChange?: (data: T[]) => void;
  onExport?: (data: T[], format: 'csv' | 'json' | 'txt') => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  hiddenColumns?: string[];
  exportFilename?: string;
  booleanType?: string;

  apiControlled?: boolean;
  totalPages?: number;
  totalRows?: number;
  onApiStateChange?: (state: ApiState) => void;

  onExportAll?: (params: ExportParams) => Promise<ExportResponse>;
  exportFormats?: Array<'csv' | 'json' | 'txt' | 'xlsx' | 'pdf'>;
  exportLoading?: boolean;

  urlSync?: boolean;
  urlSyncOptions?: UseUrlParamsOptions;
}

export interface PaginationInfo {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  totalRows: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
export interface ColumnVisibilityProps<T> {
  table: Table<T>;
  onResetColumnSizes?: () => void;
}
export interface EditableCellProps {
  value: any;
  rowId: string;
  columnId: string;
  rowData: any;
  config: {
    editType?:
      | 'text'
      | 'email'
      | 'number'
      | 'select'
      | 'textarea'
      | 'date'
      | ((
          row: any,
        ) => 'text' | 'email' | 'date' | 'number' | 'select' | 'textarea');
    editOptions?:
      | Array<{ label: string; value: any }>
      | ((row: any) => Array<{ label: string; value: any }>);
    editProps?: Record<string, any> | ((row: any) => Record<string, any>);
  };
  editValue: any;
  error?: string;
  onUpdate: any;
}

export interface EditableCellRef {
  getValue: () => any;
  focus: () => void;
}

export interface ExportDropdownProps {
  table: any;
  data: any;
  filename?: string;
  onExport?: any;
  onExportAll?: (params: ExportParams) => Promise<ExportResponse>;
  exportFormats?: Array<'csv' | 'json' | 'txt' | 'xlsx' | 'pdf'>;
  exportLoading?: boolean;
  apiState?: {
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
  };
}
export interface TableBodyProps<T> {
  rows: Row<T>[];
  loading?: boolean;
  emptyMessage?: string;
  columnCount: number;
  isRowDisabled?: (row: Row<T>) => boolean;
  isActionsDisabled?: (row: T) => boolean;
}

export interface TableHeaderProps<T> {
  headers: Header<T, unknown>[];
  loadonAction?: any;
}
export interface TablePaginationProps {
  paginationInfo: PaginationInfo;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface UrlParamsConfig {
  page?: string;
  pageSize?: string;
  sortField?: string;
  sortOrder?: string;
  search?: string;
  filters?: string;
  [key: string]: string | undefined;
}

export interface UseUrlParamsOptions {
  // Custom parameter names for different frameworks
  paramNames?: {
    page?: string;
    pageSize?: string;
    sortField?: string;
    sortOrder?: string;
    search?: string;
    filters?: string;
    [key: string]: string | undefined;
  };
  // Default values
  defaults?: {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
    [key: string]: any;
  };
  // Whether to update URL automatically
  updateUrl?: boolean;
  // Custom URL update function (for Next.js router, etc.)
  onUrlUpdate?: (params: URLSearchParams) => void;
}
