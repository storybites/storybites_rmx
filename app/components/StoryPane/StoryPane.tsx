import { Navbar } from "@mantine/core";
import { Link, Outlet } from "@remix-run/react";
import StoryItem from "~/components/StoryList/StoryList";
import type { Stories } from "~/models/stories.server";
import Logo from "../Logo/Logo";

export default function StoriesPage({ showStoriesList, stories }: { showStoriesList: boolean; stories: Stories[] }) {
    return (
        <Navbar p="xs" className="h-full w-full min-w-full p-4">
            <Logo />
            <Navbar.Section grow mt="md">
                {showStoriesList && (
                    <div className="flex h-full flex-col">
                        <Link to={"/newstory"}>Create new story </Link>
                        {stories.length > 0 &&
                            stories.map((story) => {
                                return <StoryItem key={story.id} story={story} />;
                            })}
                        {stories.length === 0 && (
                            <div className="flex h-full flex-col items-center justify-center">
                                No stories nearby, why not{" "}
                                <Link className="underline" to="/newstory">
                                    be the first!
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                <Outlet />
            </Navbar.Section>
        </Navbar>
    );
}
