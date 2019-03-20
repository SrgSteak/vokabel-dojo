import { Injectable } from '@angular/core';
import { FlashcardService } from './flashcard.service';

@Injectable()
export class VocabularyService extends FlashcardService {
  hiragana = {
    a: [
      {hits: 0, misses: 0, hiragana: 'あおい', german: 'blau'},
      {hits: 0, misses: 0, hiragana: 'うえ', german: 'oben'},
      {hits: 0, misses: 0, hiragana: 'あう', german: 'jmd. treffen'},
      {hits: 0, misses: 0, hiragana: 'いいえ', german: 'höfliches nein'},
      {hits: 0, misses: 0, hiragana: 'おう', german: 'König'},
      {hits: 0, misses: 0, hiragana: 'ええ', german: 'ja (unter Freunden)'},
      {hits: 0, misses: 0, hiragana: 'いい', german: 'gut'},
      {hits: 0, misses: 0, hiragana: 'あい', german: 'Liebe'},
      {hits: 0, misses: 0, hiragana: 'おおい', german: 'viel'},
      {hits: 0, misses: 0, hiragana: 'いえ', german: 'Haus'}
    ],

    ka: [
      {hits: 0, misses: 0, hiragana: 'いく', german: 'gehen'},
      {hits: 0, misses: 0, hiragana: 'こえ', german: 'Stimme'},
      {hits: 0, misses: 0, hiragana: 'あき', german: 'Herbst'},
      {hits: 0, misses: 0, hiragana: 'えき', german: 'Bahnhof'},
      {hits: 0, misses: 0, hiragana: 'いけ', german: 'Teich'},
      {hits: 0, misses: 0, hiragana: 'かげ', german: 'Schatten'},
      {hits: 0, misses: 0, hiragana: 'かく', german: 'schreiben'},
      {hits: 0, misses: 0, hiragana: 'あかい', german: 'rot (adjektiv)'},
      {hits: 0, misses: 0, hiragana: 'きかい', german: 'Gelegenheit, Maschine'},
      {hits: 0, misses: 0, hiragana: 'がいこく', german: 'Ausland'},
    ],

    sa: [
      {hits: 0, misses: 0, hiragana: 'けさ', german: 'heute morgen'},
      {hits: 0, misses: 0, hiragana: 'さけ', german: 'Alkohol, jap. Reiswein'},
      {hits: 0, misses: 0, hiragana: 'いし', german: 'Stein'},
      {hits: 0, misses: 0, hiragana: 'あさ', german: 'der Morgen'},
      {hits: 0, misses: 0, hiragana: 'すいか', german: 'Wassermelone'},
      {hits: 0, misses: 0, hiragana: 'いす', german: 'Sessel'},
      {hits: 0, misses: 0, hiragana: 'すし', german: 'Sushi'},
      {hits: 0, misses: 0, hiragana: 'かせ', german: 'Wind, Erkältung'},
      {hits: 0, misses: 0, hiragana: 'あそこ', german: 'dort drüben'},
      {hits: 0, misses: 0, hiragana: 'かそく', german: 'Familie'}
    ],

    ta: [
      {hits: 0, misses: 0, hiragana: 'あつい', german: 'heiß'},
      {hits: 0, misses: 0, hiragana: 'ちち', german: 'mein Vater'},
      {hits: 0, misses: 0, hiragana: 'つくえ', german: 'Tisch'},
      {hits: 0, misses: 0, hiragana: 'とき', german: 'Zeit'},
      {hits: 0, misses: 0, hiragana: 'ときどき', german: 'manchmal'},
      {hits: 0, misses: 0, hiragana: 'とけい', german: 'Uhr'},
      {hits: 0, misses: 0, hiragana: 'おとうと', german: 'mein jüngerer Bruder'},
      {hits: 0, misses: 0, hiragana: 'てつだう', german: 'helfen'},
      {hits: 0, misses: 0, hiragana: 'さとう', german: 'Zucker'},
      {hits: 0, misses: 0, hiragana: 'くち', german: 'Mund'}
    ],

    na: [
      {hits: 0, misses: 0, hiragana: 'あね', german: 'meine ältere Schwester'},
      {hits: 0, misses: 0, hiragana: 'ねこ', german: 'Katze'},
      {hits: 0, misses: 0, hiragana: 'いぬ', german: 'Hund'},
      {hits: 0, misses: 0, hiragana: 'なつ', german: 'Sommer'},
      {hits: 0, misses: 0, hiragana: 'あに', german: 'mein älterer Bruder'},
      {hits: 0, misses: 0, hiragana: 'きのう', german: 'gestern'},
      {hits: 0, misses: 0, hiragana: 'たね', german: 'Samen'},
      {hits: 0, misses: 0, hiragana: 'きのこ', german: 'Pilz'},
      {hits: 0, misses: 0, hiragana: 'にく', german: 'Fleisch'},
      {hits: 0, misses: 0, hiragana: 'くに', german: 'Land'}
    ],

    ha: [
      {hits: 0, misses: 0, hiragana: 'ぼく', german: 'Ich (relativ höflich, verwendet von Männern)'},
      {hits: 0, misses: 0, hiragana: 'ふね', german: 'Boot'},
      {hits: 0, misses: 0, hiragana: 'へび', german: 'Schlange'},
      {hits: 0, misses: 0, hiragana: 'はは', german: 'meine Mutter'},
      {hits: 0, misses: 0, hiragana: 'ほし', german: 'Stern'},
      {hits: 0, misses: 0, hiragana: 'ひくい', german: 'niedrig'},
      {hits: 0, misses: 0, hiragana: 'ひと', german: 'Mensch, Person'},
      {hits: 0, misses: 0, hiragana: 'ひこうき', german: 'Flugzeug'},
      {hits: 0, misses: 0, hiragana: 'はし', german: 'Stäbchen (zum Essen)'},
      {hits: 0, misses: 0, hiragana: 'ふく', german: 'Kleidung'}
    ],

    ma: [
      {hits: 0, misses: 0, hiragana: 'めがね', german: 'Brille'},
      {hits: 0, misses: 0, hiragana: 'はさみ', german: 'Schere'},
      {hits: 0, misses: 0, hiragana: 'もも', german: 'Pfirsich'},
      {hits: 0, misses: 0, hiragana: 'むすこ', german: 'Sohn'},
      {hits: 0, misses: 0, hiragana: 'でも', german: 'aber'},
      {hits: 0, misses: 0, hiragana: 'てがみ', german: 'Brief'},
      {hits: 0, misses: 0, hiragana: 'さむい', german: 'kalt (Luft)'},
      {hits: 0, misses: 0, hiragana: 'みみ', german: 'Ohr'},
      {hits: 0, misses: 0, hiragana: 'まど', german: 'Fenster'},
      {hits: 0, misses: 0, hiragana: 'どうも', german: 'Danke'}
    ],

    ya: [
      {hits: 0, misses: 0, hiragana: 'やま', german: 'Berg'},
      {hits: 0, misses: 0, hiragana: 'よむ', german: 'Lesen'},
      {hits: 0, misses: 0, hiragana: 'おはよう', german: 'guten Morgen (kurform, unter Freunden)'},
      {hits: 0, misses: 0, hiragana: 'ゆめ', german: 'Traum'},
      {hits: 0, misses: 0, hiragana: 'ゆき', german: 'Schnee'},
      {hits: 0, misses: 0, hiragana: 'ふゆ', german: 'Winter'},
      {hits: 0, misses: 0, hiragana: 'よやく', german: 'Reservierung'},
      {hits: 0, misses: 0, hiragana: 'ゆかた', german: 'Yukata'},
      {hits: 0, misses: 0, hiragana: 'やすい', german: 'billig'},
      {hits: 0, misses: 0, hiragana: 'おやすみ', german: 'gute Nacht (unter Freunden)'}
    ],

    ra: [
      {hits: 0, misses: 0, hiragana: 'れい', german: 'Null, Beispiel'},
      {hits: 0, misses: 0, hiragana: 'ばら', german: 'Rose'},
      {hits: 0, misses: 0, hiragana: 'いろ', german: 'Farbe'},
      {hits: 0, misses: 0, hiragana: 'もり', german: 'Wald'},
      {hits: 0, misses: 0, hiragana: 'はる', german: 'Frühling'},
      {hits: 0, misses: 0, hiragana: 'しろい', german: 'weiß'},
      {hits: 0, misses: 0, hiragana: 'くろい', german: 'schwarz'},
      {hits: 0, misses: 0, hiragana: 'しろ', german: 'Schloss'},
      {hits: 0, misses: 0, hiragana: 'うるさい', german: 'laut, lästig'},
      {hits: 0, misses: 0, hiragana: 'くらい', german: 'dunkel'}
    ],

    wa: [
      {hits: 0, misses: 0, hiragana: 'わるい', german: 'schlecht'},
      {hits: 0, misses: 0, hiragana: 'わかい', german: 'jung'},
      {hits: 0, misses: 0, hiragana: 'かわいい', german: 'niedlich'},
      {hits: 0, misses: 0, hiragana: 'かわ', german: 'Fluss'},
      {hits: 0, misses: 0, hiragana: 'わたし', german: 'Ich, (höflich, beide Geschlechter)'},
      {hits: 0, misses: 0, hiragana: 'わに', german: 'Krokodil'},
      {hits: 0, misses: 0, hiragana: 'にわ', german: 'Garten'},
      {hits: 0, misses: 0, hiragana: 'わらう', german: 'lachen'},
      {hits: 0, misses: 0, hiragana: 'わがし', german: 'jap. traditionelle Süßigkeiten'},
      {hits: 0, misses: 0, hiragana: 'わし', german: 'jap. Papier'}
    ],

    n: [
      {hits: 0, misses: 0, hiragana: 'かんぱい', german: 'Prost'},
      {hits: 0, misses: 0, hiragana: 'せんせい', german: 'Lehrer'},
      {hits: 0, misses: 0, hiragana: 'さん', german: 'drei, Herr, Frau, chin. Lesung von Berg'},
      {hits: 0, misses: 0, hiragana: 'にほん', german: 'Japan'},
      {hits: 0, misses: 0, hiragana: 'きん', german: 'Gold'},
      {hits: 0, misses: 0, hiragana: 'てんのう', german: 'jap. Kaiser'},
      {hits: 0, misses: 0, hiragana: 'さんぽ', german: 'Spaziergang'},
      {hits: 0, misses: 0, hiragana: 'ほん', german: 'Buch'},
      {hits: 0, misses: 0, hiragana: 'もんだい', german: 'Frage, Problem'},
      {hits: 0, misses: 0, hiragana: 'てんぷら', german: 'Tempura'}
    ],

    combinations: [
      {hits: 0, misses: 0, hiragana: 'とうきょう', german: 'Tokio'},
      {hits: 0, misses: 0, hiragana: 'びょうき', german: 'krank'},
      {hits: 0, misses: 0, hiragana: 'しゅくだい', german: 'Hausaufgabe'},
      {hits: 0, misses: 0, hiragana: 'じゅぎょう', german: 'Unterricht'},
      {hits: 0, misses: 0, hiragana: 'かいしゃ', german: 'Firma'},
      {hits: 0, misses: 0, hiragana: 'おちゃ', german: 'Tee'},
      {hits: 0, misses: 0, hiragana: 'しゅみ', german: 'Hobby'},
      {hits: 0, misses: 0, hiragana: 'きょう', german: 'heute'},
      {hits: 0, misses: 0, hiragana: 'でんしゃ', german: 'Zug'},
      {hits: 0, misses: 0, hiragana: 'じしょ', german: 'Wörterbuch'},
    ],

    tsu: [
      {hits: 0, misses: 0, hiragana: 'きっぷ', german: 'Fahrkarte'},
      {hits: 0, misses: 0, hiragana: 'ざっし', german: 'Magazin, Zeitschrift'},
      {hits: 0, misses: 0, hiragana: 'ゆっくり', german: 'langsam und gemächlich (ohne Stress)'},
      {hits: 0, misses: 0, hiragana: 'がっこう', german: 'Schule'},
      {hits: 0, misses: 0, hiragana: 'ちょっと', german: 'ein bisschen'},
      {hits: 0, misses: 0, hiragana: 'いっぱい', german: 'viel, voll'},
      {hits: 0, misses: 0, hiragana: 'けっこん', german: 'Hochzeit, Heirat'},
      {hits: 0, misses: 0, hiragana: 'にっき', german: 'Tagebuch'},
    ]
  }

  katakana = {
    a: [
      {hits: 0, misses: 0, katakana: 'アジア', german: 'Asien'},
      {hits: 0, misses: 0, katakana: 'ケーキ', german: 'Kuchen'},
      {hits: 0, misses: 0, katakana: 'ケース', german: 'Koffer, Behälter'},
      {hits: 0, misses: 0, katakana: 'スイス', german: 'Schweiz'},
      {hits: 0, misses: 0, katakana: 'ソーセージ', german: 'Würstchen'},
      {hits: 0, misses: 0, katakana: 'スキー', german: 'Ski'}
    ],
    ta: [
      {hits: 0, misses: 0, katakana: '', german: 'Rock (skirt)'},
      {hits: 0, misses: 0, katakana: '', german: 'Skate'},
      {hits: 0, misses: 0, katakana: '', german: 'Fußball (soccer)'},
      {hits: 0, misses: 0, katakana: '', german: 'Taxi'},
      {hits: 0, misses: 0, katakana: '', german: 'Anzug (suit)'},
      {hits: 0, misses: 0, katakana: '', german: 'Thailand, Krawatte (tie)'},
      {hits: 0, misses: 0, katakana: '', german: 'Gitarre'},
      {hits: 0, misses: 0, katakana: '', german: 'Mantel (coat)'},
      {hits: 0, misses: 0, katakana: '', german: 'Sweater'},
      {hits: 0, misses: 0, katakana: '', german: 'Test, Prüfung'},
      {hits: 0, misses: 0, katakana: '', german: 'Tür (door)'},
      {hits: 0, misses: 0, katakana: '', german: 'Deutsch(land)'},
      {hits: 0, misses: 0, katakana: '', german: 'Käse (cheese'}
    ],
    na: [
      {hits: 0, misses: 0, katakana: '', german: 'Krawatte (lange Version)'},
      {hits: 0, misses: 0, katakana: '', german: 'Messer (knife)'},
      {hits: 0, misses: 0, katakana: '', german: 'Notiz(block)'},
      {hits: 0, misses: 0, katakana: '', german: 'Bus'},
      {hits: 0, misses: 0, katakana: '', german: 'Kanada'},
      {hits: 0, misses: 0, katakana: '', german: 'Tennis'},
      {hits: 0, misses: 0, katakana: '', german: 'Bar'},
      {hits: 0, misses: 0, katakana: '', german: 'Kaffee'},
      {hits: 0, misses: 0, katakana: '', german: 'Suppe'},
      {hits: 0, misses: 0, katakana: '', german: 'Post, Postkasten'},
      {hits: 0, misses: 0, katakana: '', german: 'Supermarkt'},
      {hits: 0, misses: 0, katakana: '', german: 'Apartment, Wohnung'},
      {hits: 0, misses: 0, katakana: '', german: 'Tasse (cup)'},
      {hits: 0, misses: 0, katakana: '', german: 'Seite (page'},
      {hits: 0, misses: 0, katakana: '', german: 'Video'},
      {hits: 0, misses: 0, katakana: '', german: 'Pizza'},
      {hits: 0, misses: 0, katakana: '', german: 'Kassette (tape)'},
      {hits: 0, misses: 0, katakana: '', german: 'Kaufhaus (department store)'},
      {hits: 0, misses: 0, katakana: '', german: 'Klavier (Piano)'}
    ],
    ma: [
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''}
    ],
    ya: [
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''}
    ],
    aieo: [
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''},
      {hits: 0, misses: 0, katakana: '', german: ''}
    ]
  }

  getAll() {
    return this.getForRows(
      ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n', 'combinations', 'tsu']
    );
  }

  getForRows(rows: Array<string>) {
    let vocabs = [];
    rows.forEach(row => {
      vocabs = vocabs.concat(this.hiragana[row]);
    });
    return vocabs;
  }

}

export interface wordflashcard {
  hiragana: string;
  german: string;
  hits: number;
  misses: number;
}