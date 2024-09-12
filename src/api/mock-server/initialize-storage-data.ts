import { generateAdminUsersArray } from "./generate-data/admin-users"
import { generateExternalCredentialsArray } from "./generate-data/external-credentials"
import { generateInternalCredentialsArray } from "./generate-data/internal-credentials"
import { generateOperationHistoryArray } from "./generate-data/operation-history"
import { Entities } from "./mock-server"

export const initializeLocalStorageData = () => {
  const adminUsers = generateAdminUsersArray(20)
  const externalCredentials = generateExternalCredentialsArray(40, adminUsers)
  const internalCredentials = generateInternalCredentialsArray(
    100,
    externalCredentials
  )
  const operationHistory = generateOperationHistoryArray(
    128,
    internalCredentials,
    externalCredentials,
    adminUsers
  )

  localStorage.setItem(Entities.ADMIN_USERS, JSON.stringify(adminUsers))
  localStorage.setItem(
    Entities.EXTERNAL_CREDENTIALS,
    JSON.stringify(externalCredentials)
  )
  localStorage.setItem(
    Entities.INTERNAL_CREDENTIALS,
    JSON.stringify(internalCredentials)
  )
  localStorage.setItem(
    Entities.OPERATION_HISTORY,
    JSON.stringify(operationHistory)
  )
}
