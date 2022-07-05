import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  // url = "http://localhost:4400/employeesapi";

  url = "http://localhost:4400/employeessp";

  constructor(private eshttp:HttpClient) { }

  getAllEmployees() {
    return this.eshttp.get<Employee[]>(this.url) // This will return the Observables
  }
}
