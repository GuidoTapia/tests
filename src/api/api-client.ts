import { ApiFetcher, initContract, tsRestFetchApi } from "@ts-rest/core"
import { initTsrReactQuery } from "@ts-rest/react-query/v5"
import { z } from "zod"

import { mockTsRestFetchApi } from "./mock-server/mock-ts-rest-fetch-api"
import { externalCredentialSchema } from "./services/credentials/external-credentials.dto"
import { internalCredentialSchema } from "./services/credentials/internal-credentials.dto"
import { requestSchema } from "./services/requests/requests.dto"
import { userSchema } from "./services/users/users.dto"

const c = initContract()

export const contract = c.router({
  // API Operation History
  getAPIOperationHistory: {
    method: "GET",
    path: "/api_operation_history",
    query: z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
      search: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    }),
    responses: {
      200: z.object({
        next_cursor: z.string().uuid(),
        total_records: z.number().int(),
        total_pages: z.number().int(),
        results: requestSchema.array(),
      }),
    },
    summary: "Get API operation history",
  },
  getAPIOperationHistoryById: {
    method: "GET",
    path: "/api_operation_history/:id",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      200: requestSchema,
    },
    summary: "Get Operation Log by ID",
  },
  // Credentials External
  getCredentialsExternal: {
    method: "GET",
    path: "/creds_external",
    responses: {
      200: externalCredentialSchema.array(),
    },
    summary: "Get External Credentials List",
  },
  getCredentialsExternalById: {
    method: "GET",
    path: "/creds_external/:id",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      200: externalCredentialSchema,
    },
    summary: "Get External Credential by ID",
  },
  createCredentialsExternal: {
    method: "POST",
    path: "/creds_external",
    responses: {
      200: externalCredentialSchema,
    },
    body: z.object({
      descriptor: z.string(),
      user_admin_id: z.string().uuid(),
      username: z.string(),
      password: z.string(),
      tenant: z.string(),
    }),
    summary: "Create Internal Credential by ID",
  },
  updateCredentialsExternal: {
    method: "PATCH",
    path: "/creds_external/:id",
    responses: {
      200: externalCredentialSchema,
    },
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      descriptor: z.string(),
    }),
    summary: "Update External Credential by ID",
  },
  deleteCredentialsExternal: {
    method: "DELETE",
    path: "/creds_external/:id",
    responses: {
      200: externalCredentialSchema,
    },
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.undefined(),
    summary: "Delete External Credential by ID",
  },
  // Credentials Internal
  getCredentialsInternal: {
    method: "GET",
    path: "/creds_internal",
    responses: {
      200: internalCredentialSchema.array(),
    },
    summary: "Get Internal Credentials List",
  },
  getCredentialsInternalById: {
    method: "GET",
    path: "/creds_internal/:id",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      200: internalCredentialSchema,
    },
    summary: "Get Internal Credential by ID",
  },
  createCredentialsInternal: {
    method: "POST",
    path: "/creds_internal",
    responses: {
      200: internalCredentialSchema,
    },
    body: z.object({
      descriptor: z.string(),
      creds_external_id: z.string().uuid(),
      api_operations_allowed: z.array(z.string()),
    }),
    summary: "Create Internal Credential by ID",
  },
  updateCredentialsInternal: {
    method: "PATCH",
    path: "/creds_internal/:id",
    responses: {
      200: internalCredentialSchema,
    },
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      descriptor: z.string(),
      api_operations_allowed: z.array(z.string()),
    }),
    summary: "Update Internal Credential by ID",
  },
  deleteCredentialsInternal: {
    method: "DELETE",
    path: "/creds_internal/:id",
    responses: {
      200: internalCredentialSchema,
    },
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.undefined(),
    summary: "Delete Internal Credential by ID",
  },
  // Users
  getUserAdmins: {
    method: "GET",
    path: "/user_admins",
    responses: {
      200: userSchema.array(),
    },
    summary: "Get Users List",
  },
})

export const tsr = initTsrReactQuery(contract, {
  baseUrl: `${import.meta.env.VITE_JANUS_API_1_ORIGIN}${
    import.meta.env.VITE_SERVICE_ALB_LISTENER_PATH_PREFIX
  }`,
  baseHeaders: {},
  api: Number(import.meta.env.VITE_USE_MOCK_API)
    ? (mockTsRestFetchApi as unknown as ApiFetcher)
    : tsRestFetchApi,
})
