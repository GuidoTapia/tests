import Case from "case"

export const breadcumbTitles = {
  home: "API Requests",
  requests: {
    index: "API Requests" as const,
    get: (apiOperation: string) => `${Case.title(apiOperation)}` as const,
  },
  internalCredentials: {
    index: "API Keys" as const,
    create: "New Key" as const,
    edit: "Edit Key" as const,
  },
  externalCredentials: {
    index: "Workday Credentials" as const,
    create: "New Credential" as const,
    edit: "Edit Credential" as const,
  },
}
