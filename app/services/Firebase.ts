import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
    apiKey: "AIzaSyBwVMX11BGSewiaZ2PpStJ8LF-lvG12048",
    authDomain: "storybites-qa.firebaseapp.com",
    projectId: "storybites-qa",
    storageBucket: "storybites-qa.appspot.com",
    messagingSenderId: "679971063816",
    appId: "1:679971063816:web:ec72c91f042849277669bd",
    measurementId: "G-VCWDXBXG06",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);

export async function uploadImage(dataUri: string) {
    if (!dataUri) {
        throw new Error("Missing dataURI");
    }

    const filename = `/photos/${uuidv4()}.jpg`;
    const photoRef = ref(storage, filename);
    const metadata = { contentType: "image/png" };
    try {
        const res = await uploadString(photoRef, dataUri, "data_url", metadata);
        return {
            status: "success",
            data: res,
        };
    } catch {
        return {
            status: "failure",
        };
    }
}

export async function fetchImage(name: string) {
    const imageRef = ref(storage, `photos/${name}`);
    const url = await getDownloadURL(imageRef);
    return url;
}

export default storage;
