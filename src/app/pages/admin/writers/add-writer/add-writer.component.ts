import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Writer } from 'src/app/model/writer.model';
import { CatalogService } from 'src/app/services/catalog.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';

@Component({
  selector: 'app-add-writer',
  templateUrl: './add-writer.component.html',
  styleUrls: ['./add-writer.component.css']
})
export class AddWriterComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;

  constructor(
    fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private catalogService: CatalogService,
    public dialogRef: MatDialogRef<AddWriterComponent>,
    public dialog: MatDialog
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('[A-Z][a-z]+')]],
      surname: [null, [Validators.required, Validators.pattern('[A-Z][a-z]+')]],
      biography: [null, [Validators.required, Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
  }

  add(): void {
    this.spinnerService.show();
    const writerData: Writer = new Writer(-1, this.form.value.name, this.form.value.surname,
      this.form.value.biography);

    this.catalogService.createWriter(writerData).subscribe({
      next: (result) => {
        this.spinnerService.hide();
        this.snackBar.open('Writer was successfully created!', 'Ok', {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.spinnerService.hide();
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.add();
            } else if (result === 'refreshFail') {
              this.router.navigate(['/']);
            } else if (result === 'logout') {
              this.router.navigate(['/']);
            }
          })
        } else {
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
        }
      },
    });

  }

}
