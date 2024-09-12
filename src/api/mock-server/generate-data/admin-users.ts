import { faker } from "@faker-js/faker"

import { UserSchemaDTO } from "../../services/users/users.dto"

export const generateAdminUser = (): UserSchemaDTO => {
  return {
    id: crypto.randomUUID(),
    updated_at: faker.date.recent({ days: 10 }).toISOString(),
    email_address: faker.internet.email().toLowerCase(),
  }
}

export const generateAdminUsersArray = (
  arrayLength: number
): UserSchemaDTO[] => {
  return Array.from({ length: arrayLength }, generateAdminUser)
}
