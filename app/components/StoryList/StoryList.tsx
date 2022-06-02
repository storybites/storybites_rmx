import { UnstyledButton, Group, Text } from "@mantine/core";
import type { Stories } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

interface StoryItemProps {
    story: Stories;
}

function StoryItem({ story }: StoryItemProps) {
    const navigate = useNavigate();

    return (
        <UnstyledButton
            sx={(theme) => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

                "&:hover": {
                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}
            onClick={() => {
                navigate("/stories/" + story.id);
            }}
        >
            <Group>
                <Text size="sm">{story.title}</Text>
            </Group>
        </UnstyledButton>
    );
}

export default StoryItem;
