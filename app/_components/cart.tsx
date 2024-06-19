import { useContext } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/prices";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const Cart = () => {
  const { products, subtotalPrice, totalPrice, totalDiscounts } =
    useContext(CartContext);
  return (
    <div className="flex h-full flex-col py-5">
      {products.length > 0 ? (
        <>
          <div className="flex-auto space-y-4">
            {products.map((product) => (
              <CartItem key={product.id} cartProcuct={product} />
            ))}
          </div>

          {/* Totais */}
          <div className="mt-6">
            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between  text-xs">
                  <span className=" text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotalPrice)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between  text-xs">
                  <span className=" text-muted-foreground">Descontos</span>
                  <span>- {formatCurrency(totalDiscounts)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between  text-xs">
                  <span className=" text-muted-foreground">Entrega</span>

                  {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                    <span className="uppercase text-primary">GRÁTIS</span>
                  ) : (
                    formatCurrency(Number(products?.[0].restaurant.deliveryFee))
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between  text-xs font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>

                <Separator />
              </CardContent>
            </Card>
          </div>

          {/* Finalizar Pedidos */}

          <Button className="mt-6 w-full">Finalizar pedido</Button>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[125px] w-[150px] rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px] bg-gray-200" />
              <Skeleton className="h-4 w-[100px] bg-gray-200" />
            </div>
          </div>
          <h2 className="mt-1 text-center font-medium">
            Sua Sacola está vazia
          </h2>
        </div>
      )}
    </div>
  );
};

export default Cart;
