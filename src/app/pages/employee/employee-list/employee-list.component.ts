import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { IEmployee } from 'src/app/core/models/interfaces/IEmployee';
import { EmployeeService } from 'src/app/core/services/EmployeeService';
import Swal from 'sweetalert2';
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
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  isLoading = true;
  showContent = false;
  allEmpData: IEmployee[] = []; // Store original data
  EmpData: IEmployee[] = [];
  constructor(private EmployeeService: EmployeeService, private datePipe: DatePipe) {}

  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }

  
    ngOnInit(): void {

      this.getEmployees();
      
    }

    getEmployees() {
      setTimeout(() => {
        this.isLoading = true;
        this.EmployeeService.getEmployeesApiCall().subscribe(
          (response: IApiResponse<IEmployee[]>) => {
            this.isLoading = false;
      
            if (response.statusCode === 200) {
              this.allEmpData = response.data; // Store all data
              this.showContent = true;
            } else {
              console.error('Error fetching leaves:', response.message);
            }
          },
          error => {
            this.isLoading = false;
            console.error('API Error:', error);
          }
        );
      })
    
     }

     drop(event: CdkDragDrop<any[]>): void {
      // Swap the items in the array based on drag-drop event
      moveItemInArray(this.allEmpData, event.previousIndex, event.currentIndex);
    
      // Get the specific dragged employee
      const draggedEmployee = this.allEmpData[event.currentIndex];
      
      // Update only the dragged employee's custom ordering
      draggedEmployee.customOrdering = event.currentIndex + 1; // Update ordering
    
      // Call API with only dragged employee data
      this.EmployeeService.saveEmployeeShorting(draggedEmployee.empId, draggedEmployee.customOrdering).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Sorting updated successfully!'
          });
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating the sorting. Please try again.'
          });
        }
      );
    }
    
    

    


}
