import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() photo: string = '';
  @Output() selectedFile = new EventEmitter<File>();


  constructor() { }

  ngOnInit(): void {
  }

  selectFile(event: any) {
    let selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(event.target.files[0]);
    this.selectedFile.emit(selectedFile);
  }

  handleReaderLoaded = (event: any) => {
    const reader = event.target;
    const picture = reader.result.replace(/(\r\n\t|\n|\r\t)/gm, '');
    this.photo = picture;
  }

}
