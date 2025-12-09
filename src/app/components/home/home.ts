import { Component, OnInit } from '@angular/core';
import { ListComponent, ColumnConfig, PageResponse } from '../list/list';
import { ContractService } from '../../services/contract.service';

interface CustomerContract {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalValue: number;
}

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  contractColumns: ColumnConfig[] = [
    {field: 'id', header: 'ID'},
    {field: 'startDate', header: 'Início', type: 'date'},
    {field: 'endDate', header: 'Fim', type: 'date'},
    {field: 'status', header: 'Status'},
    {field: 'totalValue', header: 'Valor Total', type: 'currency'}
  ];

  contractsPage: PageResponse<CustomerContract> | null = null;
  loadingContracts = false;

  constructor(private contractService: ContractService) {
  }

  ngOnInit(): void {
    this.loadContracts(0);
  }

  loadContracts(page: number): void {
    this.loadingContracts = true;

    this.contractService.getMyContracts(page, 10).subscribe({
      next: (response) => {
        this.contractsPage = {
          ...response,
          content: response.content.map(c => ({
            id: c.id,
            startDate: c.startDate,
            endDate: c.endDate,
            status: c.status,
            totalValue: c.totalValue
          }))
        };
      },
      error: (err) => console.error('Erro ao carregar contratos do cliente', err),
      complete: () => (this.loadingContracts = false)
    });
  }

  requestContract() {
    console.log('Request Contract');
  }
}
