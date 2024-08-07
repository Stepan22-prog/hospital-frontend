import { FormControl, InputLabel, MenuItem, Select as SelectComponent } from "@mui/material";
import { Control, Controller } from "react-hook-form";

type SelectProps = {
  control: Control<any>;
  label: string;
  required?: boolean;
  defaultValue: string;
  options: Array<string | { value: number, text: string }>;
}

export default function Select({control, label, defaultValue, options, required = true}: SelectProps) {
  return (
    <Controller
      name={label.toLowerCase()}
      control={control}
      rules={{
        required,
      }}
      defaultValue={defaultValue}
      render={({
        field: { onChange, value },
        fieldState: { error },
      }) => (
        <FormControl 
          fullWidth 
          required={required} 
          size="small"
          margin="dense"
        >
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <SelectComponent
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label={label}
            onChange={onChange}
          >
            {options.map(option =>
              typeof option === "string" ?
              <MenuItem key={option} value={option}>{option}</MenuItem>
              : <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
            )}
          </SelectComponent>
        </FormControl>
      )}
    />
  )
}
