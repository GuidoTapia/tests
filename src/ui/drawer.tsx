import {
  Box,
  Drawer as MantineDrawer,
  DrawerProps as MantineDrawerProps,
  useMantineTheme,
} from "@mantine/core"

interface DrawerProps extends MantineDrawerProps {
  title: string
  options: React.ReactNode
}

export const Drawer = (props: DrawerProps) => {
  const { children, title, opened, onClose, options, ...rest } = props

  const theme = useMantineTheme()

  return (
    <MantineDrawer
      opened={opened}
      onClose={onClose}
      title={title}
      size={480}
      position="right"
      closeOnEscape={false}
      padding="lg"
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
        },
        header: {
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
          height: 60,
        },
        body: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
          padding: 0,
        },
      }}
      {...rest}
    >
      <Box p="lg" flex={1} style={{ overflowY: "scroll" }}>
        {children}
      </Box>
      <Box p="lg" style={{ borderTop: `1px solid ${theme.colors.gray[3]}` }}>
        {options}
      </Box>
    </MantineDrawer>
  )
}
