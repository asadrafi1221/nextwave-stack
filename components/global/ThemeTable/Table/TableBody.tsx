/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { flexRender } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import type { TableBodyProps } from './types';

export function TableBody<T>({
  rows,
  loading,
  emptyMessage,
  columnCount,
  isRowDisabled,
  isActionsDisabled,
}: TableBodyProps<T>) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <tbody
        className="divide-y divide-gray-200 bg-[var(--primaryBg)]"
      
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="animate-pulse">
            {Array.from({ length: columnCount }).map((_, cellIndex) => (
              <td key={cellIndex} className="px-6 py-4 text-center">
                <div className="mx-auto h-4 w-full rounded bg-gray-200" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={columnCount}
            className="px-6 py-12 text-center text-gray-500"
          >
            {emptyMessage || t('globaltable.tablebody.No data available')}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200 ">
      {rows.map((row) => {
        const disabled = isRowDisabled ? isRowDisabled(row) : false;
        const actionsDisabled = isActionsDisabled
          ? isActionsDisabled(row.original)
          : false;
        return (
          <tr
            key={row.id}
            className={`transition-colors ${
              row.getIsSelected() ? 'bg-none' : ''
            } ${disabled ? 'opacity-40' : ''}`}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={`bg-[var(--primaryBg)] whitespace-nowrap text-center text-xxs md:text-xs lg:text-xs ${
                  cell.column.id === 'actions'
                    ? 'sticky right-0 z-10 px-0'
                    : 'px-3 py-1.5 md:px-6 md:py-3 lg:px-6 lg:py-3'
                }`}
              >
                {flexRender(cell.column.columnDef.cell, {
                  ...cell.getContext(),
                  actionsDisabled: actionsDisabled || disabled,
                })}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}
