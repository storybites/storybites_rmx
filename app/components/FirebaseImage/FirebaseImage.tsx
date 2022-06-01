import { useEffect, useState } from "react";
import { fetchImage } from "../../services/Firebase";
import { Image } from "@mantine/core";

const FirebaseImage = (props: {
    url?: string | undefined;
    imageName: string;
    onImageFetch?: (url: string) => void;
}) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(props.url);

    useEffect(() => {
        async function _fetchImage() {
            const url = await fetchImage(props.imageName);
            setImageUrl(url);
            props.onImageFetch?.(url);
        }

        if (!imageUrl) {
            _fetchImage();
        }
    }, []);

    return <Image width={200} height={120} src={imageUrl} withPlaceholder />;
};

export default FirebaseImage;
