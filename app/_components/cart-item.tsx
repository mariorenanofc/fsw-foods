import Image from "next/image";
import { CartContext, CartProduct } from "../_context/cart";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/prices";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useContext } from "react";

interface CartItemProps {
  cartProcuct: CartProduct;
}

const CartItem = ({ cartProcuct }: CartItemProps) => {
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromCart,
  } = useContext(CartContext);

  const handleDecreaseQuantityClick = () =>
    decreaseProductQuantity(cartProcuct.id);

  const handleIncreaseQuantityClick = () =>
    increaseProductQuantity(cartProcuct.id);

  const handleRemoveClick = () => removeProductFromCart(cartProcuct.id);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/*Imagem e informações*/}
        <div className="relative h-20 w-20">
          <Image
            src={cartProcuct.imageUrl}
            alt={cartProcuct.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-xs">{cartProcuct.name}</h3>
          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold">
              {formatCurrency(
                calculateProductTotalPrice(cartProcuct) * cartProcuct.quantity,
              )}
            </h4>
            {cartProcuct.discountPercentage > 0 && (
              <span className="text- muted-foreground text-xs line-through">
                {formatCurrency(
                  Number(cartProcuct.price) * cartProcuct.quantity,
                )}
              </span>
            )}
          </div>

          {/* Quantidade */}
          <div className="flex items-center gap-3 text-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 border border-solid border-muted-foreground"
            >
              <ChevronLeftIcon
                size={17}
                onClick={handleDecreaseQuantityClick}
              />
            </Button>
            <span className="block w-3 text-xs">{cartProcuct.quantity}</span>
            <Button
              size="icon"
              className="h-6 w-6"
              onClick={handleIncreaseQuantityClick}
            >
              <ChevronRightIcon size={17} />
            </Button>
          </div>
        </div>
      </div>

      {/*Botão de Deletar*/}
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 border border-solid border-muted-foreground"
        onClick={handleRemoveClick}
      >
        <TrashIcon size={17} />
      </Button>
    </div>
  );
};

export default CartItem;
