const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { collection, doc, setDoc, getDoc } = require('@firebase/firestore');
const fs = require('fs');
const { setLogLevel, deleteDoc } = require('firebase/firestore')

describe('/Cards/{card} rules for firestore', () => {
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

    test('unauthenticated people should not be able to create a card', async () => {
        const nobody = env.unauthenticatedContext();
        const nobRef = collection(nobody.firestore(), 'Cards');
        const nobCardRef = doc(nobRef);
        expect(await assertFails(setDoc(nobCardRef, {})));
    });

    test('unauthenticated people should not be able to delete a card', async () => {
        // set up a card with author = '' aka public card
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'Cards');
        const aliceCardDoc = doc(aliceCardCol);
        const publicCardDoc = doc(aliceCardCol);
        await assertSucceeds(setDoc(aliceCardDoc, { author: '' }));
        await assertSucceeds(setDoc(publicCardDoc, { author: 'alice' }));

        // "login" unauthenticated and delete the cards
        const unauth = env.unauthenticatedContext();
        const unauthDocRef = doc(unauth.firestore(), `Cards/${aliceCardDoc.id}`);
        const unauthPublicDocRef = doc(unauth.firestore(), `Cards/${publicCardDoc.id}`);
        expect(await assertFails(deleteDoc(unauthDocRef)));
        expect(await assertFails(deleteDoc(unauthPublicDocRef)));
    });

    test('unauthenticated people should not be able to update a card', async () => {
        // set up a deck with author = '' aka public deck
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'Cards');
        const aliceCardDoc = doc(aliceCardCol);
        const publicCardDoc = doc(aliceCardCol);
        await assertSucceeds(setDoc(aliceCardDoc, { author: '' }));
        await assertSucceeds(setDoc(publicCardDoc, { author: 'alice' }));


        // "login" unauthenticated and read the deck
        const unauth = env.unauthenticatedContext();
        const unauthDocRef = doc(unauth.firestore(), `Cards/${aliceCardDoc.id}`);
        const unauthPublicDocRef = doc(unauth.firestore(), `Cards/${publicCardDoc.id}`);
        expect(await assertFails(setDoc(unauthDocRef, { author: 'nobody' })));
        expect(await assertFails(setDoc(unauthPublicDocRef, { author: 'nobody' })));
    });

    test('unauthenticated people should be able read public cards', async () => {
        // set up a deck with author = '' aka public card
        const alice = env.authenticatedContext('alice');
        const aliceDeckCol = collection(alice.firestore(), 'Cards');
        const aliceDeckDoc = doc(aliceDeckCol);
        await assertSucceeds(setDoc(aliceDeckDoc, { author: '' }));

        // "login" unauthenticated and read the card
        const unauth = env.unauthenticatedContext();
        const unauthDocRef = doc(unauth.firestore(), `Cards/${aliceDeckDoc.id}`);
        expect(await assertSucceeds(getDoc(unauthDocRef)));
    });

    test('unauthenticated people should not be able read private cards', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceDeckCol = collection(alice.firestore(), 'Cards');
        const aliceDeckDoc = doc(aliceDeckCol);
        await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice' }));


        // "login" unauthenticated and read the deck
        const unauth = env.unauthenticatedContext();
        const unauthDocRef = doc(unauth.firestore(), `Cards/${aliceDeckDoc.id}`);
        expect(await assertFails(getDoc(unauthDocRef)));
    });

    test('authenticated people should be able create a card', async () => {
        const nobody = env.authenticatedContext('alice');
        const nobRef = collection(nobody.firestore(), 'Cards');
        const nobDecRef = doc(nobRef);
        expect(await assertSucceeds(setDoc(nobDecRef, {})));
    });

    test('authenticated people should be able to update their cards', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceCardCol = collection(alice.firestore(), 'Cards');
        const aliceCardDoc = doc(aliceCardCol);
        await assertSucceeds(setDoc(aliceCardDoc, { author: 'alice' }));
        expect(await assertSucceeds(setDoc(aliceCardDoc, { author: 'alice', name: 'alice card', desc: 'my first card' })));
    });

    test('authenticated people should be able to delete their cards', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceDeckCol = collection(alice.firestore(), 'Cards');
        const aliceDeckDoc = doc(aliceDeckCol);
        await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice', name: 'alice card', desc: 'my first card' }));
        expect(await assertSucceeds(deleteDoc(aliceDeckDoc)));
    });

    test('authenticated people should not be able read private cards from others', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceDeckCol = collection(alice.firestore(), 'Cards');
        const aliceDeckDoc = doc(aliceDeckCol);
        await assertSucceeds(setDoc(aliceDeckDoc, { author: 'alice' }));

        // "login" unauthenticated and read the deck
        const roger = env.authenticatedContext('roger');
        const rogerDocRef = doc(roger.firestore(), `Cards/${aliceDeckDoc.id}`);
        expect(await assertFails(getDoc(rogerDocRef)));
    });

    test('authenticated people should be able to read public cards', async () => {
        // set up a deck with author = alice aka private deck
        const alice = env.authenticatedContext('alice');
        const aliceDeckCol = collection(alice.firestore(), 'Cards');
        const aliceDeckDoc = doc(aliceDeckCol);
        await assertSucceeds(setDoc(aliceDeckDoc, { author: '' }));


        // "login" authenticated and read the deck
        const roger = env.authenticatedContext('roger');
        const rogerDocRef = doc(roger.firestore(), `Cards/${aliceDeckDoc.id}`);
        expect(await assertSucceeds(getDoc(rogerDocRef)));
    });
});

