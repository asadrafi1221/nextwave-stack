/* eslint-disable react/no-unused-prop-types */
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import type { EditableCellProps, EditableCellRef } from './types';

export const EditableCell = memo(
  forwardRef<EditableCellRef, EditableCellProps>(function EditableCell(
    { rowData, config, editValue, error, onUpdate },
    ref,
  ) {
    const inputRef = useRef<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(null);
    const [localValue, setLocalValue] = useState(editValue ?? '');

    // Resolve dynamic configuration based on row data
    const resolvedEditType =
      typeof config.editType === 'function'
        ? config.editType(rowData)
        : config.editType || 'text';

    const resolvedEditOptions =
      typeof config.editOptions === 'function'
        ? config.editOptions(rowData)
        : config.editOptions || [];

    const resolvedEditProps =
      typeof config.editProps === 'function'
        ? config.editProps(rowData)
        : config.editProps || {};

    // Update local value when editValue changes from outside (initial load only)
    useEffect(() => {
      if (config.editType === 'date' && editValue) {
        const date = new Date(editValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setLocalValue(formattedDate);
      } else {
        setLocalValue(editValue ?? '');
      }
    }, [editValue, config.editType]);

    // Expose methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        getValue: () => localValue,
        focus: () => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        },
      }),
      [localValue],
    );

    // Handle input changes - ONLY update local state
    const handleChange = useCallback(
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        // For select inputs, we can update immediately since they don't have typing
        if (resolvedEditType === 'select') {
          onUpdate(newValue);
        }
        // For all other inputs, we only update local state
      },
      [resolvedEditType, onUpdate],
    );

    // Handle blur - update external state when losing focus (for non-select inputs)
    const handleBlur = useCallback(() => {
      // Only update external state on blur for non-select inputs
      if (resolvedEditType !== 'select') {
        onUpdate(localValue);
      }
    }, [localValue, onUpdate, resolvedEditType]);

    // Handle Enter key for text inputs
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && resolvedEditType !== 'textarea') {
          e.preventDefault();
          // Trigger blur to save the value
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }
      },
      [resolvedEditType],
    );

    // Auto-focus when component mounts
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();

        // For text inputs, select all text for better UX
        if (
          resolvedEditType !== 'select' &&
          inputRef.current instanceof HTMLInputElement
        ) {
          inputRef.current.select();
        }
      }
    }, [resolvedEditType]);

    const commonProps = {
      ref: inputRef,
      value: localValue,
      onChange: handleChange,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: `w-full px-2 py-1 border rounded text-sm bg-transparent ${
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      } focus:outline-none focus:ring-1`,
      ...resolvedEditProps,
    };

    let input;

    switch (resolvedEditType) {
      case 'select':
        input = (
          <select {...commonProps}>
            {resolvedEditOptions.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      case 'textarea':
        input = <textarea {...commonProps} rows={2} />;
        break;
      case 'number':
        input = <input {...commonProps} type="number" />;
        break;
      case 'date':
        input = <input {...commonProps} type="date" />;
        break;
      case 'email':
        input = <input {...commonProps} type="email" />;
        break;
      default:
        input = <input {...commonProps} type="text" />;
    }

    return (
      <div>
        {input}
        {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      </div>
    );
  }),
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.value === nextProps.value &&
      prevProps.editValue === nextProps.editValue &&
      prevProps.error === nextProps.error &&
      prevProps.rowId === nextProps.rowId &&
      prevProps.columnId === nextProps.columnId &&
      JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config) &&
      JSON.stringify(prevProps.rowData) === JSON.stringify(nextProps.rowData)
    );
  },
);
