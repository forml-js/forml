import { useContext } from 'react';
import { MuiPickersAdapterContext } from '@mui/x-date-pickers';
export function usePickerUtils() {
    return useContext(MuiPickersAdapterContext).utils;
}
