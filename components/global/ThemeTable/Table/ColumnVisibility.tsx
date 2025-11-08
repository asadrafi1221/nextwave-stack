/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-lonely-if */
import { Check, Columns, Maximize2, RotateCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import type { ColumnVisibilityProps } from './types';

export function ColumnVisibility<T>({
  table,
  onResetColumnSizes,
}: ColumnVisibilityProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
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

  // Calculate dropdown position to ensure it's always visible
  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const dropdownHeight = 450;
    const dropdownWidth = 256;

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

  const toggleableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        column.getCanHide() &&
        column.id !== 'select' &&
        column.id !== 'actions',
    );

  const resetColumnOrder = () => {
    const allColumns = table.getAllColumns();
    const defaultOrder = allColumns.map((col) => col.id);
    table.setColumnOrder(defaultOrder);
    setIsOpen(false);
  };

  const resetColumnSizes = () => {
    if (onResetColumnSizes) {
      onResetColumnSizes();
    }
    setIsOpen(false);
  };

  if (toggleableColumns.length === 0) {
    return null;
  }

  return (
    <div className="relative text-[var(--primaryColor)] bg-[var(--primaryBg)]">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium md:px-3 md:py-1 md:text-sm lg:px-3 lg:py-1 lg:text-sm"
        aria-label="Toggle column visibility"
      >
        <Columns className="mr-2 h-4 w-4 md:mr-4" />
        Columns
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="flex w-64 flex-col rounded-md border text-[var(--primaryColor)] bg-[var(--primaryBg)] border-gray-200 shadow-lg"
          style={{ ...getDropdownPosition() }}
        >
          <div className="shrink-0 border-b border-gray-100 px-3 py-2 text-xs font-medium uppercase tracking-wider">
            Column Settings
          </div>

          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
            <div className="space-y-2 border-b border-gray-100 px-3 py-2">
              <button
                type="button"
                onClick={resetColumnOrder}
                className="flex w-full items-center text-left text-sm text-[var(--secondaryColor)]  transition-colors"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Column Order
              </button>

              <button
                type="button"
                onClick={resetColumnSizes}
                className="flex w-full text-[var(--secondaryColor)] items-center text-left text-sm transition-colors"
              >
                <Maximize2 className="mr-2 h-4 w-4" />
                Reset Column Sizes
              </button>

              <p className="mt-1 text-xs">
                Drag column headers to reorder • Drag column borders to resize
              </p>
            </div>

            <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium">
              Show/Hide Columns
            </div>

            <div className="px-0">
              {toggleableColumns.map((column) => {
                const isVisible = column.getIsVisible();
                return (
                  <label key={column.id} className="flex cursor-pointer items-center px-3 py-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={column.getToggleVisibilityHandler()}
                        className="h-4 w-4 rounded border-gray-300  text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="ml-2 flex items-center">
                        {isVisible && <Check className="mr-1 h-3 w-3 text-green-600" />}
                        <span className="text-sm">
                          {typeof column.columnDef.header === 'string'
                            ? column.columnDef.header
                            : column.id}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-100 px-3 py-2">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  toggleableColumns.forEach((column) => column.toggleVisibility(true));
                }}
                className="text-xs font-medium text-[var(--secondaryColor)]"
              >
                Show All
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleableColumns.forEach((column) => column.toggleVisibility(false));
                }}
                className="text-xs font-medium text-[var(--secondaryColor)]"
              >
                Hide All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
