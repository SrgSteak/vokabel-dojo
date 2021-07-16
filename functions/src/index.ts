import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const onUserDelete = functions.firestore.document('/users/{documentId}').onDelete((snapshot, context) => {
  const uid = context.params.documentId; // the user uid
  // const promises: Array<Promise<any>> = [];
  return Promise.all([
    admin.firestore().collection('Decks').where('author', '==', uid).get().then(decksSnapshot => {
      decksSnapshot.forEach(deckSnapshot => {
        console.log('would now delete deck uid: ' + deckSnapshot.id);
        // promises.push(admin.firestore().collection('Decks').doc(deckSnapshot.id).delete());
      });

    }),
    admin.firestore().collection('Cards').where('author', '==', uid).get().then(cardsSnapshot => {
      cardsSnapshot.forEach(cardSnapshot => {
        console.log('would now delete card uid: ' + cardSnapshot.id);
        // promises.push(admin.firestore().collection('Cards').doc(cardSnapshot.id).delete());
      })
    })
  ]);
});

export const onDeckDelete = functions.firestore.document('/Decks/{documentId}').onDelete((snapshot, context) => {
  console.log(`Starting onDeckDelete function`);
  const uid = context.params.documentId; // the Deck uid
  console.log(`onDeckDelete function with Deck ${uid}`);
  return admin.firestore().collection('Cards').where('deck_uids', 'array-contains', uid).get()
    .then(cardsSnapshot => {
      const promises: Array<Promise<any>> = [];
      cardsSnapshot.forEach(cardSnapshot => {
        const card = cardSnapshot.data();
        console.log(`Updating card at ${cardSnapshot.ref.path}`);
        let deck_uids = card.deck_uids as Array<string>;
        if (deck_uids) {
          deck_uids = deck_uids.filter(deck_uid => deck_uid !== uid);
        }
        card.deck_uids = deck_uids;
        const p = cardSnapshot.ref.update(card);
        promises.push(p);
      });
      return Promise.all(promises);
    })
})

// update numberCards counter on decks when a new card is created (and stored to the db)
// exports.onCardCreate = functions.firestore.document('/Cards/{documentId}').onCreate((snapshot, context) => {
//   const promises: Array<Promise<any>> = [];
//   if (snapshot.data().deck_uids && snapshot.data().deck_uids.length) { // check if card has decks
//     snapshot.data().deck_uids.forEach((deck_uid: string) => {
//       console.log(`checking decks for deck_uid ${deck_uid}`);
//       admin.firestore().collection('Decks').doc(deck_uid).get().then(deckSnapshot => {
//         console.log(`loading number cards for deck_uid ${deckSnapshot.id}`);
//         admin.firestore().collection('Cards').where('deck_uids', 'array-contains', deckSnapshot.id).get().then(cards => {
//           console.log(`setting number cards to ${cards.docs.length}`);
//           const deck = deckSnapshot.data();
//           deck.numberCards = cards.docs.length;
//           const p = deckSnapshot.ref.update(deck);
//           console.log(`pushing deck ${deckSnapshot.id} update to promises`);
//           promises.push(p);
//         })
//       })
//     })
//   }
//   return Promise.all(promises);
// });

// export const onDeckUpdate = functions.database.ref('Decks/{documentId').onUpdate((snapshot, context) => {
//   // Grab the current value of what was written to Cloud Firestore.
//   const original = snapshot.after.val();

//   // Access the parameter `{documentId}` with `context.params`
//   console.log('trimming', context.params.documentId, original);

//   const uppercase = original.name.trim();

//   // You must return a Promise when performing asynchronous tasks inside a Functions such as
//   // writing to Cloud Firestore.
//   // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
//   return snapshot.after.ref.set({ uppercase });
// });

export const onDeckCreate = functions.firestore.document('/Decks/{documentId}').onCreate((snapshot, context) => {
  // Grab the current value of what was written to Cloud Firestore.
  const original = snapshot.data();

  // Access the parameter `{documentId}` with `context.params`
  console.log('trimming on create', context.params.documentId, original);

  original.name = original.name.trim();
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to Cloud Firestore.
  // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
  return snapshot.ref.set(original);
});
