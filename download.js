const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const constants = require('./constants');
const serviceKey = require('./service_key.json');

const args = process.argv.slice(2);

admin.initializeApp({
  credential: admin.credential.cert(serviceKey),
  databaseURL: constants.databaseUrl,
});

const firestore = admin.firestore();

async function exportCollections() {
  let collections = [];

  if (args.length > 0) {
    collections = args.map((name) => ({
      path: name,
    }));
  } else {
    collections = await firestore.listCollections();
  }

  collections.forEach(async (collection) => {
    const { path: name } = collection;
    const queryShapshot = await firestore.collection(name).get();

    const docs = queryShapshot.docs.map((doc) => {
      const model = doc.data();
      if (!model.id) {
        model.id = doc.id;
      }
      return model;
    });

    const data = JSON.stringify(docs, null, 2);

    const downloadPath = path.join(__dirname, '/downloads/' + name + '.json');

    fs.writeFile(downloadPath, data, (err) => {
      if (err) {
        throw err;
      }

      console.log('JSON data is saved to: ' + downloadPath);
    });
  });
}

exportCollections();
