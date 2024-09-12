import { Button, Flex, TextInput } from "@mantine/core"
import { isNotEmpty, useForm } from "@mantine/form"
import { useEffect } from "react"

import { tsr } from "../../../api/api-client"
import { Drawer } from "../../../ui/drawer"
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../ui/notifications/notifications"

interface EditWorkdayCredentialFormValues {
  descriptor: string
}

type EditWorkdayCredentialDrawerProps = {
  credentialId: string
  opened: boolean
  onClose: () => void
}

export const EditWorkdayCredentialDrawer = (
  props: EditWorkdayCredentialDrawerProps
) => {
  const { credentialId, opened, onClose } = props

  const queryClient = tsr.useQueryClient()

  const { data: credential, isFetching: credentialIsLoading } =
    tsr.getCredentialsExternalById.useQuery({
      queryKey: ["getCredentialsExternalById", credentialId],
      queryData: { params: { id: credentialId } },
      enabled: Boolean(credentialId),
    })

  const {
    mutate: updateWorkdayCredential,
    isPending: updateWorkdayCredentialLoading,
  } = tsr.updateCredentialsExternal.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCredentialsExternal"] })
      showSuccessNotification({
        message: "Workday credential successfully updated",
      })
      onClose()
    },
    onError: () =>
      showErrorNotification({
        message: "Something went wrong. Please try again.",
      }),
  })

  const form = useForm<EditWorkdayCredentialFormValues>({
    // uncontrolled mode cause multiselect to fail
    mode: "controlled",
    initialValues: {
      descriptor: "",
    },
    validate: {
      descriptor: isNotEmpty("Required"),
    },
  })

  const onSubmitUpdate = form.onSubmit((values) =>
    updateWorkdayCredential({ body: values, params: { id: credentialId } })
  )

  useEffect(() => {
    if (credential?.body && form.initialized) {
      form.setValues({
        descriptor: credential.body.descriptor,
      })
    } else if (credential?.body) {
      form.initialize({
        descriptor: credential.body.descriptor,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credential?.body])

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Edit Workday Credential"
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
            loading={credentialIsLoading || updateWorkdayCredentialLoading}
          >
            Update Credential
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
            value={"Mocked********Key"}
            disabled
          />
        </Flex>
      </form>
    </Drawer>
  )
}
