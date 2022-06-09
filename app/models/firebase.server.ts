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
    const encodedFirebaseConfig = process.env.FIREBASE_CONFIG;
    const encodedServiceAccountConfig = process.env.SERVICE_ACCOUNT;

    if (!encodedFirebaseConfig || !encodedServiceAccountConfig) {
        throw new Error("missing configs");
    }
    const decodedFirebaseConfig = Buffer.from(encodedFirebaseConfig, "base64").toString();
    const decodedServiceAccountConfig = Buffer.from(encodedServiceAccountConfig, "base64").toString();

    return {
        FIREBASE_CONFIG: JSON.parse(decodedFirebaseConfig),
        SERVICE_ACCOUNT: JSON.parse(decodedServiceAccountConfig),
    } as any;
}
