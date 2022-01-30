import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AuthService, User } from 'src/app/core/auth.service';
import { Deck, DeckService } from 'src/app/core/services/deck.service';

import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let deckServiceSub: Partial<DeckService> = {
    get(id: string): Observable<Deck> {
      return of({ name: '', description: '', author: '', numberCards: 0 });
    },
    allPublicDecks(): Observable<Deck[]> {
      return of([]);
    }
  }

  let authServiceSub: Partial<AuthService> = {
    user: of({ uid: '', role: 'user', email: '' }),
    getUser(): User | null {
      return null;
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ListComponent],
      providers: [
        { provide: DeckService, useValue: deckServiceSub },
        { provide: AuthService, useValue: authServiceSub }
      ],
      teardown: { destroyAfterEach: false }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
