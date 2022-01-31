const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { collection, doc, setDoc, getDoc } = require('@firebase/firestore');
const fs = require('fs');
const { setLogLevel, deleteDoc } = require('firebase/firestore')

// todo: check admin role
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
        await env.withSecurityRulesDisabled(async context => {
            // create a public card alice
            const firestore = context.firestore();
            await setDoc(doc(firestore, 'Cards/new'), { author: '' });
            await setDoc(doc(firestore, 'Cards/new2'), { author: 'alice' });
        }).then(async () => {
            // "login" unauthenticated and read the card
            const unauth = env.unauthenticatedContext().firestore();
            expect(await assertFails(deleteDoc(doc(unauth, `Cards/new`))));
            expect(await assertFails(deleteDoc(doc(unauth, `Cards/new2`))));
        });
    });

    test('unauthenticated people should not be able to update a card', async () => {
        await env.withSecurityRulesDisabled(async context => {
            // create a public card alice
            const firestore = context.firestore();
            await setDoc(doc(firestore, 'Cards/new'), { author: '' });
            await setDoc(doc(firestore, 'Cards/new2'), { author: 'alice' });
        }).then(async () => {
            // "login" unauthenticated and read the card
            const unauth = env.unauthenticatedContext().firestore();
            expect(await assertFails(setDoc(doc(unauth, `Cards/new`), { author: 'nobody' })));
            expect(await assertFails(setDoc(doc(unauth, `Cards/new2`), { author: 'nobody' })));
        });
    });

    test('unauthenticated people should be able read public cards', async () => {
        await env.withSecurityRulesDisabled(async context => {
            // create a public card
            await setDoc(doc(context.firestore(), 'Cards/new'), { author: '' });
        }).then(async () => {
            // "login" unauthenticated and read the card
            const unauth = env.unauthenticatedContext();
            const unauthDocRef = doc(unauth.firestore(), `Cards/new`);
            expect(await assertSucceeds(getDoc(unauthDocRef)));
        });
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
        expect(await assertSucceeds(setDoc(nobDecRef, { author: 'alice' })));
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
        await env.withSecurityRulesDisabled(async context => {
            // create a public card alice
            await setDoc(doc(context.firestore(), 'Cards/new'), { author: '' });
        }).then(async () => {
            // "login" authenticated and read the deck
            const roger = env.authenticatedContext('roger');
            const rogerDocRef = doc(roger.firestore(), `Cards/new`);
            expect(await assertSucceeds(getDoc(rogerDocRef)));
        });
    });
});

