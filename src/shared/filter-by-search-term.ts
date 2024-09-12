import Case from "case"

export function filterBySearchTerm<
  T extends Record<string, string | null | undefined | Date | number | string[]>
>(items: T[], searchValue?: string): T[] {
  return (
    items?.filter((request) =>
      searchValue
        ? Object.values(request).some((value) => {
            if (!value) {
              return false
            }
            const valueLowerCase = value.toString().toLowerCase()
            return (
              valueLowerCase.includes(searchValue.toLowerCase()) ||
              Case.snake(valueLowerCase).includes(
                Case.snake(searchValue.toLowerCase())
              )
            )
          })
        : true
    ) ?? []
  )
}
