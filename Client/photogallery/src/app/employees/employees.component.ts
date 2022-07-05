import { Component, OnInit } from '@angular/core';
import { Employee } from '../interfaces/employee.interface';
import { EmployeesService } from '../services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  employees:Employee[] = [];
  // Dummy Data
  // employees:Employee[] = [
  //   {"ID":1,"Emp_name":"Bob Local","City_name":"Paris","Country_name":"France"},
  //   {"ID":2,"Emp_name":"Steve Local","City_name":"Surrey","Country_name":"Canada"},
  //   {"ID":3,"Emp_name":"Mary","City_name":"Moscow","Country_name":"Russia"},
  //   {"ID":4,"Emp_name":"Mark","City_name":"Paris","Country_name":"France"},
  //   {"ID":5,"Emp_name":"Daisy","City_name":"Paris","Country_name":"France"}
  // ]

  constructor(private es:EmployeesService) { }

  ngOnInit(): void {
    this.es.getAllEmployees().subscribe(employees => {
      console.log(employees);
      this.employees = employees;
    })
  }

}
