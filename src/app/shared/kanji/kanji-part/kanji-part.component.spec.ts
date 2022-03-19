import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanjiPartComponent } from './kanji-part.component';

describe('KanjiPartComponent', () => {
  let component: KanjiPartComponent;
  let fixture: ComponentFixture<KanjiPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanjiPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanjiPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
