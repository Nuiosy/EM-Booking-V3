import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { cn } from '@/lib/utils';

// Configure dayjs to use German locale
dayjs.locale('de');

// Create a custom theme that matches shadcn UI design
const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          backgroundColor: 'transparent',
          border: '1px solid hsl(var(--input))',
          transition: 'all 150ms',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          '&:hover': {
            borderColor: 'hsl(var(--input))',
            backgroundColor: 'hsl(var(--muted))',
          },
          '&.Mui-focused': {
            borderColor: 'hsl(var(--ring))',
            boxShadow: '0 0 0 1px hsl(var(--ring))',
            '--tw-ring-offset-shadow': '0 0 0 0px hsl(var(--background))',
            '--tw-ring-shadow': '0 0 0 1px hsl(var(--ring))',
          },
        },
        input: {
          padding: '0.5rem 0.75rem',
          height: '2.5rem',
          '&::placeholder': {
            color: 'hsl(var(--muted-foreground))',
          },
        },
        notchedOutline: {
          border: 'none',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          position: 'relative',
          fontSize: '0.875rem',
          color: 'hsl(var(--muted-foreground))',
          transform: 'none',
          position: 'static',
          marginBottom: '0.5rem',
          '&.Mui-focused': {
            color: 'hsl(var(--muted-foreground))',
          },
          '&.MuiFormLabel-filled': {
            transform: 'none',
          },
        },
      },
    },
  },
});

interface TimePickerProps {
  date?: Date;
  setDate: (date: Date) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export function TimePicker({ 
  date, 
  setDate, 
  error, 
  label = "Zeit",
  placeholder = "HH:mm"
}: TimePickerProps) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="relative space-y-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </div>
          <TimeField
            value={date ? dayjs(date) : null}
            onChange={(newValue) => {
              if (newValue && newValue.isValid()) {
                setDate(newValue.toDate());
              }
            }}
            format="HH:mm"
            hiddenLabel
            slotProps={{
              textField: {
                placeholder: placeholder,
                error: !!error,
                fullWidth: true,
                size: "small",
                sx: {
                  '& .MuiInputBase-root': {
                    height: '40px',
                  },
                },
              },
            }}
          />
          {error && (
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}