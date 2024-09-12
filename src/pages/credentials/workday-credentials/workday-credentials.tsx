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
import { EditWorkdayCredentialDrawer } from "./edit-workday-credential-drawer"
import { WorkdayCredentialsList } from "./workday-credentials-list"

interface WorkdayCredentialsProps {
  searchTerm?: string
}

export const WorkdayCredentials = (props: WorkdayCredentialsProps) => {
  const { searchTerm } = props

  const [credentialIdToEdit, setCredentialIdToEdit] = useState<string>("")

  const [editDrawerIsOpen, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false)

  const queryClient = tsr.useQueryClient()

  const {
    data: externalCredentialsData,
    isLoading: externalCredentialsLoading,
  } = tsr.getCredentialsExternal.useQuery({
    queryKey: ["getCredentialsExternal"],
  })

  const { mutate: deleteCredential } =
    tsr.deleteCredentialsExternal.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getCredentialsExternal"] })
        showSuccessNotification({
          message: "Workday credential successfully deleted",
        })
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
    externalCredentialsData?.body ?? [],
    searchTerm
  )

  let content = null

  if (items.length > 0) {
    content = (
      <WorkdayCredentialsList
        data={items}
        onDeleteCredential={openDeleteModal}
        onEditCredential={editEditCredentialDrawer}
      />
    )
  } else if (externalCredentialsLoading) {
    content = (
      <Flex justify="center" align="center" w="100%" h={400}>
        <Loader />
      </Flex>
    )
  } else {
    content = (
      <EmptyState
        title="No Workday Credentials"
        description={`Click on "Add new Workday credential" to add the first one`}
      />
    )
  }

  return (
    <>
      {content}

      <EditWorkdayCredentialDrawer
        opened={editDrawerIsOpen}
        onClose={closeEditDrawer}
        credentialId={credentialIdToEdit}
      />
    </>
  )
}
