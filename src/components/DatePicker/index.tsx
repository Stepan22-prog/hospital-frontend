import dayjs from "dayjs";
import { Control, Controller } from "react-hook-form";
import { DatePicker as DatePickerUI } from '@mui/x-date-pickers';

type DatePickerProps = {
  label: string;
  control: Control<any>;
  required?: boolean;
  sx?: object;
}

export default function DatePicker({ label, control, required = true, sx }: DatePickerProps) {
  return (
    <Controller
      name={label.toLowerCase()}
      control={control}
      rules={{
        required,
      }}
      render={({
        field: { onChange, value },
      }) => (
        <DatePickerUI
          label={label}
          value={value ? dayjs(value): null}
          onChange={value => onChange(value?.toISOString())}
          slotProps={{ textField: { size: 'small' } }}
          sx={sx}
        />
      )}
    />
  )
}
