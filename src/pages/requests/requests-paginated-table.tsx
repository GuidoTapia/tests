import { Flex, Pagination, Table } from "@mantine/core"
import Case from "case"
import { useNavigate } from "react-router-dom"

import { RequestSchemaDTO } from "../../api/services/requests/requests.dto"
import { paths } from "../../shared/paths"

interface RequestsPaginatedTableProps {
  items: RequestSchemaDTO[]
  totalPages: number
  activePage: number
  setActivePage: (page: number) => void
}

export const RequestsPaginatedTable = (props: RequestsPaginatedTableProps) => {
  const { items, activePage, setActivePage, totalPages } = props

  const navigate = useNavigate()

  const onRequestDetail = (requestId: string) => {
    navigate(paths.requests.get(requestId))
  }

  const sortedItems = items.sort(
    (requestA, requestB) =>
      new Date(requestB.invoked_at).valueOf() -
      new Date(requestA.invoked_at).valueOf()
  )

  return (
    <Flex direction="column" align="center" w="100%" mih={0}>
      <Table.ScrollContainer minWidth={0} w="100%">
        <Table horizontalSpacing="md" verticalSpacing="sm" stickyHeader>
          <Table.Thead fw={600} h={44}>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>ISU</Table.Th>
              <Table.Th>API Key Descriptor</Table.Th>
              <Table.Th ta="right">Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedItems.map((request) => (
              <Table.Tr
                key={request.id}
                onClick={() => onRequestDetail(request.id)}
                h={72}
                style={{ cursor: "pointer" }}
              >
                <Table.Td>{Case.title(request.api_operation)}</Table.Td>
                <Table.Td>{request.creds_external_username}</Table.Td>
                <Table.Td>{request.creds_internal_descriptor}</Table.Td>
                <Table.Td ta="right">
                  {new Date(request.invoked_at).toLocaleString()}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Pagination
        total={totalPages}
        onChange={setActivePage}
        value={activePage}
      />
    </Flex>
  )
}
