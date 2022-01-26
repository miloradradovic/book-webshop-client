import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookCatalogData } from 'src/app/model/book.model';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.css']
})
export class CatalogItemComponent implements OnInit {

  @Input() book!: BookCatalogData;
  @Output() bookId = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  viewDetails(bookId: number) {
    this.bookId.emit(bookId);
  }

}
