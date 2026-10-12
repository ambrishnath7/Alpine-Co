import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  items: string[];
};

export default function AppSelectInput<T extends FieldValues>({
  label,
  name,
  control,
  items,
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={field.value ?? ""}
        label={label}
        onChange={field.onChange}
        onBlur={field.onBlur}
      >
        {items.map((item, index) => (
          <MenuItem value={item} key={index}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}