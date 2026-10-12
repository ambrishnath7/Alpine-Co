import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

export function filterEmptyValues(values: object) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => {
      if (typeof value === 'string') return value.length !== 0
      if (Array.isArray(value)) return value.length !== 0
      return value !== null && value !== undefined
    })
  )
}

export function handleApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldNames: Path<T>[]
) {
  const apiError = (error as { message?: string; data?: unknown }) || {}
  const message =
    typeof apiError.message === "string"
      ? apiError.message
      : typeof apiError.data === "string"
        ? apiError.data
        : undefined

  if (message) {
    const errorArray = message.split(",")

    errorArray.forEach((e) => {
      const matchedField = fieldNames.find((fieldName) =>
        e.toLowerCase().includes(fieldName.toString().toLowerCase())
      )

      if (matchedField) setError(matchedField, { message: e.trim() })
    })
  }
}