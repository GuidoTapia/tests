import { Badge, Flex, MantineColor, Text } from "@mantine/core"
import { HttpStatusCode } from "axios"
import Case from "case"

import {
  type HttpStatusCategory,
  getHttpStatusCategory,
} from "../../../shared/http-status-category"

function getStatusColor(
  category: HttpStatusCategory | undefined
): MantineColor {
  switch (category) {
    case "INFORMATIONAL": {
      return "cyan"
    }
    case "SUCCESS": {
      return "teal"
    }
    case "REDIRECTION": {
      return "yellow"
    }
    case "CLIENT_ERROR": {
      return "pink"
    }
    case "SERVER_ERROR": {
      return "red"
    }
    default: {
      return "gray"
    }
  }
}

type StatusCodeProps = {
  statusCode: number
}

export const StatusCode = (props: StatusCodeProps) => {
  const { statusCode } = props

  const httpStatusCategory = getHttpStatusCategory(statusCode)

  const statusColor = getStatusColor(httpStatusCategory)

  return (
    <Flex gap="sm" align="center">
      <Text size="lg" c={statusColor}>
        {statusCode}
      </Text>
      <Badge color={statusColor} size="md" variant="light">
        <Text tt="capitalize" fw={600}>
          {Case.sentence(HttpStatusCode[statusCode])}
        </Text>
      </Badge>
    </Flex>
  )
}
