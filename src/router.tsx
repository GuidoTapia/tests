import { createBrowserRouter } from "react-router-dom"

import { Credentials } from "./pages/credentials/credentials"
import { RequestDetail } from "./pages/requests/request-detail/request-detail"
import { Requests } from "./pages/requests/requests"
import { paths } from "./shared/paths"
import { Layout } from "./ui/layout"

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: paths.home,
        element: <Requests />,
      },
      {
        path: paths.requests.get(":requestId"),
        element: <RequestDetail />,
      },
      {
        path: paths.credentials.index,
        element: <Credentials />,
      },
    ],
  },
])
