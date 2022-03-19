import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanjiPartsComponent } from './kanji-parts.component';

describe('KanjiPartsComponent', () => {
  let component: KanjiPartsComponent;
  let fixture: ComponentFixture<KanjiPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanjiPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanjiPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
