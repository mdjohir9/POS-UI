import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface Person {
  id: string;
  name: string;
  shipment: string;
  department: string;
  employeeCode: string;
  joinDate: string;
  status: string;
}
@Component({
  selector: 'app-separetion-list',
  templateUrl: './separetion-list.component.html',
  styleUrl: './separetion-list.component.css'
})
export class SeparetionListComponent {
isLoading = true;
  showContent = false;

  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }


  value = '';
    statusFilter = '';
    contactSearchValue = '';
    people: Person[] = [];
    filteredPeople: Person[] = [];
  
    constructor(private http: HttpClient) {}
  
    ngOnInit(): void {

      this.loadData();
      this.people = [
        {
          id: '1',
          name: 'John Doe',
          shipment: 'Shipment A',
          department: 'Finance',
          employeeCode: 'E123',
          joinDate: '2023-01-15',
          status: 'Active',
        },
        {
          id: '2',
          name: 'Jane Smith',
          shipment: 'Shipment B',
          department: 'HR',
          employeeCode: 'E124',
          joinDate: '2022-07-10',
          status: 'Inactive',
        },
      ];
    }
  
  
    searchById(): void {
      if (this.value) {
        this.filteredPeople = this.people.filter(
          (person) => person.id === this.value
        );
      } else {
        this.filteredPeople = this.people;
      }
    }
  
    filterByContact(): void {
      this.filteredPeople = this.applyFilters();
    }
  
    filterByStatus(): void {
      this.filteredPeople = this.applyFilters();
    }
  
    private applyFilters(): Person[] {
      return this.people.filter((person) =>
        person.name.toLowerCase().includes(this.contactSearchValue.toLowerCase())
        && (this.statusFilter === 'all' || person.status.toLowerCase() === this.statusFilter.toLowerCase())
      );
    }
}
