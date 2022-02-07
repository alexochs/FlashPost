const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
//const { getAnalytics } = require("firebase-admin/");

const serviceAccount = require("../serviceAccountKey.json");
const { sendFile } = require("express/lib/response");

class Database {
    #app = null;
    #analytics = null;
    #db = null;

    constructor() {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID,
          };

        this.#app = initializeApp({
            credential: cert(serviceAccount)
        });
        this.#db = getFirestore();
        //this.#analytics = getAnalytics(this.#app);
    }

    async test() {
        //await this.#db.doc("tokens/test"+Math.trunc(Math.random() * 100)).set({ data: "test" });
    }

    async write(documentPath, data) {
        await this.#db.doc(documentPath).set(data);
    }
}

const database = new Database();
module.exports = database;