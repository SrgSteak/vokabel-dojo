import { ExerciseType } from "./ExerciseType";
import { OnyomiJapanese } from "./OnyomiJapanese";

export interface ExerciseInterface {
    type: ExerciseType;
    instruction: string | Array<OnyomiJapanese | string | null>;
    given: OnyomiJapanese[];
    result: OnyomiJapanese[];
    resultHint?: string;
  }