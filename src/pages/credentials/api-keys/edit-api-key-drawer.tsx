import { Button, Flex, MultiSelect, TextInput } from "@mantine/core"
import { isNotEmpty, useForm } from "@mantine/form"
import { useEffect } from "react"

import { tsr } from "../../../api/api-client"
import { apiOperations } from "../../../api/mock-server/static-data/api-operations"
import { Drawer } from "../../../ui/drawer"
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../ui/notifications/notifications"

interface EditApiKeyFormValues {
  descriptor: string
  api_operations_allowed: string[]
}

type EditApiKeyDrawerProps = {
  credentialId: string
  opened: boolean
  onClose: () => void
}

export const EditApiKeyDrawer = (props: EditApiKeyDrawerProps) => {
  const { credentialId, opened, onClose } = props

  const queryClient = tsr.useQueryClient()

  const { data: credential, isFetching: credentialIsLoading } =
    tsr.getCredentialsInternalById.useQuery({
      queryKey: ["getCredentialsInternalById", credentialId],
      queryData: { params: { id: credentialId } },
      enabled: Boolean(credentialId),
    })

  const { mutate: updateApiKey, isPending: updateApiKeyLoading } =
    tsr.updateCredentialsInternal.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getCredentialsInternal"] })
        showSuccessNotification({ message: "API Key successfully updated" })
        onClose()
      },
      onError: () =>
        showErrorNotification({
          message: "Something went wrong. Please try again.",
        }),
    })

  const form = useForm<EditApiKeyFormValues>({
    // uncontrolled mode cause multiselect to fail
    mode: "controlled",
    initialValues: {
      descriptor: "",
      api_operations_allowed: [],
    },
    validate: {
      descriptor: isNotEmpty("Required"),
    },
  })

  const onSubmitUpdate = form.onSubmit((values) =>
    updateApiKey({ body: values, params: { id: credentialId } })
  )

  useEffect(() => {
    if (credential?.body && form.initialized) {
      form.setValues({
        descriptor: credential.body.descriptor,
        api_operations_allowed: credential.body.api_operations_allowed,
      })
    } else if (credential?.body) {
      form.initialize({
        descriptor: credential.body.descriptor,
        api_operations_allowed: credential.body.api_operations_allowed,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credential?.body])

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Edit Api Key"
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
            form="edit-credential"
            disabled={!form.isValid()}
            loading={credentialIsLoading || updateApiKeyLoading}
          >
            Update Key
          </Button>
        </Flex>
      }
    >
      <form onSubmit={onSubmitUpdate} id="edit-credential">
        <Flex direction="column" gap="md">
          <TextInput
            label="Descriptor"
            {...form.getInputProps("descriptor", { type: "input" })}
          />
          <TextInput
            label="API Key Value"
            value={`${credential?.body.api_key_first_eight_chars}****************`}
            disabled
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
