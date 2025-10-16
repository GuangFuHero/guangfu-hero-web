import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  mode: 'dark',
  palette: {
    primary: {
      main: '#C96319',
    },
    secondary: {
      main: '#252525',
    },
    light: {
      main: '#F7EBE0',
    },
    // info: {
    //     main: "#434343",
    // },
    // warning: {
    //     main: "#610900"
    // },
    error: {
      main: '#F23555',
    },
  },
});

export default theme;
