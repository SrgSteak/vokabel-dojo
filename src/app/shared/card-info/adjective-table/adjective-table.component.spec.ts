import { TestBed } from '@angular/core/testing';
import { AdjectiveTableComponent, konjugationType } from './adjective-table.component';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { AdjectiveType } from 'src/app/core/entities/card-type';
import using from 'jasmine-data-provider';

describe('AdjectiveTableComponent', () => {
  let component: AdjectiveTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdjectiveTableComponent]
    })
    component = TestBed.inject(AdjectiveTableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    // adjective table 普通形 Buch 1 S 170
  using({
    'should render default い形容詞': {
      card: { adjectiveType: AdjectiveType.iAdjective, japanese: '暖かい' },
      flex: konjugationType.default,
      expectedResult: '暖かい'
    },
    'should render past い形容詞': {
      card: { adjectiveType: AdjectiveType.iAdjective, japanese: '暖かい' },
      flex: konjugationType.past,
      expectedResult: '暖かかった'
    },
    'should render negated い形容詞': {
      card: { adjectiveType: AdjectiveType.iAdjective, japanese: '暖かい' },
      flex: konjugationType.negated,
      expectedResult: '暖かくない'
    },
    'should render negated past い形容詞': {
      card: { adjectiveType: AdjectiveType.iAdjective, japanese: '暖かい' },
      flex: konjugationType.negatedPast,
      expectedResult: '暖かくなかった'
    },
    'should render default な形容詞': {
      card: { adjectiveType: AdjectiveType.naAdjective, japanese: '有名' },
      flex: konjugationType.default,
      expectedResult: '有名'
    },
    'should render past な形容詞': {
      card: { adjectiveType: AdjectiveType.naAdjective, japanese: '有名' },
      flex: konjugationType.past,
      expectedResult: '有名でした'
    },
    'should render negated な形容詞': {
      card: { adjectiveType: AdjectiveType.naAdjective, japanese: '有名' },
      flex: konjugationType.negated,
      expectedResult: '有名ではありません'
    },
    'should render negated past な形容詞': {
      card: { adjectiveType: AdjectiveType.naAdjective, japanese: '有名' },
      flex: konjugationType.negatedPast,
      expectedResult: '有名ではありませんでした'
    }
  }, (data: {card: CardInterface, flex: konjugationType, expectedResult: string}, desc: string) => {
    it(desc, () => {
      const result = component.flexLemma(data.card, data.flex);
      expect(result).toBe(data.expectedResult)
    })
  })
});
