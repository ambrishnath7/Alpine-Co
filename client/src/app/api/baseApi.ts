import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from "@reduxjs/toolkit/query/react"
import { toast } from "react-toastify"
import { startLoading, stopLoading } from "../layout/uiSlice"
import { router } from "../routes/Routes"

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include"
})

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000))

type ErrorResponse =
  | string
  | { title: string }
  | { errors: Record<string, string[]> }

export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  api.dispatch(startLoading())

  if (import.meta.env.DEV) {
    await sleep()
  }

  const result = await customBaseQuery(args, api, extraOptions)

  api.dispatch(stopLoading())

  if (result.error) {
    const originalStatus =
      result.error.status === "PARSING_ERROR" &&
      result.error.originalStatus
        ? result.error.originalStatus
        : result.error.status

    const responseData = result.error.data as ErrorResponse

    switch (originalStatus) {
      case 400:
        if (typeof responseData === "string") {
          toast.error(responseData)
        } else if ("errors" in responseData) {
          throw new Error(
            Object.values(responseData.errors).flat().join(", ")
          )
        } else if ("title" in responseData) {
          toast.error(responseData.title)
        }
        break

      case 401:
        if (
          typeof responseData === "object" &&
          "title" in responseData
        ) {
          toast.error(responseData.title)
        }
        break

      case 403:
        toast.error("403 Forbidden")
        break

      case 404:
        router.navigate("/not-found")
        break

      case 500:
        if (typeof responseData === "object") {
          router.navigate("/server-error", {
            state: { error: responseData }
          })
        }
        break

      default:
        break
    }
  }

  return result
}