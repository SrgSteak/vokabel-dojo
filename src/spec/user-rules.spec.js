const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { collection, doc, setDoc, getDoc } = require('@firebase/firestore');
const fs = require('fs');
const { setLogLevel, deleteDoc } = require('firebase/firestore')

describe('/users/{userId} rules for firestore', () => {
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

    test('unauthenticated people should not be able to create a user', async () => {
        const nobody = env.unauthenticatedContext();
        const nobRef = collection(nobody.firestore(), 'users');
        const nobCardRef = doc(nobRef);
        expect(await assertFails(setDoc(nobCardRef, {})));
    });

    test('unauthenticated people should not be able to delete a user', async () => {
        // set up a card with author = '' aka public card
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'users');
        const aliceCardDoc = doc(aliceCardCol, 'alice');
        await assertSucceeds(setDoc(aliceCardDoc, { name: 'alice', email: 'a@a.a' }));

        // "login" unauthenticated and delete the cards
        const unauth = env.unauthenticatedContext();
        const unauthDocRef = doc(unauth.firestore(), `users/${aliceCardDoc.id}`);
        expect(await assertFails(deleteDoc(unauthDocRef)));
    });

    test('unauthenticated people should not be able to update a user', async () => {
        // set up a deck with author = '' aka public deck
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'users');
        const aliceCardDoc = doc(aliceCardCol, 'alice');
        await assertSucceeds(setDoc(aliceCardDoc, { name: 'alice', role: 'user' }));


        // "login" unauthenticated and read the deck
        const unauth = env.unauthenticatedContext();
        const unauthDocRef = doc(unauth.firestore(), `users/${aliceCardDoc.id}`);
        expect(await assertFails(setDoc(unauthDocRef, { name: 'nobody', role: 'user' })));
    });

    test('unauthenticated people should not be able to read a user', async () => {
        // set up a deck with author = '' aka public deck
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'users');
        const aliceCardDoc = doc(aliceCardCol, 'alice');
        await assertSucceeds(setDoc(aliceCardDoc, { name: 'alice' }));


        // "login" unauthenticated and read the deck
        const unauth = env.unauthenticatedContext();
        const unauthDocRef = doc(unauth.firestore(), `users/${aliceCardDoc.id}`);
        expect(await assertFails(getDoc(unauthDocRef)));
    });

    test('authenticated people should be able create one user for themselves', async () => {
        const nobody = env.authenticatedContext('alice');
        const nobRef = collection(nobody.firestore(), 'users');
        const nobDecRef = doc(nobRef, 'alice');
        expect(await assertSucceeds(setDoc(nobDecRef, {})));

        const otherDecRef = doc(nobRef, 'somebodyelse');
        expect(await assertFails(setDoc(otherDecRef, { name: 'mysecondAccount' })));
    });

    test('authenticated people should be able to update their user data', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'users');
        const aliceCardDoc = doc(aliceCardCol, 'alice');
        await assertSucceeds(setDoc(aliceCardDoc, { author: 'alice' }));
        expect(await assertSucceeds(setDoc(aliceCardDoc, { name: 'alice card', email: 'a@a.a', role: 'user', settings: { font: 'arial' } })));
    });

    test('authenticated people should not be able to update their user role', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'users');
        const aliceCardDoc = doc(aliceCardCol, 'alice');
        await assertSucceeds(setDoc(aliceCardDoc, { author: 'alice' }));
        expect(await assertFails(setDoc(aliceCardDoc, { name: 'alice card', email: 'a@a.a', role: 'admin', settings: { font: 'arial' } })));
    });

    test('authenticated people should be able to delete their user data', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceDeckCol = collection(alice.firestore(), 'users');
        const aliceDeckDoc = doc(aliceDeckCol, 'alice');
        await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice', name: 'alice card', desc: 'my first card' }));
        expect(await assertSucceeds(deleteDoc(aliceDeckDoc)));
    });

    test('authenticated people should not be able read user data from others', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceDeckCol = collection(alice.firestore(), 'users');
        const aliceDeckDoc = doc(aliceDeckCol, 'alice');
        await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice' }));

        // "login" unauthenticated and read the deck
        const roger = env.authenticatedContext('roger');
        const rogerDocRef = doc(roger.firestore(), `users/${aliceDeckDoc.id}`);
        expect(await assertFails(getDoc(rogerDocRef)));
    });
});

