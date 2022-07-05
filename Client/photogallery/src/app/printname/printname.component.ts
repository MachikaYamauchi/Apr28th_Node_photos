import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'printname',
  templateUrl: './printname.component.html',
  styleUrls: ['./printname.component.scss']
})
export class PrintnameComponent implements OnInit {
  @Input() name:string = "Bill Gates";
  @Input() color:string = "green";

  constructor() { }

  ngOnInit(): void {
  }

}
