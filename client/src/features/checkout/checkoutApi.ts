import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "../../app/api/baseApi"
import { basketApi } from "../basket/basketApi"
import type { Basket } from "../../app/models/basket"

export const checkoutApi = createApi({
  reducerPath: "checkoutApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<Basket, void>({
      query: () => ({
        url: "payments",
        method: "POST"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(
            basketApi.util.updateQueryData(
              "fetchBasket",
              undefined,
              (draft) => {
                draft.clientSecret = data.clientSecret
              }
            )
          )
        } catch (error) {
          console.log("Payment intent creation failed:", error)
        }
      }
    })
  })
})

export const {
  useCreatePaymentIntentMutation
} = checkoutApi