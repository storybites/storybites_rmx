import { ActionIcon, Box, Button, Center, Image, Input, SegmentedControl, Text } from "@mantine/core";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { useRef, useState } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import { At, Camera as CameraIcon, CameraRotate, FileDots, H1, H2 } from "tabler-icons-react";
import { v4 as uuidv4 } from "uuid";
import AudioRecoder from "~/components/AudioRecorder/AudioRecorder";
import Dropzone from "~/components/DropZone/DropZone";
import Logo from "~/components/Logo/Logo";
import MapContainer from "~/components/Map/Map.client";
import useClientComponent from "~/hooks/useClientComponent";
import { cloudStorageUploaderHandler } from "~/models/firebase.server";
import { createStory } from "~/models/stories.server";
import { createImageUrlFromSrc, dataURLtoFile } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
    switch (request.method) {
        case "POST": {
            try {
                const clone = await request.clone().formData();
                const formData = await unstable_parseMultipartFormData(request, cloudStorageUploaderHandler);
                const imageFileName: any = formData.get("image");
                const audioFileName: any = formData.get("audio_file");
                const title: any = clone.get("title");
                const lat: any = clone.get("lat");
                const long: any = clone.get("long");
                const summary: any = clone.get("summary");
                const email: any = clone.get("email");
                console.log(imageFileName, audioFileName, title);
                if (imageFileName == null || audioFileName == null || !lat || !long || !summary || !email) {
                    // TODO: delete any asset that did succeed
                    throw new Error("Failed to create new story");
                }
                await createStory({
                    audioUrl: audioFileName,
                    title,
                    lat: parseFloat(lat),
                    long: parseFloat(long),
                    imageName: imageFileName,
                    ownerEmail: email,
                    summary,
                });
                return redirect("/stories");
            } catch (e) {
                console.log(e);
                return {
                    status: "failure",
                };
            }
        }
    }

    return null;
};

export default function NewStory() {
    const transition = useTransition();

    const [imageSourceType, setImageSourceType] = useState<"file" | "camera">("camera");
    const [cameraMode, setCameraMode] = useState<typeof FACING_MODES.ENVIRONMENT | typeof FACING_MODES.USER>(
        FACING_MODES.ENVIRONMENT
    );
    const [imageUrl, setImageUrl] = useState("");
    const [audioFile, setAudioFile] = useState<File | undefined>();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const Map = useClientComponent(MapContainer);
    const [latLong, setLatLong] = useState<{ lat: number; long: number } | null>(null);
    const [mapKey, setMapKey] = useState(0);

    function handleImageSetting(src: File | string | null) {
        if (!src) {
            setImageUrl("");
            if (imageInputRef.current) {
                imageInputRef.current.files = null;
            }
        } else {
            setImageUrl(createImageUrlFromSrc(src));
            if (imageInputRef.current) {
                let container = new DataTransfer();
                if (typeof src === "string") {
                    container.items.add(dataURLtoFile(src, `${uuidv4()}.jpg`));
                } else {
                    container.items.add(src);
                }
                imageInputRef.current.files = container.files;
            }
        }
    }

    function handleAudioFileChange(audio: File | undefined) {
        setAudioFile(audio);
        if (audioInputRef.current) {
            if (audio) {
                let container = new DataTransfer();
                container.items.add(new File([(audio as any).blob], `${uuidv4()}.wav`));
                audioInputRef.current.files = container.files;
            } else {
                audioInputRef.current.files = null;
            }
        }
    }

    return (
        <div className="flex w-full justify-center">
            <div className="flex w-3/4 flex-col justify-center p-4 sm:w-1/2">
                <Logo />
                <Text size="md">Create a new story</Text>

                <Form method="post" encType="multipart/form-data" className="flex flex-col">
                    <Input name="title" icon={<H1 />} placeholder="Story title" required className="mb-2" />
                    <Input
                        icon={<H2 />}
                        placeholder="Story summary"
                        maxLength={250}
                        name="summary"
                        required
                        className="mb-2"
                    />
                    <Input
                        icon={<At />}
                        placeholder="Your email"
                        name="email"
                        required
                        type="email"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        className="mb-2"
                    />
                    <SegmentedControl
                        value={imageSourceType}
                        onChange={(value: "file" | "camera") => {
                            setImageUrl("");
                            setImageSourceType(value);
                        }}
                        data={[
                            {
                                label: (
                                    <Center>
                                        <FileDots size={16} />
                                        <Box ml={10}>File</Box>
                                    </Center>
                                ),
                                value: "file",
                            },
                            {
                                label: (
                                    <Center>
                                        <CameraIcon size={16} />
                                        <Box ml={10}>Camera</Box>
                                    </Center>
                                ),
                                value: "camera",
                            },
                        ]}
                        className="mb-2 w-full"
                    />
                    <div className="flex w-full justify-center">
                        <div className="w-80">
                            {imageSourceType === "file" && !imageUrl && (
                                <Dropzone file={imageUrl} onFileSelected={handleImageSetting} />
                            )}
                            {imageSourceType === "camera" && !imageUrl && (
                                <Camera
                                    onTakePhotoAnimationDone={handleImageSetting}
                                    isFullscreen={false}
                                    idealFacingMode={cameraMode}
                                    imageType={IMAGE_TYPES.JPG}
                                />
                            )}
                            {imageUrl && (
                                <Image fit="contain" width={320} height={240} src={imageUrl} withPlaceholder />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 p-4">
                        {imageUrl && (
                            <Button
                                onClick={() => {
                                    handleImageSetting("");
                                }}
                                variant="filled"
                            >
                                Reset image
                            </Button>
                        )}
                        {imageSourceType === "camera" && (
                            <ActionIcon
                                onClick={() => {
                                    setCameraMode(
                                        cameraMode === FACING_MODES.ENVIRONMENT
                                            ? FACING_MODES.USER
                                            : FACING_MODES.ENVIRONMENT
                                    );
                                }}
                            >
                                <CameraRotate />
                            </ActionIcon>
                        )}
                    </div>
                    <div className="mb-2 flex flex-col items-center justify-center sm:flex-row">
                        <AudioRecoder onAudioFileChange={handleAudioFileChange} />
                    </div>
                    <div className="h-80 w-full">
                        <Map stories={[]} markCurrentLocation markOnClick onLocationUpdate={setLatLong} key={mapKey} />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={() => {
                                setMapKey(mapKey + 1);
                            }}
                        >
                            Recenter
                        </Button>
                    </div>

                    <input name="image" type="file" ref={imageInputRef} hidden />
                    <input name="audio_file" type="file" ref={audioInputRef} hidden />
                    <input name="lat" value={latLong?.lat ?? "missing"} readOnly hidden />
                    <input name="long" value={latLong?.long ?? "missing"} readOnly hidden />

                    <Button
                        disabled={!latLong || !imageUrl || !audioFile || transition.state === "submitting"}
                        type="submit"
                        className="ml-auto mt-2"
                    >
                        {transition.state !== "submitting" ? "Submit Story" : "Submitting..."}
                    </Button>
                </Form>
            </div>
        </div>
    );
}
