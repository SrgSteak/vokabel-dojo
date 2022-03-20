import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { CardService } from 'src/app/core/services/card.service';

import { ModeSelectComponent } from './mode-select.component';

describe('ModeSelectComponent', () => {
  let component: ModeSelectComponent;
  let fixture: ComponentFixture<ModeSelectComponent>;
  let cardServiceStub: Partial<CardService> = jasmine.createSpyObj(
    'CardService', { loadForDeckUid: of([]) }
  );
  let authServiceStub: Partial<AuthService>;
  authServiceStub = {
    user: new BehaviorSubject(null)
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule],
      declarations: [ModeSelectComponent],
      providers: [
        { provide: CardService, useValue: cardServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const authService = TestBed.inject(AuthService);
    // authService.user = new BehaviorSubject(null);
    const cardService = TestBed.inject(CardService);
    // spyOn(cardService, 'loadForDeckUid').and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
