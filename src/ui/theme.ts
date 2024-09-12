import { MantineThemeOverride, NavLink, Paper, Table } from "@mantine/core"

export const mantineTheme: MantineThemeOverride = {
  defaultRadius: "sm",
  primaryColor: "dark",
  components: {
    NavLink: NavLink.extend({
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.sm,
        },
      }),
    }),
    Table: Table.extend({
      styles: {
        td: {
          verticalAlign: "middle",
        },
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "lg",
      },
    }),
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
  },
}
