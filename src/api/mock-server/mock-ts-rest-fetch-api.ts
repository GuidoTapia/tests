import { ApiFetcherArgs } from "@ts-rest/core"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError, AxiosResponse, Method, isAxiosError } from "axios"

import { axiosMockInstance } from "./mock-server"

export const mockTsRestFetchApi = async ({
  path,
  method,
  headers,
  body,
  fetchOptions,
}: ApiFetcherArgs) => {
  try {
    const result = await axiosMockInstance.request({
      ...fetchOptions,
      signal: fetchOptions?.signal || undefined,
      method: method as Method,
      url: path,
      headers,
      data: body,
    })
    return {
      status: result.status,
      body: result.data as unknown,
      headers: result.headers,
    }
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  } catch (error: Error | AxiosError | unknown) {
    if (isAxiosError(error)) {
      const response = error.response as AxiosResponse
      return {
        status: response.status,
        body: response.data as unknown,
        headers: response.headers,
      }
    }
    throw error
  }
}
