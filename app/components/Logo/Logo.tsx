import { Navbar, ThemeIcon, Title } from "@mantine/core";
import { Lamp2 } from "tabler-icons-react";

const Logo = () => {
    return (
        <Navbar.Section className="flex items-center gap-1">
            <ThemeIcon color="violet">
                <Lamp2 />
            </ThemeIcon>
            <Title order={2}>Storybites</Title>
        </Navbar.Section>
    );
};

export default Logo;
