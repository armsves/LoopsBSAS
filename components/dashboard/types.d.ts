import '@tanstack/react-table';
import { ReactNode } from 'react';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    displayName?: string;
    description?: string;
    disabled?: boolean;
    selectAllRows?: boolean;
    headerTooltip?: string | ReactNode;
    icon?: any; // IconConfig from image-with-fallback
  }
}

