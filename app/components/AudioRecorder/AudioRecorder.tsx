import { Button, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRecorder } from "use-recorder";
import AudioPlayer from "react-h5-audio-player";

const RecorderStatus: { STOP: string; RECORDING: string } = {
    STOP: "STOP",
    RECORDING: "RECORDING",
};

const AudioRecoder = ({ onAudioFileChange }: { onAudioFileChange: (audioFile: File | undefined) => void }) => {
    const [selfTimeoutId, setSelfTimeoutId] = useState<any>(null);
    const [status, setStatus] = useState(RecorderStatus.STOP);
    const { start, stop, player, audio } = useRecorder();

    const actions = {
        [RecorderStatus.RECORDING]: () => {
            start();
        },
        [RecorderStatus.STOP]: () => {
            stop();
        },
    };

    const handleAction = (action: string) => {
        setStatus(action);
        actions[action]();
    };

    useEffect(() => {
        onAudioFileChange(audio);
    }, [audio]);

    useEffect(() => {
        if (status === RecorderStatus.RECORDING) {
            const timeoutId = setTimeout(() => {
                setSelfTimeoutId(null);
                setStatus(RecorderStatus.STOP);
                handleAction(RecorderStatus.STOP);
            }, 60000); // 1 minute
            setSelfTimeoutId(timeoutId);
        } else if (selfTimeoutId) {
            handleAction(RecorderStatus.STOP);
            clearTimeout(selfTimeoutId);
            setSelfTimeoutId(null);
        }
    }, [status]);

    return (
        <Container>
            {status === RecorderStatus.RECORDING && <div>Time Remaining: -</div>}
            <Button
                variant="outline"
                onClick={() => handleAction(RecorderStatus.RECORDING)}
                disabled={status == RecorderStatus.RECORDING}
            >
                Start new recording
            </Button>
            <Button
                variant="outline"
                onClick={() => handleAction(RecorderStatus.STOP)}
                disabled={status == RecorderStatus.STOP}
            >
                End recording
            </Button>
            {!!player && status === RecorderStatus.STOP && <AudioPlayer src={player.src} showJumpControls={false} />}
        </Container>
    );
};

export default AudioRecoder;
