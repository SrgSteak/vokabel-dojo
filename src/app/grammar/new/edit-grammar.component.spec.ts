import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrammarComponent } from './edit-grammar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GrammarService } from 'src/app/core/grammar.service';

class GrammarServiceStub {
}

describe('NewComponent', () => {
  let component: EditGrammarComponent;
  let fixture: ComponentFixture<EditGrammarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EditGrammarComponent, RouterTestingModule, NoopAnimationsModule ],
      providers: [
        { provide: GrammarService, useClass: GrammarServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGrammarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
