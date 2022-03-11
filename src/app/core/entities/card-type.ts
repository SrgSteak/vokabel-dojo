export enum WordType {
  simple = '',
  noun = '0', // Substantiv / Hauptwort / Dingwort
  verb = '1', // Verb /Zeit- oder Tätigkeitswort
  adjective = '2', // Adjektiv / Eigenschafts- oder Beiwort
  adverb = '3', // Adverb / Umstands- oder Nebenwort
  pronoun = '4', // Pronomen / Fürwort
  preposition = '5', // Präposition / Verhältnis- oder Vorwort
  conjunction = '6', // Konjunktion / Bindewort
  numeral = '7', // Numerale / Zahlwort
  interjection = '8', // Interjektion / Ausrufe- oder Empfindungswort
  kanji = '9', // this card is specifically a kanji description
  suffix = '10', // ~san, hinten angehängte Elemente
  surunoun = '11', // Nomen, die auch als verb verwendet werden können (das Schwimmen, er ist schwimmen)
  sentence = '100'
}

export enum VerbType {
  unknown = 'unknown',
  single = 'single',
  ichidan = 'single',
  five = 'five',
  godan = 'five',
  suru = 'suru',
  irregular = 'irregular'
}

export enum AdjectiveType {
  unknown = 'unknown',
  iAdjective = 'iAdjective',
  naAdjective = 'naAdjective'
}

export enum CardType {
  simple, // two sided card
  word // one of the specialized WordTypes above
}

export enum VerbContext {
  unknown = 'unknown',
  transitive = '1',
  intransitive = '2'
}