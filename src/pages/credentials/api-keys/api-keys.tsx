import { Flex, Loader, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { useState } from "react"

import { tsr } from "../../../api/api-client"
import { filterBySearchTerm } from "../../../shared/filter-by-search-term"
import { EmptyState } from "../../../ui/empty-state/empty-state"
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../ui/notifications/notifications"
import { ApiKeysList } from "./api-keys-list"
import { EditApiKeyDrawer } from "./edit-api-key-drawer"

interface ApiKeysProps {
  searchTerm?: string
}

export const ApiKeys = (props: ApiKeysProps) => {
  const { searchTerm } = props

  const [credentialIdToEdit, setCredentialIdToEdit] = useState<string>("")

  const [editDrawerIsOpen, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false)

  const queryClient = tsr.useQueryClient()

  const {
    data: internalCredentialsData,
    isLoading: internalCredentialsLoading,
  } = tsr.getCredentialsInternal.useQuery({
    queryKey: ["getCredentialsInternal"],
  })

  const { mutate: deleteCredential } =
    tsr.deleteCredentialsInternal.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getCredentialsInternal"] })
        showSuccessNotification({ message: "API Key successfully deleted" })
      },
      onError: () =>
        showErrorNotification({
          message: "Something went wrong. Please try again.",
        }),
    })

  const openDeleteModal = (credentialId: string) =>
    modals.openConfirmModal({
      title: (
        <Text size="md" fw={600}>
          Delete Key
        </Text>
      ),
      children: (
        <Text size="sm">Are you sure you want to delete this key?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      centered: true,
      confirmProps: { color: "red" },
      padding: "lg",
      onConfirm: () => {
        deleteCredential({ params: { id: credentialId } })
      },
    })

  const editEditCredentialDrawer = (credentialId: string) => {
    setCredentialIdToEdit(credentialId)
    openEditDrawer()
  }

  const items = filterBySearchTerm(
    internalCredentialsData?.body ?? [],
    searchTerm
  )

  let content = null

  if (items.length > 0) {
    content = (
      <ApiKeysList
        data={items}
        onDeleteCredential={openDeleteModal}
        onEditCredential={editEditCredentialDrawer}
      />
    )
  } else if (internalCredentialsLoading) {
    content = (
      <Flex justify="center" align="center" w="100%" h={400}>
        <Loader />
      </Flex>
    )
  } else {
    content = (
      <EmptyState
        title="No API Keys"
        description={`Click on "Add new API key" to add the first one`}
      />
    )
  }

  return (
    <>
      {content}

      <EditApiKeyDrawer
        opened={editDrawerIsOpen}
        onClose={closeEditDrawer}
        credentialId={credentialIdToEdit}
      />
    </>
  )
}
