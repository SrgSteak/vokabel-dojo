import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbType } from 'src/app/core/entities/card-type';
import { konjugationType, VerbTableComponent } from './verb-table.component';
import using from 'jasmine-data-provider';

describe('VerbTableComponent', () => {
  let component: VerbTableComponent;
  let fixture: ComponentFixture<VerbTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerbTableComponent],
      teardown: { destroyAfterEach: false }
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

  using([
    { origin: '言う', expected: '言います'},
    { origin: '作る', expected: '作ります'},
    { origin: '読む', expected: '読みます'},
    { origin: '使う', expected: '使います'},
    { origin: '呼ぶ', expected: '呼びます'},
    { origin: '送る', expected: '送ります'},
    { origin: '話す', expected: '話します'},
  ], (data) => {
    it('shoud correctly flex all godan verbs to ます form', () => {
      expect(component.flexLemma(data.origin, VerbType.godan, konjugationType.masu)).toBe(data.expected);
    });
  });

  using([
    { origin: '見る', expected: '見ます'},
    { origin: '褒める', expected: '褒めます'},
    { origin: '始める', expected: '始めます'},
    { origin: '育てる', expected: '育てます'},
    { origin: '決める', expected: '決めます'},
    { origin: '建てる', expected: '建てます'},
  ], (data) => {
    it('shoud correctly flex all ichidan verbs to ます form', () => {
      expect(component.flexLemma(data.origin, VerbType.ichidan, konjugationType.masu)).toBe(data.expected);
    });
  });

  using([
    // neutral lemma to 'a' version + ない
    { origin: '言う', type: VerbType.godan, expected: '言わない'},
    { origin: '作る', type: VerbType.godan, expected: '作らない'},
    { origin: '読む', type: VerbType.godan, expected: '読まない'},
    { origin: '使う', type: VerbType.godan, expected: '使わない'},
    { origin: '呼ぶ', type: VerbType.godan, expected: '呼ばない'},
    { origin: '送る', type: VerbType.godan, expected: '送らない'},
    { origin: '話す', type: VerbType.godan, expected: '話さない'},

    // neutral - る　+ ない
    { origin: '見る', type: VerbType.ichidan, expected: '見ない'},
    { origin: '褒める', type: VerbType.ichidan, expected: '褒めない'},
    { origin: '始める', type: VerbType.ichidan, expected: '始めない'},
    { origin: '育てる', type: VerbType.ichidan, expected: '育てない'},
    { origin: '決める', type: VerbType.ichidan, expected: '決めない'},
    { origin: '建てる', type: VerbType.ichidan, expected: '建てない'},
  ], (data: { origin: string; type: VerbType; expected: string; }) => {
    it('shoud correctly flex all verbs to negated neutral form', () => {
      expect(component.flexLemma(data.origin, data.type, konjugationType.negatedNeutral)).toBe(data.expected);
    });
  });
});
