import { faker } from "@faker-js/faker"

import { ExternalCredentialsSchemaDTO } from "../../services/credentials/external-credentials.dto"
import { InternalCredentialsSchemaDTO } from "../../services/credentials/internal-credentials.dto"
import { apiOperations } from "../static-data/api-operations"

const generateInternalCredential = (
  externalCredentials: ExternalCredentialsSchemaDTO[]
): InternalCredentialsSchemaDTO => {
  const externalCredential = faker.helpers.arrayElement(externalCredentials)

  return {
    id: crypto.randomUUID(),
    descriptor: `${faker.string.alphanumeric({
      length: { min: 6, max: 9 },
    })} API key`,
    creds_external_id: externalCredential.id,
    api_operations_allowed: faker.helpers.arrayElements(apiOperations, {
      min: 3,
      max: 6,
    }),
    api_key_first_eight_chars: faker.string.alphanumeric(8),
    api_key: faker.string.alphanumeric(40),
    updated_at: faker.date.recent({ days: 10 }).toISOString(),
    loaded_at: faker.date.recent({ days: 10 }).toISOString(),
    api_key_hash: faker.string.alphanumeric(40),
  }
}

export const generateInternalCredentialsArray = (
  arrayLength: number,
  externalCredentials: ExternalCredentialsSchemaDTO[]
): InternalCredentialsSchemaDTO[] => {
  return Array.from({ length: arrayLength }, () =>
    generateInternalCredential(externalCredentials)
  )
}
