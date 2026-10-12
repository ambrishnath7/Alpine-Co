import { createApi, type FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react"
import type { Product } from "../../app/models/product"
import { baseQueryWithErrorHandling } from "../../app/api/baseApi"
import type { ProductParams } from "../../app/models/productParams"
import { filterEmptyValues } from "../../lib/util/util"
import type { Pagination } from "../../app/models/pagination"

type Filters = {
  brands: string[]
  types: string[]
}

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    fetchProducts: builder.query<{ items: Product[]; pagination: Pagination }, ProductParams>({
      query: (productParams) => {
        return {
          url: 'products',
          params: filterEmptyValues(productParams)
        }
      },
      transformResponse: (items: Product[], meta?: FetchBaseQueryMeta) => {
        const paginationHeader = meta?.response?.headers.get('Pagination')
        const pagination = paginationHeader ? JSON.parse(paginationHeader) : null

        return { items, pagination }
      }
    }),
    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => ({
        url: `products/${productId}`
      })
    }),
    fetchFilters: builder.query<Filters, void>({
      query: () => ({
        url: 'products/filters'
      })
    })
  })
})

export const { useFetchProductsQuery, useFetchProductDetailsQuery, useFetchFiltersQuery } = catalogApi