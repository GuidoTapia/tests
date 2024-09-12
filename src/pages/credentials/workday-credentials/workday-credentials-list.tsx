import { ActionIcon, Flex, Grid, Paper, Text } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"

import { ExternalCredentialsSchemaDTO } from "../../../api/services/credentials/external-credentials.dto"

interface WorkdayCredentialsListProps {
  data: ExternalCredentialsSchemaDTO[]
  onEditCredential: (id: string) => void
  onDeleteCredential: (id: string) => void
}

export const WorkdayCredentialsList = (props: WorkdayCredentialsListProps) => {
  const { data, onEditCredential, onDeleteCredential } = props

  const sortedItems = data.sort(
    (credentialA, credentialB) =>
      new Date(credentialB.updated_at).valueOf() -
      new Date(credentialA.updated_at).valueOf()
  )

  return (
    <Grid w="100%" gutter="lg">
      {sortedItems.map((credential) => (
        <Grid.Col key={credential.id} span={{ sm: 12, md: 6, lg: 4 }}>
          <Paper p="md" w="100%" withBorder>
            <Flex direction="column" gap="sm">
              <Flex justify="space-between">
                <Text size="lg" fw={600}>
                  {credential.descriptor}
                </Text>
                <Flex gap="md">
                  <ActionIcon
                    size="lg"
                    variant="default"
                    onClick={() => onEditCredential(credential.id)}
                  >
                    <IconEdit />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    size="lg"
                    variant="outline"
                    onClick={() => onDeleteCredential(credential.id)}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Flex>
              </Flex>
              <Text size="lg" c="dimmed">
                Issued: {new Date(credential.updated_at).toLocaleDateString()}
              </Text>
              <Text size="lg" c="dimmed">
                Tenant: {credential.tenant}
              </Text>
            </Flex>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  )
}
