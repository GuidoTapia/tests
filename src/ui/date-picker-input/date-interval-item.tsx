import { Menu } from "@mantine/core"

export type DateInterval = "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "THIS_YEAR"

export const dateIntervalMap: Record<DateInterval, string> = {
  TODAY: "Today",
  THIS_WEEK: "This week",
  THIS_MONTH: "This month",
  THIS_YEAR: "This year",
}

interface DateIntervalItemProps {
  value: DateInterval
  onChange: (dateInterval: DateInterval) => void
  currentDateInterval: DateInterval | null
}

export const DateIntervalItem = (props: DateIntervalItemProps) => {
  const { onChange, value, currentDateInterval } = props

  const onClick = () => {
    onChange(value)
  }

  return (
    <Menu.Item
      bg={currentDateInterval === value ? "gray" : undefined}
      onClick={onClick}
    >
      {dateIntervalMap[value]}
    </Menu.Item>
  )
}
