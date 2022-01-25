import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationUnauthenticatedComponent } from './navigation-unauthenticated.component';

describe('NavigationUnauthenticatedComponent', () => {
  let component: NavigationUnauthenticatedComponent;
  let fixture: ComponentFixture<NavigationUnauthenticatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationUnauthenticatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationUnauthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
