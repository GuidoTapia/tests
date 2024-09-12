export const paths = {
  home: "/",
  requests: {
    index: "/" as const,
    get: (requestId: string) => `/requests/${requestId}` as const,
  },
  credentials: {
    index: "/credentials",
  },
}
