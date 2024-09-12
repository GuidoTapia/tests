import { CodeHighlight } from "@mantine/code-highlight"
import { Box, Flex, Paper, ScrollArea, Text, useMatches } from "@mantine/core"
import Case from "case"
import { useParams } from "react-router-dom"

import { tsr } from "../../../api/api-client"
import { paths } from "../../../shared/paths"
import { BreadCrumbHeader } from "../../../ui/breadcumb-header/breadcumb-header"
import { breadcumbTitles } from "../../../ui/breadcumb-header/breadcumb-titles"
import { StatusCode } from "./status-code"

type RequestDetailParams = {
  requestId: string
}

export const RequestDetail = () => {
  const { requestId } = useParams() as RequestDetailParams

  const isMobile = useMatches({
    base: true,
    md: false,
    lg: false,
    xl: false,
  })

  const { data: logData } = tsr.getAPIOperationHistoryById.useQuery({
    queryKey: ["getAPIOperationHistoryById", requestId],
    queryData: { params: { id: requestId } },
    enabled: Boolean(requestId),
  })

  if (!logData?.body) return null

  return (
    <Flex
      direction="column"
      gap="lg"
      w="100%"
      h="100%"
      style={{ overflow: "hidden" }}
    >
      <BreadCrumbHeader
        breadcrumbItems={[
          { title: breadcumbTitles.requests.index, href: paths.requests.index },
          { title: Case.title(logData.body.api_operation) },
        ]}
      />
      <Flex
        gap="lg"
        direction={isMobile ? "column-reverse" : "row"}
        style={{ overflow: "scroll" }}
      >
        <Paper flex={1} maw={isMobile ? "100%" : "60%"} withBorder>
          <Flex
            direction="column"
            mah="100%" //style={{ overflow: "hidden" }}
          >
            <Box p="md">
              <Text size="lg" fw={600}>
                Request Body
              </Text>
            </Box>
            <ScrollArea h="1200px">
              <CodeHighlight
                code={logData.body.request_sanitized}
                language="html"
              />
            </ScrollArea>
          </Flex>
        </Paper>
        <Paper p="md" flex={1} withBorder miw={280}>
          <Flex gap="md" direction="column">
            <Text size="lg" fw={600} h={20}>
              {Case.title(logData.body.api_operation)}
            </Text>
            <Text size="lg" c="dimmed" h={20}>
              Tenant: {logData.body.tenant}
            </Text>
            <Text size="lg" c="dimmed" h={20}>
              ISU: {logData.body.creds_external_username}
            </Text>
            <Text size="lg" c="dimmed" h={20}>
              API key: {logData.body.creds_internal_descriptor}
            </Text>
            <Text size="lg" c="dimmed" h={20}>
              Originating IP: {logData.body.originating_ip}
            </Text>
            {logData.body.status_code ? (
              <StatusCode statusCode={logData.body.status_code} />
            ) : (
              logData.body.status_code
            )}
          </Flex>
        </Paper>
      </Flex>
    </Flex>
  )
}
