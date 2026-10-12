import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadFile } from "@mui/icons-material";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
};

const dzStyles = {
  display: "flex",
  border: "dashed 2px #767676",
  borderColor: "#767676",
  borderRadius: "5px",
  paddingTop: "30px",
  alignItems: "center",
  height: 200,
  width: 500,
};

const dzActive = {
  borderColor: "green",
};

export default function AppDropzone<T extends FieldValues>({
  name,
  control,
}: Props<T>) {
  const { fieldState, field } = useController({ name, control });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const fileWithPreview = Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        });
        field.onChange(fileWithPreview);
      }
    },
    [field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <FormControl
        style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}
        error={!!fieldState.error}
      >
        <input {...getInputProps()} />
        <UploadFile sx={{ fontSize: "100px" }} />
        <Typography variant="h4">Drop image here</Typography>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </div>
  );
}