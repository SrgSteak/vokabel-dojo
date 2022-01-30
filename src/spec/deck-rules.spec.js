const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { collection, doc, setDoc, getDoc } = require('@firebase/firestore');
const fs = require('fs');
const { setLogLevel, deleteDoc } = require('firebase/firestore')


//TODO: check admin role, check expectations of all tests
describe('/Decks/{deck} rules for firestore', () => {
  let env;
  beforeAll(async () => {
    setLogLevel('error'); // see https://github.com/firebase/firebase-js-sdk/issues/5872
    // set up the environment containing ruleset as described in the firestore.rules file
    env = await initializeTestEnvironment({
      projectId: "demo-project-1234",
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8')
      }
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  // remove any data from firestore
  afterEach(async () => {
    await env.clearFirestore();
  });

  test('unauthenticated people should not be able to create a deck', async () => {
    const nobody = env.unauthenticatedContext();
    const nobRef = collection(nobody.firestore(), 'Decks');
    const nobDecRef = doc(nobRef);
    expect(await assertFails(setDoc(nobDecRef, {})));
  });

  test('unauthenticated people should not be able to delete a deck', async () => {
    // set up a deck with author = '' aka public deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    const publicDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: '' }));
    await assertSucceeds(setDoc(publicDeckDoc, { author: 'alice' }));


    // "login" unauthenticated and read the deck
    const unauth = env.unauthenticatedContext();
    const unauthDocRef = doc(unauth.firestore(), `Decks/${aliceDeckDoc.id}`);
    const unauthPublicDocRef = doc(unauth.firestore(), `Decks/${publicDeckDoc.id}`);
    expect(await assertFails(deleteDoc(unauthDocRef)));
    expect(await assertFails(deleteDoc(unauthPublicDocRef)));
  });

  // TODO: unauthenticated people should not be able to update a deck
  test('unauthenticated people should not be able to delete a deck', async () => {
    // set up a deck with author = '' aka public deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    const publicDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: '' }));
    await assertSucceeds(setDoc(publicDeckDoc, { author: 'alice' }));


    // "login" unauthenticated and read the deck
    const unauth = env.unauthenticatedContext();
    const unauthDocRef = doc(unauth.firestore(), `Decks/${aliceDeckDoc.id}`);
    const unauthPublicDocRef = doc(unauth.firestore(), `Decks/${publicDeckDoc.id}`);
    expect(await assertFails(setDoc(unauthDocRef, { author: 'nobody' })));
    expect(await assertFails(setDoc(unauthPublicDocRef, { author: 'nobody' })));
  });

  test('unauthenticated people should be able read public decks', async () => {
    // set up a deck with author = '' aka public deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: '' }));


    // "login" unauthenticated and read the deck
    const unauth = env.unauthenticatedContext();
    const unauthDocRef = doc(unauth.firestore(), `Decks/${aliceDeckDoc.id}`);
    expect(await assertSucceeds(getDoc(unauthDocRef)));
  });

  test('unauthenticated people should not be able read private decks', async () => {
    // set up a deck with author = alice aka private deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice' }));


    // "login" unauthenticated and read the deck
    const unauth = env.unauthenticatedContext();
    const unauthDocRef = doc(unauth.firestore(), `Decks/${aliceDeckDoc.id}`);
    expect(await assertFails(getDoc(unauthDocRef)));
  });

  test('authenticated people should be able create a deck', async () => {
    const nobody = env.authenticatedContext('alice');
    const nobRef = collection(nobody.firestore(), 'Decks');
    const nobDecRef = doc(nobRef);
    expect(await assertSucceeds(setDoc(nobDecRef, {})));
  });

  test('authenticated people should be able to update their decks', async () => {
    // set up a deck with author = alice aka private deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice' }));
    await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice', name: 'alice deck', desc: 'my first deck' }));
  });

  test('authenticated people should be able to delete their decks', async () => {
    // set up a deck with author = alice aka private deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice', name: 'alice deck', desc: 'my first deck' }));
    await assertSucceeds(deleteDoc(aliceDeckDoc));
  });

  test('authenticated people should not be able read private decks from others', async () => {
    // set up a deck with author = alice aka private deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice' }));


    // "login" unauthenticated and read the deck
    const roger = env.authenticatedContext('roger');
    const rogerDocRef = doc(roger.firestore(), `Decks/${aliceDeckDoc.id}`);
    expect(await assertFails(getDoc(rogerDocRef)));
  });

  test('authenticated people should be able to read public decks', async () => {
    // set up a deck with author = alice aka private deck
    const alice = env.authenticatedContext('alice');
    const aliceDeckCol = collection(alice.firestore(), 'Decks');
    const aliceDeckDoc = doc(aliceDeckCol);
    await assertSucceeds(setDoc(aliceDeckDoc, { author: '' }));


    // "login" authenticated and read the deck
    const roger = env.authenticatedContext('roger');
    const rogerDocRef = doc(roger.firestore(), `Decks/${aliceDeckDoc.id}`);
    expect(await assertSucceeds(getDoc(rogerDocRef)));
  });
});

