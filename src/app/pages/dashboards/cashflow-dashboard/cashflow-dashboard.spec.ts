import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowDashboard } from './cashflow-dashboard';

describe('CashflowDashboard', () => {
  let component: CashflowDashboard;
  let fixture: ComponentFixture<CashflowDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashflowDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashflowDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
