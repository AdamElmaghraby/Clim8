import { WeatherData } from "@/api/types";
import { useFavorite } from "@/hooks/use-favorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  data: WeatherData;
}

const FavoriteButton = ({ data }: FavoriteButtonProps) => {
  const { addFavorite, isFavorite, removeFavorite } = useFavorite();
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`, {
        onSuccess: () => {
          toast.error(`Removed ${data.name} from Favorites`);
        },
        onError: () => {
          toast.error(`Failed to remove ${data.name} from Favorites`);
        },
      });
    } else {
      addFavorite.mutate(
        {
          name: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          country: data.sys.country,
        },
        {
          onSuccess: () => {
            toast.success(`Added ${data.name} to Favorites`);
          },
          onError: () => {
            toast.error(`Failed to add ${data.name} to Favorites`);
          },
        }
      );
    }
  };

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size="icon"
      className={isCurrentlyFavorite ? "bg-blue-500 hover:bg-blue-600" : ""}
      onClick={handleToggleFavorite}
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "fill current" : ""}`}
      />
    </Button>
  );
};

export default FavoriteButton;
