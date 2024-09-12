import {
  ActionIcon,
  Divider,
  Flex,
  FloatingPosition,
  MantineSize,
  Menu,
  StyleProp,
  TextInput,
} from "@mantine/core"
import {
  DatePickerProps,
  DatesRangeValue,
  DatePicker as MantineDatePicker,
} from "@mantine/dates"
import { IconCalendar, IconX } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useState } from "react"

import {
  DateInterval,
  DateIntervalItem,
  dateIntervalMap,
} from "./date-interval-item"

const CURRENT_DATE = new Date()

const getLowerCaseWithoutSpaces = (text: string): string =>
  text.toLowerCase().replaceAll(/[\t .-_]+/g, "")

const getFormattedDateRange = (dateRange: DatesRangeValue) => {
  const dateRangeStart = dateRange[0]
    ? dayjs(dateRange[0]).format("MM/DD/YYYY")
    : null
  const dateRangeEnd = dateRange[1]
    ? dayjs(dateRange[1]).format("MM/DD/YYYY")
    : null

  if (dateRangeStart && dateRangeEnd && dateRangeStart !== dateRangeEnd) {
    return `${dateRangeStart} - ${dateRangeEnd}`
  }
  if (dateRangeStart) {
    return dateRangeStart
  }
  return ""
}

type DatePickerInputProps = DatePickerProps<"range"> & {
  placeholder: string
  inputSize: MantineSize
  onChange: (dateRange: DatesRangeValue) => void
  menuPosition?: FloatingPosition
  clearable?: boolean
  inputWidth?: StyleProp<React.CSSProperties["width"]>
  hideDateValue?: boolean
}

export const DatePickerInput = (props: DatePickerInputProps) => {
  const {
    placeholder,
    inputSize,
    menuPosition,
    clearable,
    onChange,
    value,
    inputWidth,
    hideDateValue,
    ...datePickerProps
  } = props

  const [textValue, setTextValue] = useState<string>("")
  const [dateInterval, setDateInterval] = useState<DateInterval | null>(null)

  const onChangeDateInterval = (interval: DateInterval) => {
    setDateInterval(interval)
    const currentDate = dayjs(CURRENT_DATE)
    switch (interval) {
      case "TODAY": {
        onChange([
          currentDate.startOf("day").toDate(),
          currentDate.endOf("day").toDate(),
        ])
        setTextValue(dateIntervalMap[interval])
        break
      }
      case "THIS_WEEK": {
        onChange([
          currentDate.startOf("week").toDate(),
          currentDate.endOf("day").toDate(),
        ])
        setTextValue(dateIntervalMap[interval])
        break
      }
      case "THIS_MONTH": {
        onChange([
          currentDate.startOf("month").toDate(),
          currentDate.endOf("day").toDate(),
        ])
        setTextValue(dateIntervalMap[interval])
        break
      }
      case "THIS_YEAR": {
        onChange([
          currentDate.startOf("year").toDate(),
          currentDate.endOf("day").toDate(),
        ])
        setTextValue(dateIntervalMap[interval])
        break
      }
      default: {
        onChange([null, null])
        setTextValue("")
        break
      }
    }
  }

  const onChangeDateRange = (dateRange: DatesRangeValue) => {
    setTextValue(getFormattedDateRange(dateRange))
    setDateInterval(null)
    onChange(dateRange)
  }

  const onBlurTextInput = () => {
    const intervalKey = (Object.keys(dateIntervalMap) as DateInterval[]).find(
      (key) => {
        const formattedTextValue = getLowerCaseWithoutSpaces(textValue)

        return (
          formattedTextValue === getLowerCaseWithoutSpaces(key) ||
          formattedTextValue === getLowerCaseWithoutSpaces(dateIntervalMap[key])
        )
      }
    )

    if (intervalKey) {
      onChangeDateInterval(intervalKey)
      return
    }

    const [dateRangeStart, dateRangeEnd] = textValue.split("-").map((date) => {
      const formattedDate = dayjs(date)
      return formattedDate.isValid() ? formattedDate : null
    })

    if (
      dateRangeStart &&
      dateRangeEnd &&
      !dateRangeStart.isSame(dateRangeEnd, "day")
    ) {
      const newDateRange: [Date, Date] = dateRangeStart.isBefore(dateRangeEnd)
        ? [dateRangeStart.toDate(), dateRangeEnd.toDate()]
        : [dateRangeEnd.toDate(), dateRangeStart.toDate()]
      onChange(newDateRange)
      setTextValue(getFormattedDateRange(newDateRange))
      return
    }

    if (dateRangeStart) {
      const newDateRange: [Date, null] = [dateRangeStart.toDate(), null]
      onChange(newDateRange)
      setTextValue(getFormattedDateRange(newDateRange))
      return
    }

    onChange([null, null])
    setTextValue("")
    setDateInterval(null)
  }

  const onCloseDropdown = () => {
    if (value && value[0] && !value[1]) {
      onChange([value[0], value[0]])
    }
  }

  const onClearDateRange = () => {
    setTextValue("")
    setDateInterval(null)
    onChange([null, null])
  }

  return (
    <Menu
      position={menuPosition}
      trapFocus={false}
      onClose={onCloseDropdown}
      returnFocus
    >
      <Menu.Target>
        {hideDateValue ? (
          <ActionIcon variant="default" size="xl">
            <IconCalendar size={20} />
          </ActionIcon>
        ) : (
          <TextInput
            placeholder={placeholder}
            leftSection={<IconCalendar size={20} />}
            size={inputSize}
            value={textValue}
            onChange={(event) => setTextValue(event.currentTarget.value)}
            onBlur={onBlurTextInput}
            rightSection={
              clearable && value && value[0] ? (
                <ActionIcon
                  variant="transparent"
                  onClick={onClearDateRange}
                  color="gray"
                >
                  <IconX size={20} />
                </ActionIcon>
              ) : undefined
            }
            w={inputWidth ?? "280px"}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur()
            }}
            pointer
          />
        )}
      </Menu.Target>
      <Menu.Dropdown>
        <Flex gap="sm">
          <Flex direction="column" gap="sm">
            <DateIntervalItem
              value="TODAY"
              onChange={onChangeDateInterval}
              currentDateInterval={dateInterval}
            />
            <DateIntervalItem
              value="THIS_WEEK"
              onChange={onChangeDateInterval}
              currentDateInterval={dateInterval}
            />
            <DateIntervalItem
              value="THIS_MONTH"
              onChange={onChangeDateInterval}
              currentDateInterval={dateInterval}
            />
            <DateIntervalItem
              value="THIS_YEAR"
              onChange={onChangeDateInterval}
              currentDateInterval={dateInterval}
            />
          </Flex>
          <Divider orientation="vertical" />
          <MantineDatePicker
            {...datePickerProps}
            value={value}
            type="range"
            onChange={onChangeDateRange}
          />
        </Flex>
      </Menu.Dropdown>
    </Menu>
  )
}
