import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarQuickSheetComponent } from './grammar-quick-sheet.component';

xdescribe('GrammarQuickSheetComponent', () => {
  let component: GrammarQuickSheetComponent;
  let fixture: ComponentFixture<GrammarQuickSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GrammarQuickSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarQuickSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
