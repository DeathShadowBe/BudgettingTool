import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeefbudgetDashboard } from './leefbudget-dashboard';

describe('LeefbudgetDashboard', () => {
  let component: LeefbudgetDashboard;
  let fixture: ComponentFixture<LeefbudgetDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeefbudgetDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeefbudgetDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
