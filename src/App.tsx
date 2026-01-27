import { SnackbarProvider } from 'notistack';

import { ThemeProvider } from './shared/theme/ThemeProvider';
import Mapper from "./Mapper";
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Mapper />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

