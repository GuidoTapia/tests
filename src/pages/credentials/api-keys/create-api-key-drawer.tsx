import {
  ActionIcon,
  Button,
  CopyButton,
  Flex,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { hasLength, isNotEmpty, useForm } from "@mantine/form"
import { modals } from "@mantine/modals"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { tsr } from "../../../api/api-client"
import { apiOperations } from "../../../api/mock-server/static-data/api-operations"
import { CreatableSelect } from "../../../ui/creatable-select/creatable-select"
import { Drawer } from "../../../ui/drawer"
import { showErrorNotification } from "../../../ui/notifications/notifications"

interface CreateApiKeyFormValues {
  descriptor: string
  api_operations_allowed: string[]
  creds_external_id: string
}

const showApiKeyModal = (apiKey: string) =>
  modals.open({
    closeOnClickOutside: false,
    closeOnEscape: false,
    yOffset: "10%",
    title: (
      <Text size="md" fw={600}>
        Here is your secret API Key
      </Text>
    ),
    children: (
      <Stack gap="md" mb="lg">
        <Text>
          Please copy and save this key in a safe place. You will not see this
          message again.
        </Text>
        <TextInput
          value={apiKey}
          rightSection={
            <CopyButton value={apiKey} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                  >
                    {copied ? <IconCheck /> : <IconCopy />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          }
          disabled
        />
      </Stack>
    ),
  })

interface CreateApiKeyDrawerProps {
  opened: boolean
  onClose: () => void
  onWorkdayCreate: () => void
}

export const CreateApiKeyDrawer = (props: CreateApiKeyDrawerProps) => {
  const { opened, onClose, onWorkdayCreate } = props

  const queryClient = tsr.useQueryClient()

  const { data: credentialsExternalData } = tsr.getCredentialsExternal.useQuery(
    {
      queryKey: ["getCredentialsExternal"],
    }
  )

  const credentialsListData =
    credentialsExternalData?.body.map((credential) => ({
      value: credential.id,
      label: credential.descriptor,
    })) ?? []

  const { mutate: createApiKey, isPending: createApiKeyLoading } =
    tsr.createCredentialsInternal.useMutation({
      onSuccess: ({ body }) => {
        queryClient.invalidateQueries({ queryKey: ["getCredentialsInternal"] })

        showApiKeyModal(body.api_key ?? "")

        form.reset()
        onClose()
      },
      onError: () =>
        showErrorNotification({
          message: "Something went wrong. Please try again.",
        }),
    })

  const form = useForm<CreateApiKeyFormValues>({
    // uncontrolled mode cause multiselect to fail
    mode: "controlled",
    initialValues: {
      descriptor: "",
      api_operations_allowed: [],
      creds_external_id: "",
    },
    validate: {
      descriptor: isNotEmpty("Required"),
      creds_external_id: isNotEmpty("Required"),
      api_operations_allowed: hasLength({ min: 1 }, "Required"),
    },
  })

  const onSubmitCreate = form.onSubmit((values) =>
    createApiKey({
      body: values,
    })
  )

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="New Api Key"
      options={
        <Flex w="100%" gap="sm">
          <Button
            size="md"
            type="button"
            variant="default"
            flex={1}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="md"
            type="submit"
            flex={1}
            form="create-api-key"
            loading={createApiKeyLoading}
          >
            Add New Key
          </Button>
        </Flex>
      }
    >
      <form onSubmit={onSubmitCreate} id="create-api-key">
        <Flex direction="column" gap="md">
          <TextInput
            label="Descriptor"
            {...form.getInputProps("descriptor", { type: "input" })}
          />
          <CreatableSelect
            data={credentialsListData}
            label="External Credential"
            onCreate={onWorkdayCreate}
            createLabel="+ Add Workday credential"
            {...form.getInputProps("creds_external_id", {
              type: "input",
            })}
          />
          <MultiSelect
            data={apiOperations}
            label="API Operations Allowed"
            {...form.getInputProps("api_operations_allowed", {
              type: "input",
            })}
            limit={50}
            searchable
          />
        </Flex>
      </form>
    </Drawer>
  )
}
