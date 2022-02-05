import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "firebase/firestore";

export interface DeckInterface {
    name: string;
    description: string;
    uid: string;
    userCount?: number;
    cardCount?: number;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    author: string;
    numberCards: number;
}

export const deckConverter = {
    toFirestore(deck: DeckInterface): DocumentData {
        return deck;
    },

    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): DeckInterface {
        // snapshot.id
        const data = snapshot.data(options)! as DeckInterface
        data.uid = snapshot.id
        return data;
    }
}