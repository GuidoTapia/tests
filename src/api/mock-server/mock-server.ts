import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import dayjs from "dayjs"

import { RequestSchemaDTO } from "../services/requests/requests.dto"
import {
  getByIdFunction,
  getListFunction,
  patchFunction,
  postFunction,
} from "./generic-requests"

export enum Entities {
  ADMIN_USERS = "ADMIN_USERS",
  EXTERNAL_CREDENTIALS = "EXTERNAL_CREDENTIALS",
  INTERNAL_CREDENTIALS = "INTERNAL_CREDENTIALS",
  OPERATION_HISTORY = "OPERATION_HISTORY",
}

const paths = {
  adminUsers: "/user_admins",
  externalCredentials: "/creds_external",
  internalCredentials: "/creds_internal",
  operationHistory: /\/api_operation_history(\?(.*))?$/,
  adminUsersById: /\/user_admins\/(.*)/,
  externalCredentialsById: /\/creds_external\/(.*)/,
  internalCredentialsById: /\/creds_internal\/(.*)/,
  operationHistoryById: /\/api_operation_history\/(.*)/,
}

export const axiosMockInstance = axios.create({
  baseURL: `${import.meta.env.VITE_JANUS_API_1_ORIGIN}${
    import.meta.env.VITE_SERVICE_ALB_LISTENER_PATH_PREFIX
  }`,
})

export const axiosMockAdapterInstance = new MockAdapter(axiosMockInstance, {
  delayResponse: 1000,
})

axiosMockAdapterInstance
  .onGet(paths.adminUsers)
  .reply(getListFunction(Entities.ADMIN_USERS))
axiosMockAdapterInstance
  .onGet(paths.externalCredentials)
  .reply(getListFunction(Entities.EXTERNAL_CREDENTIALS))
axiosMockAdapterInstance
  .onGet(paths.internalCredentials)
  .reply(getListFunction(Entities.INTERNAL_CREDENTIALS))
axiosMockAdapterInstance.onGet(paths.operationHistory).reply((args) => {
  const [, stringParams] = args.url?.split("?") ?? []
  const params = Object.fromEntries(
    stringParams.split("&").map((param) => param.split("="))
  ) as Record<string, string>

  const page = Number(params.page) ?? 1
  const pageSize = Number(params.limit) ?? 10

  const localStorageResult = localStorage.getItem(Entities.OPERATION_HISTORY)
  if (localStorageResult) {
    const storedItems = JSON.parse(localStorageResult) as RequestSchemaDTO[]

    const items = storedItems.filter((item) => {
      if (
        params.search &&
        !item.api_operation.toLowerCase().includes(params.search.toLowerCase())
      ) {
        return false
      }
      if (
        params.start_date &&
        dayjs(item.invoked_at).isBefore(params.start_date, "day")
      ) {
        return false
      }
      if (
        params.end_date &&
        dayjs(item.invoked_at).isAfter(params.end_date, "day")
      ) {
        return false
      }
      return item
    })

    return [
      200,
      {
        total_records: items.length,
        total_pages: Math.ceil(items.length / pageSize),
        results: items.slice((page - 1) * pageSize, page * pageSize),
      },
    ]
  }
  return [404]
})

axiosMockAdapterInstance
  .onGet(paths.operationHistoryById)
  .reply(getByIdFunction(Entities.OPERATION_HISTORY))
axiosMockAdapterInstance
  .onGet(paths.internalCredentialsById)
  .reply(getByIdFunction(Entities.INTERNAL_CREDENTIALS))
axiosMockAdapterInstance
  .onGet(paths.externalCredentialsById)
  .reply(getByIdFunction(Entities.EXTERNAL_CREDENTIALS))
axiosMockAdapterInstance
  .onGet(paths.adminUsersById)
  .reply(getByIdFunction(Entities.ADMIN_USERS))

axiosMockAdapterInstance.onPost(paths.internalCredentials).reply(
  postFunction(
    Entities.INTERNAL_CREDENTIALS,
    ["creds_external_id", "descriptor", "api_operations_allowed"],
    {
      id: crypto.randomUUID(),
      updated_at: new Date(),
      loaded_at: new Date(),
    }
  )
)
axiosMockAdapterInstance.onPost(paths.externalCredentials).reply(
  postFunction(
    Entities.EXTERNAL_CREDENTIALS,
    ["user_admin_id", "tenant", "descriptor", "username", "password"],
    {
      id: crypto.randomUUID(),
      updated_at: new Date(),
      loaded_at: new Date(),
      api_key_first_eight_chars: crypto.randomUUID().slice(0, 8),
      api_key_hash: `${crypto.randomUUID()}${crypto.randomUUID()}`,
    }
  )
)

axiosMockAdapterInstance.onPatch(paths.internalCredentialsById).reply(
  patchFunction(
    Entities.INTERNAL_CREDENTIALS,
    ["descriptor", "api_operations_allowed"],
    {
      updated_at: new Date(),
    }
  )
)
axiosMockAdapterInstance.onPatch(paths.externalCredentialsById).reply(
  patchFunction(Entities.EXTERNAL_CREDENTIALS, ["descriptor"], {
    updated_at: new Date(),
  })
)
