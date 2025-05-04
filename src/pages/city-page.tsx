import { WeatherData, ForecastData } from "@/api/types";
import CurrentWeather from "@/components/current-weather";
import FavoriteButton from "@/components/favorite-button";
import HourlyTemperature from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import WeatherDetails from "@/components/weather-details";
import { WeatherForecast } from "@/components/weather-forecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertCircle } from "lucide-react";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordiantes = { lat, lon };

  const weatherQuery = useWeatherQuery(coordiantes);
  const forecastQuery = useForecastQuery(coordiantes);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive" className="bg-transparent">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to load weather data. Please try again.</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <FavoriteButton
          data={{ ...weatherQuery.data, name: params.cityName }}
        />
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather data={weatherQuery.data as WeatherData} />

          <HourlyTemperature data={forecastQuery.data as ForecastData} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data as WeatherData} />
          <WeatherForecast data={forecastQuery.data as ForecastData} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
