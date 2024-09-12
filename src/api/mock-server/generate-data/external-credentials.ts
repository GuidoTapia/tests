import { faker } from "@faker-js/faker"

import { ExternalCredentialsSchemaDTO } from "../../services/credentials/external-credentials.dto"
import { UserSchemaDTO } from "../../services/users/users.dto"
import { tenants } from "../static-data/tenants"

const generateExternalCredential = (
  adminUsers: UserSchemaDTO[]
): ExternalCredentialsSchemaDTO => {
  const user = faker.helpers.arrayElement(adminUsers)

  return {
    user_admin_id: user.id,
    id: crypto.randomUUID(),
    descriptor: `Workday Cred ${faker.string.alphanumeric()}`,
    username: `${faker.internet.userName()}ISU`,
    loaded_at: faker.date.recent({ days: 10 }).toISOString(),
    tenant: faker.helpers.arrayElement(tenants),
    updated_at: faker.date.recent({ days: 10 }).toISOString(),
  }
}

export const generateExternalCredentialsArray = (
  arrayLength: number,
  adminUsers: UserSchemaDTO[]
): ExternalCredentialsSchemaDTO[] => {
  return Array.from({ length: arrayLength }, () =>
    generateExternalCredential(adminUsers)
  )
}
