import { Flex, Image, Text, Title } from "@mantine/core"

import EmptyBox from "../assets/empty-state.svg"

interface EmptyStateProps {
  title?: string
  description?: string
}

export const EmptyState = (props: EmptyStateProps) => {
  const { title, description } = props

  return (
    <Flex direction="column" align="center" gap="lg" mih={432} justify="center">
      <Image src={EmptyBox} h={120} w={124} alt="empty-box" />
      <Flex direction="column" align="center">
        <Title order={3}>{title ?? "No Data Found"}</Title>
        {description ? (
          <Text size="lg" c="dimmed">
            {description}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  )
}
