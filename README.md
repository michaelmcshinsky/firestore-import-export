# 🔥 Firestore Import Export 🔥

A minimal toolkit for seeding, importing, and exporting firestore data as JSON files.

#### **WARNING**
Any read or write to firebase's services count against your free or paid tier limit. You probably will not hit anywhere near your limits during tests, but be sure to test with small data sets before committing to a full data import or export based on your desired data content needs and size.

## Installation

```
1. git clone https://github.com/michaelmcshinsky/firestore-import-export.git

2. cd firestore-import-export

3. yarn install
```

## Configuration

#### constants.js
1. Navigate to the firebase console for your firbase app.
2. Go to your Project Settings page.
3. Scroll to Your Apps and copy the `databaseUrl` value in the configuration object. It should look similar to: `https://<db-url>.firebaseio.com`.
4. Copy the value into the `constants.example.js` file for the `databaseUrl` key.
5. Rename `constants.example.json` to `constants.json`.
  
#### service_key.json
1. Navigate to the firebase console for your firbase app.
2. Go to your Project Settings page and click on the Service Accounts tab.
3. Click on the Generate New Private Key button. This will download a JSON file with your key information.
4. Copy this information into the `service_key.example.json` file provided in the repo.
5. Rename `service_key.example.json` to `service_key.json`.

## Import / Upload

The import tool will take all of your JSON files from the `uploads` folder and create collections using the file name and array data.

If you do not provide IDs, a second write operation will occur and set the `docRef.id` as the `id` of the document.

To run the importer, do the following:


1. Add any JSON files to the `uploads` folder. It should be formatted as an array of objects.
2. Run the command: `yarn upload`
3. Feel like a winner because you didn't hand write out documents in the firebase console!

## Export / Download


To run the exporter, do the following:

#### Option 1:
```
yarn download
```

**NOTE:** Running `yarn download` will export every collection in your firestore.

If you wish to export specific collections, modify `download.js` to take an array of names instead of querying the firstore for all collections.

#### Option 2:

Passing arguments after `yarn download` will skip querying for all firestore collections and instead only download collections you name in the terminal.
````
yarn download <collectionName1> <collectionName2>
````
