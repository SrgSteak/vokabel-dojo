import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjectiveTableComponent } from './adjective-table.component';

describe('AdjectiveTableComponent', () => {
  let component: AdjectiveTableComponent;
  let fixture: ComponentFixture<AdjectiveTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjectiveTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjectiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
