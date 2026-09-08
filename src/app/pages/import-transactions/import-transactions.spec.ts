import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTransactions } from './import-transactions';

describe('ImportTransactions', () => {
  let component: ImportTransactions;
  let fixture: ComponentFixture<ImportTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
