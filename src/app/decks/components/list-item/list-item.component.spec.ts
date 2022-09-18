import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Timestamp } from 'firebase/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { ListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      teardown: { destroyAfterEach: false }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemComponent);
    component = fixture.componentInstance;
    component.deck = { uid: '', name: '', description: '', author: '', numberCards: 0 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a date when createdAt is set', () => {
    expect(fixture.nativeElement.querySelector('deck_created')).toBeNull();
    component.deck = { createdAt: new Timestamp(1643572027, 0), uid: '', name: '', description: '', author: '', numberCards: 0 };
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('deck_created')).toBeDefined();
  });

  it('should display a banner when createdAt is within the timeframe and displayBanner is true', () => {
    expect(fixture.nativeElement.querySelector('banner')).toBeNull();
    component.deck = { createdAt: new Timestamp(1643572027, 0), updatedAt: new Timestamp(Date.now() / 1000, 0), uid: '', name: '', description: '', author: '', numberCards: 0 };
    component.displayBanner = true;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('banner')).toBeDefined();
  });

});
