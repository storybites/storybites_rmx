/* eslint-disable react/jsx-pascal-case */
import type { MantineTheme } from "@mantine/core";
import { Group, Text, useMantineTheme } from "@mantine/core";
import type { Icon as TablerIcon } from "tabler-icons-react";
import { Upload, Photo, X } from "tabler-icons-react";
import type { DropzoneStatus } from "@mantine/dropzone";
import { Dropzone as _Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
        : status.rejected
        ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
        : theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7];
}

function ImageUploadIcon({ status, ...props }: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
    if (status.accepted) {
        return <Upload {...props} />;
    }

    if (status.rejected) {
        return <X {...props} />;
    }

    return <Photo {...props} />;
}

export const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
        <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />

        <div>
            <Text size="xl" inline>
                Drag image here or click to select file
            </Text>
        </div>
    </Group>
);

export default function Dropzone({ file, onFileSelected }: { file: string; onFileSelected: (file: File) => void }) {
    const theme = useMantineTheme();
    return (
        <_Dropzone
            onDrop={(files) => onFileSelected(files[0])}
            // onReject={(files) => console.log("rejected files", files)}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
        >
            {() => {
                return dropzoneChildren({ accepted: !!file, rejected: false }, theme);
            }}
        </_Dropzone>
    );
}
