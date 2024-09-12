import { Breadcrumbs, Flex, Text } from "@mantine/core"
import { IconSlash } from "@tabler/icons-react"
import { ReactNode } from "react"
import { Link } from "react-router-dom"

interface BreadCrumbHeaderProps {
  breadcrumbItems: {
    title: string | ReactNode
    href?: string
    label?: string
  }[]
  right?: JSX.Element
  sideComponent?: JSX.Element
}

export const BreadCrumbHeader = (props: BreadCrumbHeaderProps) => {
  const { breadcrumbItems, right, sideComponent } = props

  const items = breadcrumbItems.map(({ title, href, label }, index, array) => (
    <Flex key={index} gap="md" align="center">
      <Text
        size="xl"
        fw={index === array.length - 1 ? 600 : undefined}
        to={href ?? ""}
        component={href ? Link : undefined}
      >
        {title}
      </Text>
      {label ? (
        <Text size="lg" c="dimmed">
          {label}
        </Text>
      ) : null}
    </Flex>
  ))

  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      wrap="wrap"
      gap="lg"
    >
      <Flex direction="row" align="center">
        <Breadcrumbs separator={<IconSlash size={32} />}>{items}</Breadcrumbs>
        {sideComponent}
      </Flex>
      {right}
    </Flex>
  )
}
