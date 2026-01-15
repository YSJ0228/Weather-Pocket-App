import { Providers } from "./Providers";
import { WeatherDashboard } from "../widgets/weather-dashboard/ui/WeatherDashboard";

function App() {
  return (
    <Providers>
      <WeatherDashboard />
    </Providers>
  );
}

export default App;
