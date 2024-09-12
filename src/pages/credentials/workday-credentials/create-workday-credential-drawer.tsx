import {
  Autocomplete,
  Button,
  Flex,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core"
import { isNotEmpty, useForm } from "@mantine/form"

import { tsr } from "../../../api/api-client"
import { tenants } from "../../../api/mock-server/static-data/tenants"
import { Drawer } from "../../../ui/drawer"
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../ui/notifications/notifications"

interface CreateWorkdayCredentialFormValues {
  descriptor: string
  tenant: string
  username: string
  password: string
  user_admin_id: string
}

interface CreateWorkdayCredentialDrawerProps {
  opened: boolean
  onClose: () => void
}

export const CreateWorkdayCredentialDrawer = (
  props: CreateWorkdayCredentialDrawerProps
) => {
  const { opened, onClose } = props

  const queryClient = tsr.useQueryClient()

  const { data: userAdminsData } = tsr.getUserAdmins.useQuery({
    queryKey: ["getUserAdmins"],
  })

  const adminsList =
    userAdminsData?.body.map((user) => ({
      label: user.email_address,
      value: user.id,
    })) ?? []

  const {
    mutate: createWorkdayCredential,
    isPending: createWorkdayCredentialLoading,
  } = tsr.createCredentialsExternal.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCredentialsExternal"] })
      showSuccessNotification({
        message: "Workday credential successfully created",
      })
      form.reset()
      onClose()
    },
    onError: () =>
      showErrorNotification({
        message: "Something went wrong. Please try again.",
      }),
  })

  const form = useForm<CreateWorkdayCredentialFormValues>({
    // uncontrolled mode cause multiselect to fail
    mode: "controlled",
    initialValues: {
      descriptor: "",
      tenant: "",
      username: "",
      password: "",
      user_admin_id: "",
    },
    validate: {
      descriptor: isNotEmpty("Required"),
      username: isNotEmpty("Requires"),
      password: isNotEmpty("Required"),
      tenant: isNotEmpty("Required"),
    },
  })

  const onSubmitCreate = form.onSubmit((values) => {
    createWorkdayCredential({
      body: {
        ...values,
      },
    })
  })

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="New Workday Credential"
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
            form="create-workday-credential"
            loading={createWorkdayCredentialLoading}
          >
            Add New Credential
          </Button>
        </Flex>
      }
    >
      <form onSubmit={onSubmitCreate} id="create-workday-credential">
        <Flex direction="column" gap="md">
          <Select
            label="Admin User"
            data={adminsList}
            {...form.getInputProps("user_admin_id", { type: "input" })}
            searchable
          />
          <TextInput
            label="Username"
            {...form.getInputProps("username", { type: "input" })}
          />
          <PasswordInput
            label="Password"
            {...form.getInputProps("password", { type: "input" })}
          />
          <TextInput
            label="Descriptor"
            {...form.getInputProps("descriptor", { type: "input" })}
          />
          <Autocomplete
            data={tenants}
            label="Tenant"
            {...form.getInputProps("tenant", {
              type: "input",
            })}
          />
        </Flex>
      </form>
    </Drawer>
  )
}
