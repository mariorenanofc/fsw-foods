import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/prices";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartProps {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
}

const Cart = ({ setIsOpen }: CartProps) => {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { data } = useSession();

  const { products, subtotalPrice, totalPrice, totalDiscounts, clearCart } =
    useContext(CartContext);

  const handleFinishOrderClick = async () => {
    if (!data?.user) return;

    const restaurant = products[0].restaurant;

    try {
      setIsSubmitLoading(true);
      await createOrder({
        subtotalPrice,
        totalDiscounts,
        totalPrice,
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: { id: restaurant.id },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: data.user.id },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      clearCart();
      setIsOpen(false);

      toast("Pedido Realizado com sucesso!", {
        description: "Você vai ser direcionado ao Whatsapp, para comfirmação",
        action: {
          label: "Meus Pedidos",
          onClick: () => router.push("/my-orders"),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };
  return (
    <>
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
                      formatCurrency(
                        Number(products?.[0].restaurant.deliveryFee),
                      )
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

            <Button
              className="mt-6 w-full"
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={isSubmitLoading}
            >
              Finalizar pedido
            </Button>
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

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar seu pedido, ele sera enviado para o Whatsapp da
              empresa com a condição de confirmação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishOrderClick}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
