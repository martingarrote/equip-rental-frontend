import { Component, OnInit } from '@angular/core';
import { ExpandableListComponent, ColumnConfig, PageResponse } from '../expandable-list/expandable-list';
import { ListComponent } from '../list/list';
import { ContractService } from '../../services/contract.service';

interface Rental {
  id: string;
  equipmentName: string;
  startDate: string;
  expectedEndDate: string;
  status: string;
  overdue: boolean;
}

interface Contract {
  id: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: string;
  totalValue: number;

  expanded?: boolean;
  rentalsPage?: PageResponse<Rental> | null;
  loadingRentals?: boolean;
}

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [ExpandableListComponent, ListComponent],
  templateUrl: './contract.html',
  styleUrl: './contract.css'
})
export class ContractsComponent implements OnInit {

  contractColumns: ColumnConfig[] = [
    { field: 'id', header: 'ID' },
    { field: 'customerName', header: 'Cliente' },
    { field: 'startDate', header: 'Data Início', type: 'date' },
    { field: 'endDate', header: 'Data Fim', type: 'date' },
    { field: 'status', header: 'Status' },
    { field: 'totalValue', header: 'Valor Total', type: 'currency' }
  ];

  rentalColumns: ColumnConfig[] = [
    { field: 'id', header: 'ID' },
    { field: 'equipmentName', header: 'Equipamento' },
    { field: 'startDate', header: 'Início', type: 'date' },
    { field: 'expectedEndDate', header: 'Fim Esperado', type: 'date' },
    { field: 'status', header: 'Status' },
    {
      field: 'overdue',
      header: 'Situação',
      format: (v) => v ? 'Vencido' : 'Em dia'
    }
  ];

  contractsPage: PageResponse<Contract> | null = null;
  loadingContracts = false;

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts(0);
  }

  loadContracts(page: number): void {
    this.loadingContracts = true;

    this.contractService.getContracts(page, 10).subscribe({
      next: (response) => {
        this.contractsPage = {
          ...response,
          content: response.content.map(c => ({
            ...c
          }))
        };
      },
      error: (err) => console.error('Erro ao carregar contratos', err),
      complete: () => (this.loadingContracts = false)
    });
  }

  onContractExpand(contract: Contract): void {
    if (contract.rentalsPage) return;

    contract.loadingRentals = true;

    this.contractService.getRentalsByContract(contract.id, 0, 5).subscribe({
      next: (response) => {
        contract.rentalsPage = {
          ...response,
          content: response.content.map(r => ({
            id: r.id,
            equipmentName: r.equipment.name,
            startDate: r.startDate,
            expectedEndDate: r.expectedEndDate,
            status: r.status,
            overdue: r.isOverdue
          }))
        };
      },
      error: (err) => console.error('Erro ao carregar locações', err),
      complete: () => (contract.loadingRentals = false)
    });
  }

  loadRentals(contractId: string, page: number): void {
    const contract = this.contractsPage?.content.find(c => c.id === contractId);
    if (!contract) return;

    contract.loadingRentals = true;

    this.contractService.getRentalsByContract(contractId, page, 5).subscribe({
      next: (response) => {
        if (contract.rentalsPage) {
          contract.rentalsPage = {
            ...response,
            content: response.content.map(r => ({
              id: r.id,
              equipmentName: r.equipment.name,
              startDate: r.startDate,
              expectedEndDate: r.expectedEndDate,
              status: r.status,
              overdue: r.isOverdue
            }))
          };
        }
      },
      error: (err) => console.error('Erro ao paginar locações', err),
      complete: () => (contract.loadingRentals = false)
    });
  }
}
