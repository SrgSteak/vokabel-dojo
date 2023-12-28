import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { DescriptionType } from "./DescriptionType";
import { OnyomiJapanese } from "./OnyomiJapanese";
import { ExerciseInterface } from "./exercise-interface";

export interface GrammarInterface {
  title: string;
  slug: string;
  description: {
    type: DescriptionType;
    text: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
  online: boolean;
  uid: string;
  sections: {
    explanation: string;
    grammarpoints: {
      text: string;
      options?: string[];
      highlight?: any;
      strikethrough?: any;
      placeholders?: OnyomiJapanese[];
      translations?: string[];
    }[]
    exercises?: Array<ExerciseInterface>;
  }[];
}

export const grammarConverter = {
  toFirestore(grammar: GrammarInterface): DocumentData {
      return grammar;
  },

  fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
  ): GrammarInterface {
      const data = snapshot.data(options)! as GrammarInterface
      data.uid = snapshot.id
      return data;
  }
}
