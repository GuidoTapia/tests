import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Flex,
  Image,
  Menu,
  NavLink,
  Text,
  UnstyledButton,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconChevronDown } from "@tabler/icons-react"
import { Link, useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom"

import { paths } from "../../shared/paths"
import stormloopLogo from "../assets/stormloop-icon.png"

const HEADER_HEIGHT = 64

export const Layout = () => {
  const { pathname } = useLocation()

  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: true, mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Flex px="2xl" align="center" justify="space-between" w="100%" h="100%">
          <Flex gap="md" align="center">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="md"
              size="sm"
            />
            <Image src={stormloopLogo} h={32} />
          </Flex>
          <Flex align="center" justify="flex-end" gap="xl">
            <Flex align="center" gap="lg" visibleFrom="md">
              <NavLink
                component={Link}
                to={paths.requests.index}
                label={<Text size="md">API Requests</Text>}
                variant="light"
                active={pathname === paths.requests.index}
                noWrap
              />
              <NavLink
                component={Link}
                to={paths.credentials.index}
                label={<Text size="md">Credentials</Text>}
                variant="light"
                active={pathname === paths.credentials.index}
                noWrap
              />
            </Flex>
            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <Flex align="center" gap="sm">
                    <Avatar radius="xl" />
                    <Text>User Name</Text>
                    <IconChevronDown size={16} />
                  </Flex>
                </UnstyledButton>
              </Menu.Target>
            </Menu>
          </Flex>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar py="lg" px="2xl">
        <NavLink
          component={Link}
          to={paths.requests.index}
          label="API Requests"
          variant="light"
          active={pathname === paths.requests.index}
          onClick={toggle}
          noWrap
        />
        <NavLink
          component={Link}
          to={paths.credentials.index}
          label="Credentials"
          variant="light"
          active={pathname === paths.credentials.index}
          onClick={toggle}
          noWrap
        />
      </AppShell.Navbar>
      <AppShell.Main h="100vh">
        <Box
          w="100vw"
          px="2xl"
          py="lg"
          mih={0}
          h="100%"
          style={{ overflow: "scroll" }}
        >
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
