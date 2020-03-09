export enum WordType {
  noun = '0', // Substantiv / Hauptwort / Dingwort
  verb = '1', // Verb /Zeit- oder Tätigkeitswort
  adjective = '2', // Adjektiv / Eigenschafts- oder Beiwort
  adverb = '3', // Adverb / Umstands- oder Nebenwort
  pronoun = '4', // Pronomen / Fürwort
  preposition = '5', // Präposition / Verhältnis- oder Vorwort
  conjunction = '6', // Konjunktion / Bindewort
  numeral = '7', // Numerale / Zahlwort
  interjection = '8' // Interjektion / Ausrufe- oder Empfindungswort
}

export enum VerbType {
  single = 'single',
  five = 'five'
}

export enum AdjectiveType {
  iAdjective = 'iAdjective',
  naAdjective = 'naAdjective'
}

export enum CardType {
  simple, // two sided card
  word // one of the specialized WordTypes above
}