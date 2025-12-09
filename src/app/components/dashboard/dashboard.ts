import { Component, OnInit } from '@angular/core';
import { ListComponent, ColumnConfig, PageResponse } from '../list/list';
import { EquipmentService, Equipment } from '../../services/equipment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalEquipment = 0;
  availableEquipment = 0;
  reservedEquipment = 0;
  rentedEquipment = 0;

  columns: ColumnConfig[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nome' },
    { field: 'type', header: 'Tipo' },
    { field: 'serialNumber', header: 'Número de Série' },
    { field: 'status', header: 'Status' }
  ];

  pageResponse: PageResponse<Equipment> | null = null;
  loading: boolean = false;

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading = true;

    this.equipmentService.getDashboardData(page, 10).subscribe({
      next: (response) => {

        this.pageResponse = {
          content: response.equipments.content,
          page: response.equipments.page,
          size: response.equipments.size,
          totalElements: response.equipments.totalElements,
          totalPages: response.equipments.totalPages,
          first: response.equipments.first,
          last: response.equipments.last,
          empty: response.equipments.empty,
        };

        this.totalEquipment = response.stats.total;
        this.availableEquipment = response.stats.available;
        this.reservedEquipment = response.stats.reserved;
        this.rentedEquipment = response.stats.rented;

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar equipamentos:', error);
        this.loading = false;
      }
    });
  }

  createContract() {
    console.log('Novo Contrato');
  }

  returnEquipment() {
    console.log('Devolução de Equipamento');
  }
}
