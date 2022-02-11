import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritersDashboardComponent } from './writers-dashboard.component';

describe('WritersDashboardComponent', () => {
  let component: WritersDashboardComponent;
  let fixture: ComponentFixture<WritersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WritersDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WritersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
