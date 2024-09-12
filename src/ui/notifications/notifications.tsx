import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

interface NotificationParams {
  message: string
  title?: string
}

export const showSuccessNotification = (params: NotificationParams) =>
  notifications.show({
    icon: <IconCheck />,
    color: "teal",
    position: "top-right",
    p: "md",
    ...params,
  })

export const showErrorNotification = (params: NotificationParams) =>
  notifications.show({
    icon: <IconX />,
    color: "red",
    position: "top-right",
    p: "md",
    ...params,
  })
