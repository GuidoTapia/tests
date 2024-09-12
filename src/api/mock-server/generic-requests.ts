import { AxiosRequestConfig } from "axios"

import { Entities } from "./mock-server"

export const getListFunction = (entity: Entities) => () => {
  const localStorageResult = localStorage.getItem(entity)
  if (localStorageResult) {
    const items = JSON.parse(localStorageResult) as Record<string, unknown>[]
    return [200, items]
  }
  return [404]
}

export const getByIdFunction =
  (entity: Entities) => (config: AxiosRequestConfig) => {
    const id = config.url?.slice(config.url?.lastIndexOf("/") + 1)
    const localStorageResult = localStorage.getItem(entity)
    const items = localStorageResult
      ? (JSON.parse(localStorageResult) as Record<string, unknown>[])
      : []
    const result = items.find((item) => item.id === id)

    return result ? [200, result] : [404]
  }

export const postFunction =
  (
    entity: Entities,
    requiredFields: string[],
    fieldsToAdd?: Record<string, unknown>
  ) =>
  (config: AxiosRequestConfig) => {
    const data = JSON.parse(config.data as string) as Record<string, unknown>
    if (
      requiredFields.some((fieldName) => !Object.keys(data).includes(fieldName))
    ) {
      return [422]
    }

    const localStorageResult = localStorage.getItem(entity)
    const items = localStorageResult
      ? (JSON.parse(localStorageResult) as Record<string, unknown>[])
      : []
    const newObject = { ...data, ...fieldsToAdd }
    localStorage.setItem(entity, JSON.stringify([...items, newObject]))
    return [200, newObject]
  }

export const patchFunction =
  (
    entity: Entities,
    requiredFields: string[],
    fieldsToUpdate?: Record<string, unknown>
  ) =>
  (config: AxiosRequestConfig) => {
    const data = JSON.parse(config.data as string) as Record<string, unknown>
    if (
      requiredFields.some((fieldName) => !Object.keys(data).includes(fieldName))
    ) {
      return [422]
    }

    const id = config.url?.slice(config.url?.lastIndexOf("/") + 1)
    const localStorageResult = localStorage.getItem(entity)
    const items = localStorageResult
      ? (JSON.parse(localStorageResult) as Record<string, unknown>[])
      : []
    const itemIndex = items.findIndex((item) => item.id === id)

    if (itemIndex === -1) {
      return [404]
    }

    const result = items[itemIndex]
    const newObject = { ...result, ...data, ...fieldsToUpdate }
    items[itemIndex] = newObject
    localStorage.setItem(entity, JSON.stringify(items))

    return [200, newObject]
  }
