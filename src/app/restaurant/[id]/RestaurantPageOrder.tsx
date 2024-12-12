"use client";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { userPlaceOrder } from "@/lib/api";
import { ItemDTO, RestaurantDTO } from "@/types";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const RestaurantPageOrder = ({ restaurant }: { restaurant: RestaurantDTO }) => {
  const addItemToCart = (item: ItemDTO) => {
    setCartItems((prevItems) => [...prevItems, item]);
    toast.success(`${item.name} added to cart!`);
  };

  const placeOrder = async () => {
    await userPlaceOrder(restaurant.id, cartItems, {
      setLoading,
      onSuccess: () => {
        toast.success("Order placed successfully!");
        setLoading(true);
        //router.push(`/order/${id}`);
      }
    });
  };

  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<ItemDTO[]>([]);
  const totalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  }, [cartItems]);

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
                    <Button
                      disabled={loading}
                      variant={"default"}
                      onClick={() => addItemToCart(item)}
                    >
                      Add to cart
                    </Button>
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
