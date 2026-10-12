import { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import { debounce } from "@mui/material/utils"
import { useAppDispatch, useAppSelector } from "../../app/store/store"
import { setSearchTerm } from "./catalogSlice"

export default function Search() {
  const { searchTerm } = useAppSelector((state) => state.catalog)
  const dispatch = useAppDispatch()
  const [term, setTerm] = useState(searchTerm)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTerm(searchTerm)
  }, [searchTerm])

  const debouncedSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(setSearchTerm(event.target.value))
    },
    500
  )

  return (
    <TextField
      label="Search products"
      type="search"
      variant="outlined"
      fullWidth
      value={term}
      onChange={(e) => {
        setTerm(e.target.value)
        debouncedSearch(e)
      }}
    />
  )
}