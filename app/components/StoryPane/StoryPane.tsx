import { Navbar, ThemeIcon, Title } from "@mantine/core";
import { Link, Outlet } from "@remix-run/react";
import { Lamp2 } from "tabler-icons-react";
import StoryItem from "~/components/StoryList/StoryList";
import type { Stories } from "~/models/stories.server";

export default function StoriesPage({ showStoriesList, stories }: { showStoriesList: boolean; stories: Stories[] }) {
    return (
        <Navbar p="xs" className="h-full w-full min-w-full p-4">
            <Navbar.Section className="flex items-center gap-1">
                <ThemeIcon color="violet">
                    <Lamp2 />
                </ThemeIcon>
                <Title order={2}>Storybites</Title>
            </Navbar.Section>
            <Navbar.Section grow mt="md">
                {showStoriesList && (
                    <div>
                        <Link to={"/newstory"}>Create new story </Link>
                        {stories.length > 0 &&
                            stories.map((story) => {
                                return <StoryItem key={story.id} story={story} />;
                            })}
                    </div>
                )}
                <Outlet />
            </Navbar.Section>
        </Navbar>
    );
}
