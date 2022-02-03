import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Writer } from 'src/app/model/writer.model';
import { CatalogService } from 'src/app/services/catalog.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';
import { AddWriterComponent } from '../add-writer/add-writer.component';
import { EditWriterComponent } from '../edit-writer/edit-writer.component';

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
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllWriters();
  }

  getAllWriters(): void {
    this.catalogService.getAllWriters().subscribe({
      next: (result) => {
        this.writers = result;
        this.dataSource.data = this.writers;
      },
      error: (err) => {
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.getAllWriters();
            } else if (result === 'refreshFail') {
              this.router.navigate(['/']);
            } else if (result === 'logout') {
              this.router.navigate(['/']);
            }
          })
        } else {
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
        }
      }
    })
  }

  add() {
    const dialogRef = this.dialog.open(AddWriterComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllWriters();
      }
    });
  }

  edit(writerId: number) {
    let writer!: Writer;

    this.writers.forEach((element) => {
      if (element.id === writerId) {
        writer = element;
      }
    });

    const dialogRef = this.dialog.open(EditWriterComponent, {
      width: '30%',
      data: writer,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllWriters();
      }
    });
  }

}
