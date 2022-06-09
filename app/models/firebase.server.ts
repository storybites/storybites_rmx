import { Storage } from "@google-cloud/storage";
import type { UploadHandler } from "@remix-run/node";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function getStorages() {
    const { FIREBASE_CONFIG, SERVICE_ACCOUNT } = getCreds();

    const app = initializeApp(FIREBASE_CONFIG);
    const readStorage = getStorage(app);

    const uploadStorage = new Storage({
        credentials: SERVICE_ACCOUNT,
    });

    return {
        readStorage,
        uploadStorage,
    };
}

export async function uploadFileV2(data: Buffer, fileName: string, folder: string) {
    const { FIREBASE_CONFIG } = getCreds();

    try {
        const { uploadStorage } = getStorages();
        const file = uploadStorage.bucket(FIREBASE_CONFIG.storageBucket).file(`${folder}/${fileName}`);
        await file.save(data, {
            gzip: true,
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: uuidv4(),
                },
            },
        });
        return fileName;
    } catch (e: any) {
        console.error(`failed to upload file ${fileName}`, e.message);
        return "";
    }
}

export const cloudStorageUploaderHandler: UploadHandler = async ({ data, filename, name }) => {
    if (!filename) {
        return name;
    }

    const chunks = [];
    for await (const chunk of data) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return await uploadFileV2(buffer, filename, name === "image" ? "photos" : "audio");
};

export async function getImageUrl(name: string) {
    const { readStorage } = getStorages();

    const imageRef = ref(readStorage, `photos/${name}`);
    const url = await getDownloadURL(imageRef);
    return url;
}

export async function getAudioUrl(name: string) {
    const { readStorage } = getStorages();

    const imageRef = ref(readStorage, `audio/${name}`);
    const url = await getDownloadURL(imageRef);
    return url;
}

function getCreds() {
    // const projectId = process.env.PROJECT_ID;
    // const FIREBASE_CONFIG = {
    //     apiKey: process.env.API_KEY,
    //     authDomain: `${projectId}.firebaseapp.com`,
    //     projectId,
    //     storageBucket: `${projectId}.appspot.com`,
    //     messagingSenderId: process.env.MESSAGING_SENDER_ID,
    //     appId: process.env.APP_ID,
    //     measurementId: process.env.MEASUREMENT_ID,
    // };

    // const SERVICE_ACCOUNT = {
    //     type: "service_account",
    //     project_id: projectId,
    //     private_key_id: process.env.PRIVATE_KEY_ID,
    //     private_key: process.env.PRIVATE_KEY,
    //     client_email: process.env.CLIENT_EMAIL,
    //     client_id: process.env.CLIENT_ID,
    //     auth_uri: "https://accounts.google.com/o/oauth2/auth",
    //     token_uri: "https://oauth2.googleapis.com/token",
    //     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    //     client_x509_cert_url:
    //         "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rzh6t%40storybites-qa.iam.gserviceaccount.com",
    // };

    console.log(process.env.FIREBASE_CONFIG);
    console.log(typeof process.env.FIREBASE_CONFIG);
    console.log(process.env.SERVICE_ACCOUNT);
    console.log(typeof process.env.SERVICE_ACCOUNT);

    return {
        FIREBASE_CONFIG: process.env.FIREBASE_CONFIG ?? {},
        SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT ?? {},
    } as any;
}
