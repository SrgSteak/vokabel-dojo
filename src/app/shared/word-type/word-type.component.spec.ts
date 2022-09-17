import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordTypeComponent } from './word-type.component';

describe('WordTypeComponent', () => {
  let component: WordTypeComponent;
  let fixture: ComponentFixture<WordTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WordTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
