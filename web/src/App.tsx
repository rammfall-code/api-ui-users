import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Content } from "./Content.tsx";

const theme = createTheme();
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Content />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
