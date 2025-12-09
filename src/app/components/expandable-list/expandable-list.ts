import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnConfig {
  field: string;
  header: string;
  type?: 'text' | 'date' | 'currency' | 'status' | 'custom';
  format?: (value: any, row: any) => string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ExpandableRow {
  id: number | string;
  expanded?: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-expandable-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expandable-list.html',
  styleUrls: ['./expandable-list.css']
})
export class ExpandableListComponent<T extends ExpandableRow> {
  @Input() columns: ColumnConfig[] = [];
  @Input() pageResponse: PageResponse<T> | null = null;
  @Input() loading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() rowExpand = new EventEmitter<T>();

  @ContentChild('expandedContent') expandedContentTemplate?: TemplateRef<any>;

  private expandedRows = new Set<number | string>();

  get data(): T[] {
    return this.pageResponse?.content || [];
  }

  get currentPage(): number {
    return this.pageResponse?.page || 1;
  }

  get totalPages(): number {
    return this.pageResponse?.totalPages || 0;
  }

  get visiblePages(): number[] {
    const { totalPages: total, currentPage: current } = this;

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const start = current <= 3
      ? 1
      : current >= total - 2
        ? total - 4
        : current - 2;

    return Array.from({ length: 5 }, (_, i) => start + i);
  }

  getCellValue(row: any, column: ColumnConfig): string {
    const value = row?.[column.field];

    if (column.format) {
      return column.format(value, row);
    }

    if (value === null || value === undefined) return '-';

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString('pt-BR');
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      default:
        return value.toString();
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.expandedRows.clear();
      this.pageChange.emit(page - 1);
    }
  }


  toggleRow(row: T): void {
    const rowId = row.id;

    if (this.expandedRows.has(rowId)) {
      this.expandedRows.delete(rowId);
      row.expanded = false;
    } else {
      this.expandedRows.add(rowId);
      row.expanded = true;
      // Emit event to load data for this row
      this.rowExpand.emit(row);
    }
  }

  isRowExpanded(row: T): boolean {
    return this.expandedRows.has(row.id) || row.expanded === true;
  }
}
