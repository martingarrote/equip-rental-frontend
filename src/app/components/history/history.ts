import { Component, OnInit } from '@angular/core';
import { ListComponent, ColumnConfig, PageResponse } from '../list/list';
import { HistoryService, HistoryRecord } from '../../services/history.service'

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {

  columns: ColumnConfig[] = [
    { field: 'equipmentName', header: 'Equipamento' },
    { field: 'userName', header: 'Usuário' },
    { field: 'action', header: 'Ação' },
    {
      field: 'timestamp',
      header: 'Data',
      type: 'date'
    },
    { field: 'description', header: 'Descrição' }
  ];

  pageResponse: PageResponse<HistoryRecord> | null = null;
  loading: boolean = false;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading = true;

    this.historyService.getHistory(page, 10).subscribe({
      next: (response) => {
        this.pageResponse = {
          content: response.content,
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last,
          empty: response.empty,
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico:', err);
        this.loading = false;
      }
    });
  }
}
