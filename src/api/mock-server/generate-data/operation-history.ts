import { faker } from "@faker-js/faker"

import { ExternalCredentialsSchemaDTO } from "../../services/credentials/external-credentials.dto"
import { InternalCredentialsSchemaDTO } from "../../services/credentials/internal-credentials.dto"
import { RequestSchemaDTO } from "../../services/requests/requests.dto"
import { UserSchemaDTO } from "../../services/users/users.dto"
import { soapResponses } from "../static-data/soap-responses"

const WORK_DAY_EXAMPLE_URL =
  "https://mcguirevasquezandalexander.workday.com/ccx/service/mcguirevasquezandalexander/Payroll/v43.1"

const generateOperationHistory = (
  internalCredentials: InternalCredentialsSchemaDTO[],
  externalCredentials: ExternalCredentialsSchemaDTO[],
  adminUsers: UserSchemaDTO[]
): RequestSchemaDTO => {
  const internalCredential = faker.helpers.arrayElement(internalCredentials)
  const externalCredential = externalCredentials.find(
    ({ id }) => id === internalCredential.creds_external_id
  )
  const adminUser = adminUsers.find(
    ({ id }) => id === externalCredential?.user_admin_id
  )
  return {
    id: crypto.randomUUID(),
    status_code: faker.internet.httpStatusCode(),
    user_admin_id: externalCredential?.user_admin_id ?? "",
    user_admin_email_address: adminUser?.email_address ?? "",
    creds_external_id: internalCredential.creds_external_id,
    creds_external_descriptor: externalCredential?.descriptor ?? "",
    creds_external_username: externalCredential?.username ?? "",
    creds_internal_id: internalCredential.id,
    creds_internal_api_key_first_eight_chars:
      internalCredential.api_key_first_eight_chars,
    creds_internal_descriptor: internalCredential.descriptor,
    tenant: externalCredential?.tenant ?? "",
    api_operation: faker.helpers.arrayElement(
      internalCredential.api_operations_allowed
    ),

    derived_url: WORK_DAY_EXAMPLE_URL,
    originating_ip: faker.internet.ipv4(),
    invoked_at: faker.date.recent({ days: 10 }).toISOString(),

    request_sanitized: faker.helpers.arrayElement(soapResponses),
  }
}

export const generateOperationHistoryArray = (
  arrayLength: number,
  internalCredentials: InternalCredentialsSchemaDTO[],
  externalCredentials: ExternalCredentialsSchemaDTO[],
  adminUsers: UserSchemaDTO[]
): RequestSchemaDTO[] => {
  return Array.from({ length: arrayLength }, () =>
    generateOperationHistory(
      internalCredentials,
      externalCredentials,
      adminUsers
    )
  )
}
