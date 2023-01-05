import { Navbar, ThemeIcon, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import { Lamp2 } from "tabler-icons-react";

const Logo = () => {
    return (
        <Link to={"/"} className="w-fit">
            <Navbar.Section className="flex items-center gap-1">
                <ThemeIcon color="violet">
                    <Lamp2 />
                </ThemeIcon>
                <Title order={2}>Storybites</Title>
            </Navbar.Section>
        </Link>
    );
};

export default Logo;
