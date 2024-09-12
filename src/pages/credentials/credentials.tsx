import {
  Button,
  Flex,
  SegmentedControl,
  TextInput,
  useMatches,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { useState } from "react"

import { ApiKeys } from "./api-keys/api-keys"
import { CreateApiKeyDrawer } from "./api-keys/create-api-key-drawer"
import { CreateWorkdayCredentialDrawer } from "./workday-credentials/create-workday-credential-drawer"
import { WorkdayCredentials } from "./workday-credentials/workday-credentials"

enum CredentialEnum {
  API_KEY = "API_KEY",
  WORKDAY_CREDENTIAL = "WORKDAY_CREDENTIAL",
}

export const Credentials = () => {
  const [tab, setTab] = useState<string>(CredentialEnum.API_KEY)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [openApiKeyDrawerOnClose, setOpenApiKeyDrawerOnClose] =
    useState<boolean>(false)

  const isMobile = useMatches({
    xs: true,
    sm: true,
    md: false,
    lg: false,
    xl: false,
  })

  const [
    createApiKeyDrawerIsOpen,
    { open: openCreateApiKeyDrawer, close: closeCreateApiKeyDrawer },
  ] = useDisclosure(false)
  const [
    createWorkdayCredentialDrawerIsOpen,
    {
      open: openCreateWorkdayCredentialDrawer,
      close: closeCreateWorkdayCredentialDrawer,
    },
  ] = useDisclosure(false)

  const onChangeTab = (newTab: string) => {
    setTab(newTab)
    setSearchTerm("")
  }

  const onOpenCreateWorkdayOnApiKey = () => {
    openCreateWorkdayCredentialDrawer()
    closeCreateApiKeyDrawer()
    setOpenApiKeyDrawerOnClose(true)
  }

  const onCloseCreateWorkdayDrawer = () => {
    if (openApiKeyDrawerOnClose) {
      openCreateApiKeyDrawer()
      setOpenApiKeyDrawerOnClose(false)
    }
    closeCreateWorkdayCredentialDrawer()
  }

  return (
    <Flex direction="column" gap="lg">
      <Flex
        direction={isMobile ? "column" : "row"}
        align="center"
        justify="space-between"
        wrap="wrap"
        gap="md"
      >
        <Flex
          gap="md"
          w={isMobile ? "100%" : undefined}
          direction={isMobile ? "column" : "row"}
        >
          <SegmentedControl
            data={[
              { label: "API Keys", value: CredentialEnum.API_KEY },
              {
                label: "Workday Credentials",
                value: CredentialEnum.WORKDAY_CREDENTIAL,
              },
            ]}
            size="md"
            value={tab}
            onChange={onChangeTab}
            fullWidth={isMobile}
            miw={isMobile ? undefined : "400px"}
          />
          <TextInput
            placeholder="Search"
            leftSection={<IconSearch size={20} />}
            size="md"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            visibleFrom="md"
          />
        </Flex>

        {tab === "API_KEY" ? (
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={openCreateApiKeyDrawer}
            size="md"
            w={isMobile ? "100%" : undefined}
          >
            Add new API key
          </Button>
        ) : null}
        {tab === "WORKDAY_CREDENTIAL" ? (
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={openCreateWorkdayCredentialDrawer}
            size="md"
            w={isMobile ? "100%" : undefined}
          >
            Add new workday credential
          </Button>
        ) : null}
      </Flex>
      <TextInput
        placeholder="Search"
        leftSection={<IconSearch size={20} />}
        size="md"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        hiddenFrom="md"
      />
      {tab === "API_KEY" ? <ApiKeys searchTerm={searchTerm} /> : null}
      {tab === "WORKDAY_CREDENTIAL" ? (
        <WorkdayCredentials searchTerm={searchTerm} />
      ) : null}
      <CreateApiKeyDrawer
        opened={createApiKeyDrawerIsOpen}
        onClose={closeCreateApiKeyDrawer}
        onWorkdayCreate={onOpenCreateWorkdayOnApiKey}
      />
      <CreateWorkdayCredentialDrawer
        opened={createWorkdayCredentialDrawerIsOpen}
        onClose={onCloseCreateWorkdayDrawer}
      />
    </Flex>
  )
}
