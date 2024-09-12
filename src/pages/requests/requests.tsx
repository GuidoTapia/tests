import {
  Divider,
  Flex,
  Loader,
  Text,
  TextInput,
  useMatches,
} from "@mantine/core"
import { DatePickerValue } from "@mantine/dates"
import { useDebouncedState } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"
import dayjs from "dayjs"
import { ChangeEventHandler, useState } from "react"

import { tsr } from "../../api/api-client"
import { BreadCrumbHeader } from "../../ui/breadcumb-header/breadcumb-header"
import { breadcumbTitles } from "../../ui/breadcumb-header/breadcumb-titles"
import { DatePickerInput } from "../../ui/date-picker-input/date-picker-input"
import { EmptyState } from "../../ui/empty-state/empty-state"
import { RequestsPaginatedTable } from "./requests-paginated-table"

const CURRENT_DATE = new Date()
export const PAGE_SIZE = 10

export const Requests = () => {
  const [activePage, setActivePage] = useState(1)
  const [searchValue, setSearchValue] = useDebouncedState<string>("", 500)
  const [dateRangeValue, setDateRangeValue] = useState<
    DatePickerValue<"range">
  >([null, null])

  const isMobile = useMatches({
    base: true,
    md: true,
    lg: false,
    xl: false,
  })

  const startDate =
    dateRangeValue[0] && dateRangeValue[1]
      ? dayjs(dateRangeValue[0]).format("YYYY-MM-DD")
      : undefined
  const endDate =
    dateRangeValue[0] && dateRangeValue[1]
      ? dayjs(dateRangeValue[1]).format("YYYY-MM-DD")
      : undefined

  const { data: queryData, isFetching: historyLoading } =
    tsr.getAPIOperationHistory.useQuery({
      queryKey: [
        "getAPIOperationHistory",
        activePage,
        searchValue,
        startDate,
        endDate,
      ],
      queryData: {
        query: {
          page: activePage,
          limit: PAGE_SIZE,
          search: searchValue,
          start_date: startDate,
          end_date: endDate,
        },
      },
      enabled: Boolean(dateRangeValue[0]) === Boolean(dateRangeValue[1]),
    })

  const onSearch: ChangeEventHandler<HTMLInputElement> = (event) => {
    setActivePage(1)
    setSearchValue(event.currentTarget.value)
  }

  const totalItems = queryData?.body.total_records || 0

  let content = null

  if (queryData?.body.results.length) {
    content = (
      <RequestsPaginatedTable
        items={queryData?.body.results}
        totalPages={queryData?.body.total_pages}
        activePage={activePage}
        setActivePage={setActivePage}
      />
    )
  } else if (historyLoading) {
    content = (
      <Flex justify="center" align="center" w="100%" h={400}>
        <Loader />
      </Flex>
    )
  } else {
    content = <EmptyState />
  }

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
          { title: breadcumbTitles.requests.index, label: "stormloop_dpt1" },
        ]}
        sideComponent={
          <Flex gap="sm" ml="sm">
            <Divider orientation="vertical" />
            {totalItems ? (
              <Text size="sm" fw={600}>
                Showing {(activePage - 1) * PAGE_SIZE + 1}-
                {Math.min(activePage * PAGE_SIZE, totalItems)} of {totalItems}
              </Text>
            ) : (
              <Text size="sm" fw={600}>
                Showing 0 of 0
              </Text>
            )}
          </Flex>
        }
        right={
          <Flex gap="sm" flex={1} justify="flex-end" miw={400}>
            <TextInput
              placeholder="Search"
              leftSection={<IconSearch size={20} />}
              size="md"
              onChange={onSearch}
              flex={isMobile ? 1 : undefined}
            />
            <DatePickerInput
              placeholder="Pick Date"
              inputSize="md"
              maxDate={CURRENT_DATE}
              value={dateRangeValue}
              onChange={(range) => {
                setActivePage(1)
                setDateRangeValue(range)
              }}
              menuPosition="bottom-end"
              inputWidth="280px"
              hideDateValue={isMobile}
              allowSingleDateInRange
              clearable
            />
          </Flex>
        }
      />
      {content}
    </Flex>
  )
}
