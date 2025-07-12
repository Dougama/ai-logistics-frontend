import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
