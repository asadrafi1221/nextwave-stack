/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import type { Header } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  GripVertical,
  RefreshCw,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { TableHeaderProps } from './types';

export function TableHeader<T>({ headers, loadonAction }: TableHeaderProps<T>) {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const dragCounter = useRef(0);
  const { t } = useTranslation();
  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);

    const dragImage = document.createElement('tablebody.tableheader.div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.padding = '8px 16px';
    dragImage.style.backgroundColor = '#3b82f6';
    dragImage.style.color = 'white';
    dragImage.style.borderRadius = '6px';
    dragImage.style.fontSize = '14px';
    dragImage.style.fontWeight = '500';
    dragImage.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    dragImage.style.border = '1px solid #2563eb';
    dragImage.style.whiteSpace = 'nowrap';
    dragImage.style.zIndex = '9999';

    const header = headers.find((h) => h.id === columnId);
    const headerText = header
      ? typeof header.column.columnDef.header === 'string'
        ? header.column.columnDef.header
        : columnId
      : columnId;

    dragImage.textContent = `${t(
      'tablebody.tableheader.Moving',
    )}: ${headerText}`;

    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current++;
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const sourceColumnId = e.dataTransfer.getData('text/plain');

    if (sourceColumnId && sourceColumnId !== targetColumnId) {
      const table = headers[0]?.getContext().table;
      if (table) {
        const currentOrder = table.getState().columnOrder;
        const sourceIndex = currentOrder.indexOf(sourceColumnId);
        const targetIndex = currentOrder.indexOf(targetColumnId);

        if (sourceIndex !== -1 && targetIndex !== -1) {
          const newOrder = [...currentOrder];
          const [movedColumn] = newOrder.splice(sourceIndex, 1);
          if (movedColumn !== undefined) {
            newOrder.splice(targetIndex, 0, movedColumn);
          }

          table.setColumnOrder(newOrder);
        }
      }
    }

    setDraggedColumn(null);
    setDragOverColumn(null);
    dragCounter.current = 0;
  };

  const handleResizeStart = (
    e: React.MouseEvent | React.TouchEvent,
    header: Header<T, unknown>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setResizingColumn(header.id);

    const resizeHandler = header.getResizeHandler();
    if (resizeHandler) {
      resizeHandler(e);
    }
  };

  const handleResizeEnd = () => {
    setResizingColumn(null);
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (resizingColumn) {
        handleResizeEnd();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [resizingColumn]);

  const canDrag = (columnId: string) => {
    return columnId !== 'select' && columnId !== 'actions';
  };

  const canResize = (columnId: string) => {
    return columnId !== 'select' && columnId !== 'actions';
  };

  return (
    <thead
      className="sticky top-0 border-b text-[var(--primaryColor)] bg-[var(--primaryBg)] shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
      style={{
      
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <tr>
        {headers.map((header) => {
          const isDraggable = canDrag(header.id);
          const isResizable = canResize(header.id);
          const isDragging = draggedColumn === header.id;
          const isDragOver = dragOverColumn === header.id;
          const isResizing =
            resizingColumn === header.id || header.column.getIsResizing();

          return (
            <th
              key={header.id}
              className={`relative text-[var(--primaryColor)] text-center text-xxs font-medium uppercase tracking-wider transition-all duration-200 md:text-xs lg:text-xs ${
                isDragging ? 'scale-95 opacity-50' : ''
              } ${
                isDragOver
                  ? 'border-l-4 border-l-blue-500 bg-blue-100 shadow-lg'
                  : ''
              } ${isResizing ? 'select-none bg-blue-50' : ''} ${
                header.id === 'actions' ? ' sticky right-0 z-20' : ''
              }`}
              style={{
                width: header.getSize(),
                minWidth: header.column.columnDef.minSize || 50,
                maxWidth: header.column.columnDef.maxSize || 800,
              }}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, header.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, header.id)}
            >
              {header.isPlaceholder ? null : (
                <div className="relative flex h-full items-center justify-center">
                  {isDraggable && (
                    <div
                      className="group shrink-0 cursor-move px-2 py-3 opacity-0 transition-opacity duration-200 hover:opacity-100"
                      draggable
                      onDragStart={(e) => handleDragStart(e, header.id)}
                      onDragEnd={handleDragEnd}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="h-4 w-4  group-hover:text-blue-600" />
                    </div>
                  )}

                  <div
                    className={`flex-1 px-4 py-3 ${!isDraggable ? 'px-6' : ''}`}
                  >
                    <div
                      className={`group flex items-center justify-center space-x-2 ${
                        header.column.getCanSort() && !isResizing
                          ? 'cursor-pointer select-none'
                          : ''
                      }`}
                      onClick={
                        !isResizing
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center justify-center gap-2 font-medium">
                        <p className="text-nowrap">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </p>
                        {loadonAction &&
                          header.id === 'actions' &&
                          (loadonAction.isLoading ? (
                            <button
                              title={t('Refreshing data...')}
                              aria-label={t('Refreshing data')}
                              type="button"
                            >
                              <RefreshCw className="h-4 w-4 animate-spin text-gray-900" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={loadonAction.onPress}
                              className="inline-flex text-[var(--primaryColor)] items-center rounded-md transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label={t('Reload')}
                              title={t('Reload')}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          ))}
                      </div>
                      {header.column.getCanSort() && (
                        <span className="shrink-0">
                          {header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="h-4 w-4 " />
                          ) : header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="h-4 w-4 " />
                          ) : (
                            <ChevronsUpDown className="h-4 w-4  opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {isResizable && header.column.getCanResize() && (
                    <div
                      className={`group absolute inset-y-0 right-0 z-10 flex w-1 cursor-col-resize touch-none select-none items-center justify-center${
                        isResizing ? 'bg-blue-200' : 'hover:bg-gray-200'
                      }`}
                      onMouseDown={(e) => handleResizeStart(e, header)}
                      onTouchStart={(e) => handleResizeStart(e, header)}
                      style={{
                        transform: 'translateX(50%)',
                      }}
                    >
                      <div
                        className={`h-6 w-0.5 transition-all duration-200 ${
                          isResizing
                            ? 'bg-blue-600 shadow-lg'
                            : 'bg-gray-400 group-hover:bg-blue-500'
                        }`}
                      />
                      <div
                        className="absolute inset-0 w-3 -translate-x-1/2"
                        style={{ minWidth: '12px' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
