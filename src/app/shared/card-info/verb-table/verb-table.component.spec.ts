import { TestBed } from '@angular/core/testing';
import { VerbType } from 'src/app/core/entities/card-type';
import { konjugationType, VerbTableComponent } from './verb-table.component';
import using from 'jasmine-data-provider';

describe('VerbTableComponent', () => {
  let component: VerbTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerbTableComponent]
    })
      component = TestBed.inject(VerbTableComponent)
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

  // adjective table 普通形

  // ======================= NEUTRAL FORM / た形 =======================
  // negated neutral
  using([
    // <ごだんかつよう どうし　I グループ>
    // <五段活用　動詞　I　グループ> / Group 1 / fünfstufige Verben
    // neutral lemma to 'a' version + ない
    { origin: '作る', type: VerbType.godan, expected: '作らない'},
    { origin: '使う', type: VerbType.godan, expected: '使わない'},
    { origin: '呼ぶ', type: VerbType.godan, expected: '呼ばない'},
    { origin: '送る', type: VerbType.godan, expected: '送らない'},
    { origin: '書く', type: VerbType.godan, expected: '書かない'},
    { origin: '行く', type: VerbType.godan, expected: '行かない'},
    { origin: '急ぐ', type: VerbType.godan, expected: '急がない'},
    { origin: '話す', type: VerbType.godan, expected: '話さない'},
    { origin: '立つ', type: VerbType.godan, expected: '立たない'},
    { origin: '死ぬ', type: VerbType.godan, expected: '死なない'},
    { origin: '飛ぶ', type: VerbType.godan, expected: '飛ばない'},
    { origin: '読む', type: VerbType.godan, expected: '読まない'},
    { origin: '取る', type: VerbType.godan, expected: '取らない'},
    { origin: '言う', type: VerbType.godan, expected: '言わない'},

    // <いちだんかつよう　どうし　II グループ>
    // <一段活用　動詞　II グループ> / Group 2 / einstufige Verben
    // neutral - る　+ ない
    { origin: '起きる', type: VerbType.ichidan, expected: '起きない'},
    { origin: '食べる', type: VerbType.ichidan, expected: '食べない'},
    { origin: '寝る', type: VerbType.ichidan, expected: '寝ない'},
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

  // past neutral
  using([
    // <ごだんかつよう どうし　I グループ>
    // <五段活用　動詞　I　グループ> / Group 1 / fünfstufige Verben
    // neutral lemma to 'i' version + た
    { origin: '作る', type: VerbType.godan, expected: '作った'},
    { origin: '使う', type: VerbType.godan, expected: '使った'},
    { origin: '呼ぶ', type: VerbType.godan, expected: '呼んだ'},
    { origin: '送る', type: VerbType.godan, expected: '送った'},
    { origin: '書く', type: VerbType.godan, expected: '書きた'},
    { origin: '行く', type: VerbType.godan, expected: '行きた'},
    { origin: '急ぐ', type: VerbType.godan, expected: '急いだ'},
    { origin: '話す', type: VerbType.godan, expected: '話した'},
    { origin: '立つ', type: VerbType.godan, expected: '立った'},
    { origin: '死ぬ', type: VerbType.godan, expected: '死んだ'},
    { origin: '飛ぶ', type: VerbType.godan, expected: '飛んだ'},
    { origin: '読む', type: VerbType.godan, expected: '読んだ'},
    { origin: '取る', type: VerbType.godan, expected: '取った'},
    { origin: '言う', type: VerbType.godan, expected: '言った'},

    // <いちだんかつよう　どうし　II グループ>
    // <一段活用　動詞　II グループ> / Group 2 / einstufige Verben
    // neutral - る + た
    { origin: '見る', type: VerbType.ichidan, expected: '見た'},
    { origin: '褒める', type: VerbType.ichidan, expected: '褒めた'},
    { origin: '始める', type: VerbType.ichidan, expected: '始めた'},
    { origin: '育てる', type: VerbType.ichidan, expected: '育てた'},
    { origin: '決める', type: VerbType.ichidan, expected: '決めた'},
    { origin: '建てる', type: VerbType.ichidan, expected: '建てた'}],
    (data: { origin: string; type: VerbType; expected: string; }) => {
    it('shoud correctly flex all verbs to past neutral form', () => {
      expect(component.flexLemma(data.origin, data.type, konjugationType.pastNeutral)).toBe(data.expected);
    });
  });

  // negated past neutral
  using([
    // <ごだんかつよう どうし　I グループ>
    // <五段活用　動詞　I　グループ> / Group 1 / fünfstufige Verben
    // neutral lemma to 'a' version + な + かった
    { origin: '作る', type: VerbType.godan, expected: '作らなかった'},
    { origin: '使う', type: VerbType.godan, expected: '使わなかった'},
    { origin: '呼ぶ', type: VerbType.godan, expected: '呼ばなかった'},
    { origin: '送る', type: VerbType.godan, expected: '送らなかった'},
    { origin: '書く', type: VerbType.godan, expected: '書かなかった'},
    { origin: '行く', type: VerbType.godan, expected: '行かなかった'},
    { origin: '急ぐ', type: VerbType.godan, expected: '急がなかった'},
    { origin: '話す', type: VerbType.godan, expected: '話さなかった'},
    { origin: '立つ', type: VerbType.godan, expected: '立たなかった'},
    { origin: '死ぬ', type: VerbType.godan, expected: '死ななかった'},
    { origin: '飛ぶ', type: VerbType.godan, expected: '飛ばなかった'},
    { origin: '読む', type: VerbType.godan, expected: '読まなかった'},
    { origin: '取る', type: VerbType.godan, expected: '取らなかった'},
    { origin: '言う', type: VerbType.godan, expected: '言わなかった'},


    // <いちだんかつよう　どうし　II グループ>
    // <一段活用　動詞　II グループ> / Group 2 / einstufige Verben
    // neutral - る　+ な + かった
    { origin: '起きる', type: VerbType.ichidan, expected: '起きなかった'},
    { origin: '食べる', type: VerbType.ichidan, expected: '食べなかった'},
    { origin: '寝る', type: VerbType.ichidan, expected: '寝なかった'},
    { origin: '見る', type: VerbType.ichidan, expected: '見なかった'},
    { origin: '褒める', type: VerbType.ichidan, expected: '褒めなかった'},
    { origin: '始める', type: VerbType.ichidan, expected: '始めなかった'},
    { origin: '育てる', type: VerbType.ichidan, expected: '育てなかった'},
    { origin: '決める', type: VerbType.ichidan, expected: '決めなかった'},
    { origin: '建てる', type: VerbType.ichidan, expected: '建てなかった'}],
    (data: { origin: string; type: VerbType; expected: string; }) => {
    it('shoud correctly flex all verbs to past neutral form', () => {
      expect(component.flexLemma(data.origin, data.type, konjugationType.negatedPastNeutral)).toBe(data.expected);
    });
  });
  // ===================== NEUTRAL FORM / た形 END =====================
});
