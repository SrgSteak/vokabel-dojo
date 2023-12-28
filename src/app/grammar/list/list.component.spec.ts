import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { GrammarService } from 'src/app/core/grammar.service';
import { Observable, of } from 'rxjs';
import { AuthService, User } from 'src/app/core/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class authServiceStub {
  user = new Observable<User>();
}
class grammarServiceStub {
  all() {
    return of([]);
  }
}

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListComponent, RouterTestingModule, NoopAnimationsModule ],
      providers: [
        {provide: GrammarService, useClass: grammarServiceStub},
        {provide: AuthService, useClass: authServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
