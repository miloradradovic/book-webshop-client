import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @Input() dataSource = new MatTableDataSource();
  @Input() columnsToDisplay: string[] = [];
  @Input() columnsToIterate: string[] = [];

  @Output() orderedItems = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() deleteEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        let vary = this.get(propName);
        vary = changes[propName].currentValue;
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  get(element: string): any {
    switch (element) {
      case 'dataSource':
        return this.dataSource;
      case 'columnsToDisplay':
        return this.columnsToDisplay;
      default:
        return this.columnsToIterate;
    }
  }

  viewOrderedItems(id: number) {
    this.orderedItems.emit(id);
  }

  edit(id: number) {
    this.editEvent.emit(id);
  }

  delete(id: number) {
    this.deleteEvent.emit(id);
  }
}
