import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Search from "./Search"
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup"
import CheckboxButtons from "../../app/shared/components/CheckboxButtons"
import { useAppDispatch, useAppSelector } from "../../app/store/store"
import { setOrderBy, setBrands, setTypes, resetParams } from "./catalogSlice"

const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price: High to low' },
  { value: 'price', label: 'Price: Low to high' },
]

type Props = {
  filtersData: { brands: string[]; types: string[] }
}

export default function Filters({ filtersData: data }: Props) {
  const { orderBy, brands, types } = useAppSelector((state) => state.catalog)
  const dispatch = useAppDispatch()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper>
        <Search />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <RadioButtonGroup
          selectedValue={orderBy}
          options={sortOptions}
          onChange={(e) => dispatch(setOrderBy(e.target.value))}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={data.brands}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={data.types}
          checked={types}
          onChange={(items: string[]) => dispatch(setTypes(items))}
        />
      </Paper>

      <Button onClick={() => dispatch(resetParams())}>Reset filters</Button>
    </Box>
  )
}