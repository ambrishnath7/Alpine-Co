import { configureStore } from "@reduxjs/toolkit"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook
} from "react-redux"

import { counterSlice } from "../../features/contact/counterReducer"
import { catalogApi } from "../../features/catalog/catalogApi"
import { errorApi } from "../../features/about/errorApi"
import { basketApi } from "../../features/basket/basketApi"
import { accountApi } from "../../features/accounts/accountApi"
import { checkoutApi } from "../../features/checkout/checkoutApi"
import { orderApi } from "../../features/orders/orderApi"
import { uiSlice } from "../layout/uiSlice"
import { catalogSlice } from "../../features/catalog/catalogSlice"
import { adminApi } from "../../features/admin/adminApi"

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    ui: uiSlice.reducer,
    catalog: catalogSlice.reducer,

    [catalogApi.reducerPath]: catalogApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [basketApi.reducerPath]: basketApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(catalogApi.middleware)
      .concat(errorApi.middleware)
      .concat(basketApi.middleware)
      .concat(accountApi.middleware)
      .concat(checkoutApi.middleware)
      .concat(orderApi.middleware)
      .concat(adminApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector