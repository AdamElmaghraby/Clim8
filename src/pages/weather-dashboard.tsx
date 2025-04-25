import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { RefreshCcw } from "lucide-react";
import React from "react";

const WeatherDashboard = () => {
  const { coordinates, error, getLocation, isLoading } = useGeolocation();
  console.log(coordinates);

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={`outline`}
          size={`icon`}
          onClick={handleRefresh}
          /*disabled={}*/
        >
          <RefreshCcw className="h-4 w-4"></RefreshCcw>
        </Button>
      </div>
      {/* Current Weather */}
    </div>
  );
};

export default WeatherDashboard;
