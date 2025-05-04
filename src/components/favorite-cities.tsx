import { useFavorite } from "@/hooks/use-favorite";
import { useWeatherQuery } from "@/hooks/use-weather";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";
import React, { useRef } from "react";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

const FavoriteCities = () => {
  const { favorites, removeFavorite } = useFavorite();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.style.cursor = "grabbing";
    container.style.userSelect = "none";

    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - container.offsetLeft;
      const walk = (x - startX) * 1; // Adjust scroll speed if needed
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  if (!favorites.length) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        className="w-full pb-4 overflow-x-auto cursor-grab"
        style={{
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For Internet Explorer and Edge
        }}
      >
        <div className="flex gap-4 min-w-max">
          {favorites.map((city) => {
            return (
              <FavoriteCityTablet
                key={city.id}
                {...city}
                onRemove={() => removeFavorite.mutate(city.id)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  return (
    <div
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon${lon}`)}
      role="button"
      tabIndex={0}
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0  hover:text-destructive-foreground group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`Removed ${name} from Favorites.`);
        }}
      >
        <X className="h-4 w-4 " />
      </Button>

      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className="h-8 w-8"
            />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default FavoriteCities;
