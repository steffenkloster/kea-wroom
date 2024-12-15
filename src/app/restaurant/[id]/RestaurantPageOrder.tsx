"use client";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerPlaceOrder } from "@/lib/api/customers/customerPlaceOrder";
import { CartItem, RestaurantDTO } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const RestaurantPageOrder = ({ restaurant }: { restaurant: RestaurantDTO }) => {
  const router = useRouter();

  const addItemToCart = (itemId: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.itemId === itemId
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.itemId === itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevItems, { itemId, quantity: 1 }];
    });
  };

  const removeItemFromCart = (itemId: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.itemId === itemId
      );

      if (!existingItem) {
        return prevItems;
      }

      if (existingItem.quantity === 1) {
        return prevItems.filter((cartItem) => cartItem.itemId !== itemId);
      }

      return prevItems.map((cartItem) =>
        cartItem.itemId === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    });
  };

  const placeOrder = async () => {
    const response = await customerPlaceOrder(restaurant.id, cartItems, {
      setLoading
    });

    if (!response || !response.data) {
      return;
    }

    setLoading(true);
    toast.success("Order placed successfully!");
    router.push(`/orders/${response.data.id}`);
  };

  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const totalAmount = useMemo(() => {
    return cartItems
      .reduce((acc, item) => {
        const price =
          restaurant.items.find((i) => i.id === item.itemId)?.price || 0;
        return acc + price * item.quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems, restaurant.items]);

  return (
    <>
      <Section>
        <div className="max-w-screen-md mx-auto">
          <header className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h1>{restaurant.name}</h1>
              <p>
                {restaurant.description ||
                  "This restaurant has no description."}
              </p>
            </div>

            <div className="w-full bg-secondary rounded-lg shadow-md drop-shadow-md p-3 flex flex-col justify-center">
              <p>{restaurant.address}</p>
              <p>
                {restaurant.zipCode}, {restaurant.city}
              </p>
            </div>
          </header>
        </div>
      </Section>
      <Section className="bg-secondary">
        <div className="max-w-screen-md mx-auto">
          <header>
            <h2 className="mb-3">Menu</h2>
          </header>
          <div className="flex flex-col gap-3">
            {restaurant.items.map((item) => (
              <article key={item.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-end">
                  <div>
                    <header>
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                    </header>
                    <p>{item.description}</p>
                    <p>Price: {item.price} kr.</p>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          removeItemFromCart(item.id);
                        }}
                      >
                        -
                      </Button>

                      <Input
                        type="number"
                        className="w-16"
                        value={
                          cartItems.find(
                            (cartItem) => cartItem.itemId === item.id
                          )?.quantity || 0
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value < 0) return;

                          setCartItems((prevItems) => {
                            const existingItemIndex = prevItems.findIndex(
                              (cartItem) => cartItem.itemId === item.id
                            );

                            if (existingItemIndex !== -1) {
                              const updatedItems = [...prevItems];
                              if (value === 0) {
                                updatedItems.splice(existingItemIndex, 1);
                              } else {
                                updatedItems[existingItemIndex].quantity =
                                  value;
                              }
                              return updatedItems;
                            } else {
                              if (value > 0) {
                                return [
                                  ...prevItems,
                                  { itemId: item.id, quantity: value }
                                ];
                              }
                              return prevItems;
                            }
                          });
                        }}
                      />

                      <Button
                        onClick={() => {
                          addItemToCart(item.id);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="h-20"></div>
      </Section>
      <Section className="fixed bottom-0 bg-primary h-20 text-white">
        <div className="max-w-screen-md mx-auto h-full flex items-center justify-between">
          <div>Total amount: {totalAmount} kr.</div>
          <Button
            variant={"secondary"}
            disabled={loading || cartItems.length == 0}
            onClick={placeOrder}
          >
            Order now!
          </Button>
        </div>
      </Section>
    </>
  );
};

export default RestaurantPageOrder;
