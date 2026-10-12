import { TextField } from "@mui/material";
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
  multiline?: boolean;
  rows?: number;
  type?: string;
};

export default function AppTextInput<T extends FieldValues>({
  label,
  name,
  control,
  multiline,
  rows,
  type,
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <TextField
      {...field}
      value={field.value ?? ""}
      label={label}
      multiline={multiline}
      rows={rows}
      type={type}
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
}