import "@mantine/code-highlight/styles.css"
import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import "@mantine/notifications/styles.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { tsr } from "./api/api-client"
import { initializeLocalStorageData } from "./api/mock-server/initialize-storage-data"
import "./index.css"
import { router } from "./router"
import { mantineTheme } from "./ui/theme"

const queryClient = new QueryClient()

if (Number(import.meta.env.VITE_USE_MOCK_API)) {
  initializeLocalStorageData()
} else {
  localStorage.clear()
}

createRoot(document.querySelector("#root") as Element).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>
        <MantineProvider theme={mantineTheme}>
          <ModalsProvider>
            <Notifications />
            <RouterProvider router={router} />
          </ModalsProvider>
        </MantineProvider>
      </tsr.ReactQueryProvider>
    </QueryClientProvider>
  </StrictMode>
)
