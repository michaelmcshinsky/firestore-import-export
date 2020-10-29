const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const constants = require('./constants');
const serviceKey = require('./service_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceKey),
  databaseURL: constants.databaseUrl,
});

const firestore = admin.firestore();
const uploadPath = path.join(__dirname, 'uploads');

function _addDoc(name, data) {
  return firestore.collection(name).add(data);
}

function _updateDoc(name, id, data) {
  return firestore.collection(name).doc(`${id}`).set(data);
}

function uploadJSONfiles() {
  fs.readdir(uploadPath, function (err, files) {
    if (err) {
      return console.log('No JSON files found to upload: ' + err);
    }

    files.forEach(function (file) {
      const fileIndex = file.lastIndexOf('.');
      const jsonData = require('./uploads/' + file);

      jsonData.forEach(function (obj, index) {
        const name = file.substring(0, fileIndex);

        if (obj.id) {
          _updateDoc(name, obj.id, obj)
            .then(function () {
              console.log('Document added/updated. ID: ' + obj.id);
            })
            .catch(function (error) {
              console.error('Unable to update document: ', error);
            });
        } else {
          _addDoc(name, obj)
            .then(function (docRef) {
              console.log('Document added. ID: ' + docRef.id);
              if (!obj.id) {
                _updateDoc(name, docRef.id, { ...obj, id: index + 1 })
                  .then(function (docRef) {
                    console.log('Document updated. ID: ' + docRef.id);
                  })
                  .catch(function (error) {
                    console.error('Unable to update document: ', error);
                  });
              }
            })
            .catch(function (error) {
              console.error('Unable to add document: ', error);
            });
        }
      });
    });
  });
}

uploadJSONfiles();
