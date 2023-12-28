import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GrammarInterface, grammarConverter } from './entities/grammar';
import { DescriptionType } from "./entities/DescriptionType";
import { ExerciseType } from "./entities/ExerciseType";
import { DocumentReference, Firestore, collection, collectionData, deleteDoc, doc, orderBy, query, setDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  private ref = collection(this.afs, 'Grammar');

  // private grammarPoints: GrammarInterface[] = [
  //   {
  //     uid: '123',
  //     title: '「は」 das Satzthemen Partikel',
  //     slug: 'ha-partikel',
  //     online: true,
  //     description: [
  //       {
  //         type: DescriptionType.paragraph,
  //         text: 'Das Satzthema lässt sich mit dem Partikel 「は」 nach dem Subjekt bilden und gibt an, worum es bei diesem Satz geht.'
  //       },
  //       {
  //         type: DescriptionType.info,
  //         text: 'これ = das bei mir, それ = das bei dir, あれ = das dort drüben'
  //       },
  //       {
  //         type: DescriptionType.paragraph,
  //         text: 'In Kombination mit "Nomen + です。" lassen sich damit bereits einfache Sätze bilden. Verbindest du "Nomen + ですか。" Kannst du sogar schon eine Frage stellen!'
  //       }
  //     ],
  //     sections: [
  //       {
  //         explanation: 'A entspricht B.',
  //         grammarpoints:[
  //         {
  //           text: 'A',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: '私', reading: 'わたし'},
  //             {japanese: '私', reading: 'わたし'},
  //             {japanese: 'あの人', reading: '**ひと'},
  //             {japanese: 'シンさん', reading: ''},
  //             {japanese: 'サリさん', reading: ''}
  //           ]
  //         },
  //         {
  //           text: 'は',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         },
  //         {
  //           text: 'B',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: 'ブラウン', reading: ''},
  //             {japanese: '学生', reading: 'がく*せい'},
  //             {japanese: 'シンさん', reading: ''},
  //             {japanese: '韓国人', reading: 'かん*こく*じん'},
  //             {japanese: '23歳', reading: 'にじゅう*さん*さい'}
  //           ]
  //         },
  //         {
  //           text: 'です。',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         }],
  //       },

  //       {
  //         explanation: 'Ist A gleich B?',
  //         grammarpoints:[
  //         {
  //           text: 'A',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: 'あの人', reading: '**ひと'},
  //             {japanese: 'ブラウンさん', reading: ''},
  //             {japanese: 'サリさん', reading: ''},
  //             {japanese: 'あなた', reading: ''},
  //             {japanese: 'あの人', reading: '**ひと'}
  //           ]
  //         },
  //         {
  //           text: 'は',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         },
  //         {
  //           text: 'B',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: 'シンさん', reading: ''},
  //             {japanese: 'アメリカ人', reading: '****じん'},
  //             {japanese: 'Cクラスの学生', reading: '*****がく*せい'},
  //             {japanese: '事務の人', reading: 'じ*む**ひと'},
  //             {japanese: '日本語の先生', reading: 'に*ほん*ご**せん*せい'}
  //           ]
  //         },
  //         {
  //           text: 'ですか。',
  //           highlight: {from: 2, to: 2, type: 'circle' },
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         }],
  //       },

  //       {
  //         explanation: 'A ist nicht gleich B.',
  //         grammarpoints:[
  //         {
  //           text: 'A',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: '私', reading: 'わたし'},
  //             {japanese: 'シンさん', reading: ''},
  //             {japanese: 'あの人', reading: '**ひと'},
  //             {japanese: 'サリさん', reading: ''},
  //             {japanese: 'Cクラスの先生', reading: '*****せん*せい'},
  //           ]
  //         },
  //         {
  //           text: 'は',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         },
  //         {
  //           text: 'B',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: '日本人', reading: 'に*ほん*じん'},
  //             {japanese: '学生', reading: 'がく*せい'},
  //             {japanese: '事務の人', reading: 'じ*む**ひと'},
  //             {japanese: 'アメリカの学生', reading: '*****がく*せい'},
  //             {japanese: '男の先生', reading: 'おとこ**せん*せい'}
  //           ]
  //         },
  //         {
  //           text: 'ではありません。',
  //           highlight: null,
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         }],
  //       },

  //       {
  //         explanation: 'Das (das hier bei mir, das bei dir, das dort drüben) ist B',
  //         grammarpoints:[
  //         {
  //           text: 'A',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: 'これ', reading: ''},
  //             {japanese: 'それ', reading: ''},
  //             {japanese: 'あれ', reading: ''},
  //           ]
  //         },
  //         {
  //           text: 'は',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         },
  //         {
  //           text: 'B',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: '教科書', reading: 'きょう*か*しょ'},
  //             {japanese: 'あなたの本', reading: '****ほん'},
  //             {japanese: '先生の本', reading: 'せん*せい**ほん'},
  //           ]
  //         },
  //         {
  //           text: 'です。',
  //           highlight: null,
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: []
  //         }
  //       ],
  //       exercises: [
  //         {
  //           type: ExerciseType.transform,
  //           instruction: ['Bilde die verneinte Vergangenheit von ', { japanese: '食べる', reading: 'た**'}],
  //           given: [
  //             {japanese: 'ろ', reading: ''},
  //             {japanese: 'た', reading: ''},
  //             {japanese: 'て', reading: ''},
  //             {japanese: 'る', reading: ''}
  //           ],
  //           result: [{japanese:'食べなかった', reading: 'た*****'}], // 食べなかった
  //           // resultHint: '食べなかった hat nicht gegessen' <- next up!
  //         },
  //         {
  //           type: ExerciseType.select,
  //           instruction: [{japanese: 'これ', reading: ''}, null, {japanese: '私の本です。', reading: 'わたし*ほん****'}],
  //           given: [
  //             {japanese: 'を', reading: ''},
  //             {japanese: 'の', reading: ''},
  //             {japanese: 'へ', reading: ''},
  //           ],
  //           result: [{japanese: 'は', reading: ''}]
  //         },
  //         {
  //           type: ExerciseType.buildingblock,
  //           instruction: 'Das dort drüben ist ein Lehrbuch',
  //           given: [
  //             { japanese: '先生の本', reading: 'せん*せい**ほん'},
  //             { japanese: 'あなたの本', reading: '****ほん'},
  //             { japanese: '事務', reading: 'じ*む'},
  //             { japanese: 'どれ', reading: ''}
  //           ],
  //           result: [
  //             { japanese: 'これ', reading: 'ko*re'},
  //             { japanese: 'は', reading: 'ha'},
  //             { japanese: '教科書', reading: 'きょう*か*しょ'},
  //             { japanese: 'です', reading: 'de*su'}
  //           ]
  //         },
  //       ],
  //     },
  //   ],
  //     // related: [
  //     //   // slugs for other grammar points
  //     // ]
  //   },
  //   {
  //     uid: '456',
  //     online: true,
  //     title: 'Fragen und Antworten mit「は」 dem Satzthemen Partikel',
  //     slug: 'fragen-und-antworten-mit-ha-partikel',
  //     description: [{ type: DescriptionType.paragraph, text: '"Dies" als これ/それ/あれ in kombination mit dem Fragepartikel 「か」'}],
  //     sections: [
  //       {
  //         explanation: 'A (Das hier bei mir/bei dir/dort) ist B.',
  //         grammarpoints:[
  //         {
  //           text: 'A',
  //           options: ['これ','それ','あれ'],
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [
  //             {japanese: 'これ', reading: ''},
  //             {japanese: 'それ', reading: ''},
  //             {japanese: 'あれ', reading: ''},
  //           ]
  //         },
  //         {
  //           text: 'は',
  //           highlight: null, // {from: 0, to: 0},
  //           placeholders: []
  //         },
  //         {
  //           text: 'B',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [

  //             {japanese: '教科書', reading: 'きょう*か*しょ'},
  //             {japanese: 'あなたの本', reading: '****ほん'},
  //             {japanese: '先生の本', reading: 'せん*せい**ほん'},

  //           ]
  //         },
  //         {
  //           text: 'です。',
  //           highlight: null, // {from: 0, to: 0},
  //           strikethrough: null, // {from: 0, to: 0},
  //           placeholders: [

  //             {japanese: 'です。', reading: ''},
  //             {japanese: 'ですか。', reading: '', highlight: { from: 2, to: 2, type: 'circle'}},
  //             {japanese: 'です。', reading: ''},

  //           ]
  //         }],
  //         // translations: [
  //         //   'Das (bei mir) ist ein Wörterbuch.',
  //         //   'Ist das (bei dir) dein Buch?',
  //         //   'Das (dort) ist das Buch des Lehrers.'
  //         // ]
  //       }
  //     ]
  //   }
  // ]


  constructor(private readonly afs: Firestore) { }

  get(slug: string): Observable<GrammarInterface[]> {
    const q = query(this.ref, where('slug', '==', slug), where('online', '==', true), orderBy('updatedAt', 'desc')).withConverter(grammarConverter)
    return collectionData(q, { idField: 'uid' }) as Observable<GrammarInterface[]>;
  }

  all(): Observable<GrammarInterface[]> {
    const q = query(this.ref, where('online', '==', true), orderBy('createdAt', 'desc')).withConverter(grammarConverter);
    return collectionData(q, { idField: 'uid' }) as Observable<GrammarInterface[]>;
  }

  write(grammar: GrammarInterface): Promise<GrammarInterface> {
    return new Promise((resolve, reject) => {
      const now = new Date();
      grammar.createdAt = now;
      grammar.updatedAt = now;
      // save and keep slug so that links will work in the future as well
      grammar.slug = grammar.title.trim().toLocaleLowerCase().replace(' ', '-');
      const ref = grammar.uid ? doc(this.ref, grammar.uid): doc(this.ref);
      setDoc(ref, grammar, { merge: true}).then(() => {
        grammar.uid = ref.id;
        resolve(grammar);
      }, (error) => {
        console.error('could not update Grammar!', grammar);
        console.error(error);
        reject(error)
      })
    })
  }

  delete(id: string) {
    return deleteDoc(doc(this.ref, id));
  }
}
