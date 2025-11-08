/* eslint-disable consistent-return */
import { useCallback, useEffect, useState } from 'react';

import type { UseUrlParamsOptions } from '../types';

// Default parameter names - can be overridden
const DEFAULT_PARAM_NAMES = {
  page: 'page',
  pageSize: 'pageSize',
  sortField: 'sortField',
  sortOrder: 'sortOrder',
  search: 'search',
  filters: 'filters',
};

export function useUrlParams(options: UseUrlParamsOptions = {}) {
  const {
    paramNames = DEFAULT_PARAM_NAMES, // Use defaults if not provided
    defaults = {
      page: 1,
      pageSize: 10,
    },
    updateUrl = true,
    onUrlUpdate,
  } = options;

  // Merge provided paramNames with defaults to ensure all keys exist
  const finalParamNames = { ...DEFAULT_PARAM_NAMES, ...paramNames };

  // Get current URL parameters
  const getUrlParams = useCallback((): URLSearchParams => {
    if (typeof window === 'undefined') {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  }, []);

  // Parse URL parameters into state
  const parseUrlParams = useCallback(() => {
    const urlParams = getUrlParams();

    const page = urlParams.get(finalParamNames.page!)
      ? parseInt(urlParams.get(finalParamNames.page!)!, 10)
      : defaults.page || 1;

    const pageSize = urlParams.get(finalParamNames.pageSize!)
      ? parseInt(urlParams.get(finalParamNames.pageSize!)!, 10)
      : defaults.pageSize || 10;

    const sortField =
      urlParams.get(finalParamNames.sortField!) || defaults.sortField;

    const sortOrder =
      (urlParams.get(finalParamNames.sortOrder!) as 'asc' | 'desc') ||
      defaults.sortOrder;

    const search =
      urlParams.get(finalParamNames.search!) || defaults.search || '';

    let filters = defaults.filters || {};
    const filtersParam = urlParams.get(finalParamNames.filters!);
    if (filtersParam) {
      try {
        filters = JSON.parse(decodeURIComponent(filtersParam));
      } catch (error) {
        console.warn('Failed to parse filters from URL:', error);
        filters = defaults.filters || {};
      }
    }

    return {
      page,
      pageSize,
      sortField,
      sortOrder,
      search,
      filters,
    };
  }, [finalParamNames, defaults, getUrlParams]);

  // Initialize state from URL
  const [urlState, setUrlState] = useState(() => parseUrlParams());

  // Update URL when state changes
  const updateUrlParams = useCallback(
    (newState: Partial<typeof urlState>) => {
      if (!updateUrl || typeof window === 'undefined') {
        return;
      }

      const urlParams = getUrlParams();

      // Update parameters
      Object.entries(newState).forEach(([key, value]) => {
        const paramName = finalParamNames[key as keyof typeof finalParamNames];
        if (!paramName) return;

        if (value === undefined || value === null || value === '') {
          urlParams.delete(paramName);
        } else if (key === 'filters') {
          // Serialize filters as JSON
          if (typeof value === 'object' && Object.keys(value).length > 0) {
            urlParams.set(paramName, encodeURIComponent(JSON.stringify(value)));
          } else {
            urlParams.delete(paramName);
          }
        } else {
          urlParams.set(paramName, String(value));
        }
      });

      // Remove default values to keep URL clean
      if (urlParams.get(finalParamNames.page!) === String(defaults.page)) {
        urlParams.delete(finalParamNames.page!);
      }
      if (
        urlParams.get(finalParamNames.pageSize!) === String(defaults.pageSize)
      ) {
        urlParams.delete(finalParamNames.pageSize!);
      }

      const newUrl = `${window.location.pathname}${
        urlParams.toString() ? `?${urlParams.toString()}` : ''
      }`;

      if (onUrlUpdate) {
        // Custom URL update function (for Next.js router, etc.)
        onUrlUpdate(urlParams);
      } else {
        // Default browser history update
        window.history.replaceState({}, '', newUrl);
      }
    },
    [updateUrl, finalParamNames, defaults, getUrlParams, onUrlUpdate],
  );

  // Set state and update URL
  const setUrlStateAndUpdate = useCallback(
    (newState: Partial<typeof urlState>) => {
      setUrlState((prev) => {
        const updated = { ...prev, ...newState };
        updateUrlParams(newState);
        return updated;
      });
    },
    [updateUrlParams],
  );

  // Listen for browser back/forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      setUrlState(parseUrlParams());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseUrlParams]);

  // Generate shareable URL
  const getShareableUrl = useCallback(
    (customState?: Partial<typeof urlState>) => {
      if (typeof window === 'undefined') return '';

      const stateToUse = customState
        ? { ...urlState, ...customState }
        : urlState;
      const urlParams = new URLSearchParams();

      Object.entries(stateToUse).forEach(([key, value]) => {
        const paramName = finalParamNames[key as keyof typeof finalParamNames];
        if (!paramName || value === undefined || value === null || value === '')
          return;

        if (key === 'filters') {
          if (typeof value === 'object' && Object.keys(value).length > 0) {
            urlParams.set(paramName, encodeURIComponent(JSON.stringify(value)));
          }
        } else if (value !== defaults[key as keyof typeof defaults]) {
          urlParams.set(paramName, String(value));
        }
      });

      return `${window.location.origin}${window.location.pathname}${
        urlParams.toString() ? `?${urlParams.toString()}` : ''
      }`;
    },
    [urlState, finalParamNames, defaults],
  );

  // Get current parameters as string
  const getParamsString = useCallback(
    (customState?: Partial<typeof urlState>) => {
      const stateToUse = customState
        ? { ...urlState, ...customState }
        : urlState;
      const urlParams = new URLSearchParams();

      Object.entries(stateToUse).forEach(([key, value]) => {
        const paramName = finalParamNames[key as keyof typeof finalParamNames];
        if (!paramName || value === undefined || value === null || value === '')
          return;

        if (key === 'filters') {
          if (typeof value === 'object' && Object.keys(value).length > 0) {
            urlParams.set(paramName, encodeURIComponent(JSON.stringify(value)));
          }
        } else if (value !== defaults[key as keyof typeof defaults]) {
          urlParams.set(paramName, String(value));
        }
      });

      return urlParams.toString();
    },
    [urlState, finalParamNames, defaults],
  );

  return {
    // Current state
    urlState,

    // State setters
    setUrlState: setUrlStateAndUpdate,
    setPage: (page: number) => setUrlStateAndUpdate({ page }),
    setPageSize: (pageSize: number) =>
      setUrlStateAndUpdate({ pageSize, page: 1 }),
    setSorting: (sortField?: string, sortOrder?: 'asc' | 'desc') =>
      setUrlStateAndUpdate({ sortField, sortOrder }),
    setSearch: (search: string) => setUrlStateAndUpdate({ search, page: 1 }),
    setFilters: (filters: Record<string, any>) =>
      setUrlStateAndUpdate({ filters, page: 1 }),

    // Utilities
    getShareableUrl,
    getParamsString,
    parseUrlParams,

    // Configuration info
    paramNames: finalParamNames,

    // Reset to defaults
    resetToDefaults: () => setUrlStateAndUpdate(defaults),
  };
}
