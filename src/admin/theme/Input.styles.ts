import { type SxProps, type Theme } from '@mui/material';

export const inputSx: SxProps<Theme> = {
   backgroundColor: 'rgba(31, 31, 31, 0.25)',
   backdropFilter: 'blur(5px)',
   borderRadius: 1,
   mb: 2,
   '& .MuiInputBase-input': {
      color: 'white',
      fontSize: '1.05rem',
      fontWeight: 600,
   },
   '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: '#545454',
      color: '#545454',
   },
   '& .MuiInputLabel-root': {
      color: 'white',
      fontSize: '1rem',
      fontWeight: 600,
   },
   '& .MuiInputLabel-root.Mui-disabled': {
      color: '#545454',
   },
   '& .MuiSelect-select.Mui-disabled': {
      WebkitTextFillColor: '#545454',
      color: '#545454',
   },
   '& .MuiInputLabel-root.Mui-focused': {
      color: 'rgba(200, 200, 200, 1)',
   },
   '& .MuiOutlinedInput-root': {
      '& fieldset': {
         borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&:hover fieldset': {
         borderColor: 'rgba(255, 255, 255, 1)',
      },
      '&.Mui-focused fieldset': {
         borderColor: 'white',
      },
      '&.Mui-disabled fieldset': {
         borderColor: '#545454',
      },
   },
   '& .MuiFilledInput-root': {
      color: 'white',
      borderRadius: 1,
      border: '1px solid rgba(255, 255, 255, 0.9)',
   },
   '& .MuiFilledInput-root.Mui-disabled': {
      color: '#545454',
      border: '1px solid #545454',
   },
   '& .MuiFilledInput-root.Mui-focused': {
      border: '1px solid rgba(200, 200, 200, 1)',
   },
   '& .MuiFilledInput-root:before': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.9)',
   },
   '& .MuiFilledInput-root:after': {
      borderBottom: '1px solid rgba(200, 200, 200, 1)',
   },
   '& .MuiFilledInput-root.Mui-disabled:before': {
      borderBottom: '1px solid #545454',
   },
   '& .MuiFilledInput-root.Mui-disabled:after': {
      borderBottom: '1px solid #545454',
   },
   '& .MuiSvgIcon-root': {
      color: 'white',
   },
   '& .MuiSvgIcon-root.Mui-disabled': {
      color: '#545454',
   },
};

export const switchSx: SxProps<Theme> = {
   '& .MuiSwitch-switchBase.Mui-disabled': {
      color: '#545454',
   },
   '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
      color: '#545454',
   },
   '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
      backgroundColor: '#545454',
      opacity: 0.5,
   },
   '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled + .MuiSwitch-track': {
      backgroundColor: '#545454',
      opacity: 0.5,
   },
   '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#30d738',
   },
   '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#30d738',
      opacity: 0.6,
   },
   '& .MuiSwitch-track': {
      backgroundColor: 'white',
      opacity: 0.4,
   },
};
