import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Writer } from 'src/app/model/writer.model';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-writers-dashboard',
  templateUrl: './writers-dashboard.component.html',
  styleUrls: ['./writers-dashboard.component.css']
})
export class WritersDashboardComponent implements OnInit {

  dataSource = new MatTableDataSource();
  writers: Writer[] = [];

  columnsToDisplay: string[] = [
    'Name',
    'Surname',
    'Biography',
    'Edit'
  ];
  columnsToIterate: string[] = [
    'name',
    'surname',
    'biography'
  ];

  constructor(
    private catalogService: CatalogService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllWriters();
  }

  getAllWriters(): void {
    this.catalogService.getAllWriters().subscribe({
      next: (result) => {
        this.writers = result;
        this.dataSource.data = this.writers;
      }
    })
  }

  add() {

  }

  edit(writerId: number) {

  }

}
