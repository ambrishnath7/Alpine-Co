import FormControl from "@mui/material/FormControl"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"

type Props = {
  options: { value: string; label: string }[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  selectedValue: string
}

export default function RadioButtonGroup({ options, onChange, selectedValue }: Props) {
  return (
    <FormControl>
      <RadioGroup
        onChange={onChange}
        value={selectedValue}
        sx={{ my: 0 }}
      >
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={label}
            control={<Radio color="secondary" sx={{ py: 0.7 }} />}
            label={label}
            value={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}