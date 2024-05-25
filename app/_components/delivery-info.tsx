import { BikeIcon, TimerIcon } from "lucide-react";
import { Card } from "./ui/card";
import { formatCurrency } from "../_helpers/prices";
import { Restaurant } from "@prisma/client";

interface DeliveryInfoProps {
  restaurant: Pick<Restaurant, "deliveryFee" | "deliveryTimeMinutes">;
}

const DeliveryInfo = ({ restaurant }: DeliveryInfoProps) => {
  return (
    <Card className="mt-6 flex justify-around py-3">
      {/* Custo  */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">Entrega</span>
          <BikeIcon size={14} />
        </div>

        {Number(restaurant.deliveryFee) > 0 ? (
          <p className="front-semibold text-xs">
            {formatCurrency(Number(restaurant.deliveryFee))}
          </p>
        ) : (
          <p>Gratis</p>
        )}
      </div>
      {/* Tempo */}

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">Tempo</span>
          <TimerIcon size={14} />
        </div>

        <p className="front-semibold text-xs">
          {restaurant.deliveryTimeMinutes} min
        </p>
      </div>
    </Card>
  );
};

export default DeliveryInfo;
