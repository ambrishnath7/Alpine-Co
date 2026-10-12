import { Fragment } from "react"
import ProductList from "./ProductList"
import { useFetchProductsQuery, useFetchFiltersQuery } from "./catalogApi"
import Filters from "./Filters"
import Grid from "@mui/material/Grid2"
import Typography from "@mui/material/Typography"
import { useAppDispatch, useAppSelector } from "../../app/store/store"
import { setPageNumber } from "./catalogSlice"
import AppPagination from "../../app/shared/components/AppPagination"

function Catalog() {
  const productParams = useAppSelector((state) => state.catalog)
  const { data, isLoading } = useFetchProductsQuery(productParams)
  const { data: filtersData, isLoading: filtersLoading } = useFetchFiltersQuery()
  const dispatch = useAppDispatch()

  if (isLoading || !data || filtersLoading || !filtersData) return <div>Loading...</div>

  return (
    <Grid container spacing={4}>
      <Grid size={3}>
        <Filters filtersData={filtersData} />
      </Grid>
      <Grid size={9}>
        {data.items.length > 0 ? (
          <Fragment>
            <ProductList products={data.items} />
            <AppPagination
              metadata={data.pagination}
              onPageChange={(page: number) => {
                dispatch(setPageNumber(page))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </Fragment>
        ) : (
          <Typography variant="h5">There are no results for this filter</Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default Catalog