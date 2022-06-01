import { Button, Container, List, Modal } from "@mantine/core";
// import "./StoryPane.css";
import { Image } from "@mantine/core";
import { Title } from "@mantine/core";
import AudioPlayer from "react-h5-audio-player";
import { ActionIcon } from "@mantine/core";
import { ChevronLeft } from "tabler-icons-react";
import { useState } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import FirebaseImage from "../FirebaseImage/FirebaseImage";
import AudioRecoder from "../AudioRecorder/AudioRecorder";
// import Stories from "~/routes/stories";

const StoryPane = () => {
    const selectedStory = false;
    const [openNewStory, setOpenNewStory] = useState(false);
    const [dataUri, setDataUri] = useState("");

    function handleTakePhotoAnimationDone(dataUri: string) {
        console.log(dataUri);
        setDataUri(dataUri);
    }

    const onSaveStory = async () => {
        if (!!dataUri) {
            // bring back when ready
            // const res = await uploadImage(dataUri);
            // if (res.status !== "failure") {
            //     setDataUri("");
            //     // then call node service to upload
            // } else {
            //     // todo handle error case
            // }
        }
    };

    return (
        <div className="storypane_wrapper">
            {selectedStory && (
                <div className="story_time">
                    {/* <ActionIcon onClick={() => onSelectStory(null)}>
                        <ChevronLeft size={14} />
                    </ActionIcon>
                    <Title order={1}>{selectedStory.title}</Title>
                    {selectedStory.summary && <Title order={2}>{selectedStory.summary}</Title>}
                    <FirebaseImage
                        url={selectedStory.imageUrl}
                        imageName={selectedStory.imageName}
                        onImageFetch={(url: string) => {
                            onUpdateStory(selectedStory.id, { imageUrl: url });
                        }}
                    />
                    <AudioPlayer src={selectedStory.audioUrl} showJumpControls={false} /> */}
                </div>
            )}
            {!selectedStory && (
                // <div>
                //     <div
                //         onClick={() => {
                //             setOpenNewStory(true);
                //         }}
                //     >
                //         Add new story
                //     </div>
                //     <List withPadding>
                //         {stories.map((story) => {
                //             return (
                //                 <List.Item
                //                     key={story.id}
                //                     onClick={() => {
                //                         // onSelectStory(story.id);
                //                     }}
                //                 >
                //                     {story.title}
                //                 </List.Item>
                //             );
                //         })}
                //     </List>
                // </div>
                // <Stories />
                <div>asdf</div>
            )}
            <Modal
                opened={openNewStory}
                onClose={() => setOpenNewStory(false)}
                title="Create a new story!"
                zIndex={9999}
            >
                {dataUri && (
                    <div>
                        <img className="new_photo" src={dataUri} />
                        <Button variant="outline" onClick={() => setDataUri("")}>
                            Take Another
                        </Button>
                    </div>
                )}
                {!dataUri && (
                    <Camera
                        onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                        isFullscreen={false}
                        idealFacingMode={FACING_MODES.ENVIRONMENT}
                        imageType={IMAGE_TYPES.JPG}
                    />
                )}
                {/* TODO add a toggle mode to change front and back camera */}
                <AudioRecoder />
                <Button onClick={onSaveStory}>Save Story</Button>
            </Modal>
        </div>
    );
};

export default StoryPane;
