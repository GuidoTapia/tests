export enum HttpStatusCategoryEnum {
  INFORMATIONAL = 1,
  SUCCESS = 2,
  REDIRECTION = 3,
  CLIENT_ERROR = 4,
  SERVER_ERROR = 5,
}

export type HttpStatusCategory = keyof typeof HttpStatusCategoryEnum

export function getHttpStatusCategory(
  code: number | string
): HttpStatusCategory | undefined {
  const firstDigit = Number(code.toString()[0])
  return HttpStatusCategoryEnum[firstDigit] as HttpStatusCategory | undefined
}
