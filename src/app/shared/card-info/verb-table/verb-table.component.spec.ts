import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbTableComponent } from './verb-table.component';

describe('VerbTableComponent', () => {
  let component: VerbTableComponent;
  let fixture: ComponentFixture<VerbTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
