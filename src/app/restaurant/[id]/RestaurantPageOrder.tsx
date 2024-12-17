"use client";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerPlaceOrder } from "@/lib/api/customers/customerPlaceOrder";
import { CartItem, RestaurantDTO } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import Image from "next/image";

const RestaurantPageOrder = ({
  restaurant,
  isAuthenticated
}: {
  restaurant: RestaurantDTO;
  isAuthenticated: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

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
    router.push(`/order/${response.data.id}`);
  };

  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [query, setQuery] = useState("");

  const totalAmount = useMemo(() => {
    return cartItems
      .reduce((acc, item) => {
        const price =
          restaurant.items.find((i) => i.id === item.itemId)?.price || 0;
        return acc + price * item.quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems, restaurant.items]);

  const filteredItems = useMemo(() => {
    return restaurant.items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [restaurant.items, query]);

  return (
    <>
      <Section>
        <div className="max-w-screen-md mx-auto">
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/customer">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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
          <header className="flex justify-between w-full mb-3">
            <h2 className="">Menu</h2>
            <Input
              placeholder="Search..."
              className=""
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </header>
          <div className="flex flex-col gap-3">
            {filteredItems.map((item) => (
              <article key={item.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between gap-3 sm:gap-0 sm:items-center sm:flex-row flex-col">
                  <div className="flex flex-col items-center sm:flex-row gap-x-3 gap-y-6">
                    {item.images && item.images.length > 0 ? (
                      <Carousel
                        className="ml-12 mr-14 w-32 h-32 flex-shrink-0"
                        opts={{ loop: true }}
                      >
                        <CarouselContent>
                          {item.images.map((image, i) => (
                            <CarouselItem key={`item-${item.id}-image-${i}`}>
                              <Image
                                src={image}
                                alt={item.name}
                                width={128}
                                height={128}
                                className="w-32 h-32 object-cover flex-shrink-0"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    ) : (
                      <></>
                    )}
                    <div className="flex flex-col justify-center w-full">
                      <header>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                      </header>
                      <p>{item.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end sm:flex-col sm:gap-3">
                    <p>Price: {item.price} kr.</p>
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
          {isAuthenticated ? (
            <Button
              variant={"secondary"}
              disabled={loading || cartItems.length == 0}
              onClick={placeOrder}
            >
              Place order
            </Button>
          ) : (
            <Button
              onClick={() =>
                router.push(`/login?path=${encodeURIComponent(pathname)}`)
              }
              variant={"secondary"}
            >
              Log in to place order
            </Button>
          )}
        </div>
      </Section>
    </>
  );
};

export default RestaurantPageOrder;
