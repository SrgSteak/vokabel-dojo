const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { collection, doc, setDoc, getDoc } = require('@firebase/firestore');
const fs = require('fs');
const { setLogLevel, deleteDoc } = require('firebase/firestore')


//TODO: check admin role
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
    await env.withSecurityRulesDisabled(async (context) => {
      const firestore = context.firestore();
      await assertSucceeds(setDoc(doc(firestore, 'Decks/one'), { author: 'alice' }));
      await assertSucceeds(setDoc(doc(firestore, 'Decks/two'), { author: '' }));
    }).then(async () => {
      // "login" unauthenticated and read the deck
      const unauth = env.unauthenticatedContext().firestore();
      expect(await assertFails(deleteDoc(doc(unauth, `Decks/one`))));
      expect(await assertFails(deleteDoc(doc(unauth, `Decks/two`))));
    });
  });

  test('unauthenticated people should not be able to update a deck', async () => {
    await env.withSecurityRulesDisabled(async context => {
      // set up a deck with author = '' aka public deck and a private one
      const firestore = context.firestore();
      await setDoc(doc(firestore, 'Decks/new'), { name: 'public deck', author: '' });
      await setDoc(doc(firestore, 'Decks/new2'), { name: 'private deck', author: 'alice' });
    }).then(async () => {
      const nobodRef = env.unauthenticatedContext().firestore();
      // try to update both
      expect(await assertFails(setDoc(doc(nobodRef, 'Decks/new'), { author: 'nobody' })));
      expect(await assertFails(setDoc(doc(nobodRef, 'Decks/new2'), { author: 'nobody' })));
    });
  });

  test('unauthenticated people should be able read public decks', async () => {
    await env.withSecurityRulesDisabled(async context => {
      // set up a deck with author = '' aka public deck
      await setDoc(doc(context.firestore(), 'Decks/new'), { name: 'public deck', author: '' });
    }).then(async () => {
      const nobodRef = env.unauthenticatedContext();
      expect(await assertSucceeds(getDoc(doc(nobodRef.firestore(), 'Decks/new'))));
    });
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
    // set up a deck with author = alice aka private deck
    await env.withSecurityRulesDisabled(async context => {
      // create user alice
      await setDoc(doc(context.firestore(), 'users/alice'), { name: 'alice', role: 'user' });
    }).then(async () => {
      const aliceRef = env.authenticatedContext('alice');
      expect(await assertSucceeds(setDoc(doc(aliceRef.firestore(), 'Decks/new'), { author: 'alice' })));
    });
  });

  test('authenticated people should not be able create a public deck', async () => {
    // set up a deck with author = alice aka private deck
    await env.withSecurityRulesDisabled(async context => {
      // create user alice
      await setDoc(doc(context.firestore(), 'users/alice'), { name: 'alice', role: 'user' });
    }).then(async () => {
      const aliceRef = env.authenticatedContext('alice');
      expect(await assertFails(setDoc(doc(aliceRef.firestore(), 'Decks/new'), { author: '' })));
    });
  });

  test('authenticated people should be able to update their decks', async () => {
    // set up a deck with author = alice aka private deck
    await env.withSecurityRulesDisabled(async context => {
      // create user alice
      const firestore = context.firestore();
      await setDoc(doc(firestore, 'users/alice'), { name: 'alice', role: 'user' });

      // give her a deck
      await setDoc(doc(firestore, 'Decks/aliceDeck'), { author: 'alice', name: 'alice deck', desc: 'my first deck' });
    }).then(async () => {
      const alice = env.authenticatedContext('alice');
      expect(await assertSucceeds(
        setDoc(
          doc(alice.firestore(), 'Decks/aliceDeck'),
          { author: 'alice', name: 'new name', desc: 'my firt desck updated' }
        )
      ));
    });
  });

  test('authenticated people should not be able to update their decks to be public', async () => {
    // set up a deck with author = alice aka private deck
    await env.withSecurityRulesDisabled(async context => {
      // create user alice
      const firestore = context.firestore();
      await setDoc(doc(firestore, 'users/alice'), { name: 'alice', role: 'user' });

      // give her a deck
      await setDoc(doc(firestore, 'Decks/aliceDeck'), { author: 'alice', name: 'alice deck', desc: 'my first deck' });
    }).then(async () => {
      const alice = env.authenticatedContext('alice');
      expect(await assertFails(
        setDoc(
          doc(alice.firestore(), 'Decks/aliceDeck'),
          { author: '', name: 'new name', desc: 'my firt desck updated' }
        )
      ));
    });
  });

  test('authenticated people should be able to delete their decks', async () => {
    // set up a deck with author = alice aka private deck
    await env.withSecurityRulesDisabled(async context => {
      // create user alice
      const firestore = context.firestore();
      await setDoc(doc(firestore, 'users/alice'), { name: 'alice', role: 'user' });

      // give her a deck
      await setDoc(doc(firestore, 'Decks/aliceDeck'), { author: 'alice', name: 'alice deck', desc: 'my first deck' });
    }).then(async () => {
      const alice = env.authenticatedContext('alice');
      const madoc = doc(alice.firestore(), 'Decks/aliceDeck');
      expect(await assertSucceeds(deleteDoc(madoc)));
    });
  });

  /**
   * roger is not allowed to read alice's deck
   */
  test('authenticated people should not be able read private decks from others', async () => {
    let aliceDeckDoc;
    await env.withSecurityRulesDisabled(async context => {
      const firestore = context.firestore();
      const userCol = collection(firestore, 'users');
      await setDoc(doc(userCol, 'alice'), { name: 'alice', role: 'user' });
      await setDoc(doc(userCol, 'roger'), { name: 'roger', role: 'user' });
      const aliceDeckCol = collection(firestore, 'Decks');
      aliceDeckDoc = doc(aliceDeckCol);
      await setDoc(aliceDeckDoc, { author: 'alice' });
    }).then(async () => {
      // "login" authenticated and read the deck
      const roger = env.authenticatedContext('roger');
      const rogerDocRef = doc(roger.firestore(), `Decks/${aliceDeckDoc.id}`);
      expect(await assertFails(getDoc(rogerDocRef)));
    });
  });

  test('authenticated people should be able to read public decks', async () => {
    let publicDeckDoc;
    await env.withSecurityRulesDisabled(async context => {
      const aliceDeckCol = collection(context.firestore(), 'Decks');
      publicDeckDoc = doc(aliceDeckCol);
      await assertSucceeds(setDoc(publicDeckDoc, { author: '' }));
    }).then(async () => {
      // "login" authenticated and read the deck
      const roger = env.authenticatedContext('roger');
      const rogerDocRef = doc(roger.firestore(), `Decks/${publicDeckDoc.id}`);
      expect(await assertSucceeds(getDoc(rogerDocRef)));
    });
  });

  test('admin role allows to write public deck', async () => {
    await env.withSecurityRulesDisabled(async context => {
      const userCol = collection(context.firestore(), 'users');
      await setDoc(doc(userCol, 'alice'), { name: 'alice', role: 'admin' })
    }).then(async () => {
      const alice = env.authenticatedContext('alice');
      const aliceDeckCol = collection(alice.firestore(), 'Decks');
      const aliceDeckDoc = doc(aliceDeckCol);
      expect(await assertSucceeds(setDoc(aliceDeckDoc, { author: '' })));
    });
  })
});

