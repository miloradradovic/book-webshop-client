import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Writer } from 'src/app/model/writer.model';
import { CatalogService } from 'src/app/services/catalog.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';

@Component({
  selector: 'app-edit-writer',
  templateUrl: './edit-writer.component.html',
  styleUrls: ['./edit-writer.component.css']
})
export class EditWriterComponent implements OnInit {

  form: FormGroup;
  private fb: FormBuilder;
  writer!: Writer;

  constructor(
    fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private catalogService: CatalogService,
    public dialogRef: MatDialogRef<EditWriterComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Writer
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      name: [null, [Validators.pattern('[A-Z][a-z]+')]],
      surname: [null, [Validators.pattern('[A-Z][a-z]+')]],
      biography: [null, [Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
    this.initializeFields();
  }

  initializeFields(): void {
    this.writer = this.data;
    this.form.controls['name'].setValue(this.writer.name);
    this.form.controls['surname'].setValue(this.writer.surname);
    this.form.controls['biography'].setValue(this.writer.biography);
  }

  checkFields(): boolean {
    if (
      this.form.value.name === this.writer.name &&
      this.form.value.surname === this.writer.surname &&
      this.form.value.biography === this.writer.biography
    ) {
      return false;
    }
    return true;
  }

  fillOutEmptyFields(): void {

    if (!this.form.value.name) {
      this.form.controls['name'].setValue(this.writer.name);
    }

    if (!this.form.value.surname) {
      this.form.controls['surname'].setValue(this.writer.surname);
    }

    if (!this.form.value.biography) {
      this.form.controls['biography'].setValue(this.writer.biography);
    }
  }

  prepareEdit(): void {
    this.spinnerService.show();
    this.fillOutEmptyFields();
    if (this.checkFields()) {
      this.edit();
    } else {
      this.spinnerService.hide();
      this.snackBar.open("You haven't changed anything!", 'Ok', {
        duration: 3000,
      });
    }
  }

  edit(): void {
    this.catalogService.editWriter(new Writer(this.writer.id, this.form.value.name, this.form.value.surname,
      this.form.value.biography)).subscribe({
        next: (result) => {
          this.spinnerService.hide();
          this.snackBar.open('Writer was successfully updated.', 'Ok', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.spinnerService.hide();
          this.spinnerService.hide();
          if (err.status === 403) {
            const dialogRef = this.dialog.open(RefreshTokenComponent, {});
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'refreshSuccess') {
                this.edit();
              } else if (result === 'refreshFail') {
                this.router.navigate(['/']);
              } else if (result === 'logout') {
                this.router.navigate(['/']);
              }
            })
          } else {
            this.snackBar.open(err.error, 'Ok', { duration: 3000 });
            this.initializeFields();
          }
        },
      });
  }
}
