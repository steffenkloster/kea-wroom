"use client";

import { DashboardGrid, PartnerOrderCard } from "@/components/DashboardGrid";
import { Section } from "@/components/Section";
import { OrderStatus } from "@prisma/client";
import { OrderDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAvailableOrders } from "@/lib/api/partners/getAvailableOrders";
import { getDistance } from "@/lib/location";
import RouteMap from "@/components/RouteMap";
import { updateDeliveryStatus } from "@/lib/api/partners/updateDeliveryStatus";
import { Button } from "@/components/ui/button";

interface PartnerGridProps {
  userId: string;
}

interface OrderWithDistance extends OrderDTO {
  distance?: string | null;
  duration?: string | null;
}

const PartnerGrid: React.FC<PartnerGridProps> = ({ userId }) => {
  const [availableOrders, setAvailableOrders] = useState<OrderWithDistance[]>(
    []
  );
  const [activeDelivery, setActiveDelivery] =
    useState<OrderWithDistance | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["getOrders"],
    queryFn: async (): Promise<OrderDTO[] | null> => {
      const response = await getAvailableOrders();
      if (response) {
        return response.data as OrderWithDistance[];
      }

      return null;
    }
  });

  const STATUS_ORDER = [
    "READY_FOR_PICKUP",
    "WAITING_FOR_PICKUP",
    "IN_TRANSIT",
    "COMPLETED"
  ];
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async (order: OrderDTO) => {
    const currentIndex = STATUS_ORDER.indexOf(order.status);
    const nextIndex = currentIndex + 1;
    const nextStatus = STATUS_ORDER[nextIndex];

    if (nextStatus) {
      const response = await updateDeliveryStatus(order.id, nextStatus, {
        setLoading
      });

      if (!response || !response.data) return;

      const updatedOrder = response.data;
      const updatedOrders = orders.map((o) =>
        o.id === updatedOrder.id ? updatedOrder : o
      );

      setOrders(updatedOrders);
    }
  };

  const handleActiveDeliveryButtonClick = async () => {
    if (!activeDelivery) return;

    const currentIndex = STATUS_ORDER.indexOf(activeDelivery.status);
    const nextIndex = currentIndex + 1;
    const nextStatus = STATUS_ORDER[nextIndex];

    if (nextStatus) {
      const response = await updateDeliveryStatus(
        activeDelivery.id,
        nextStatus,
        {
          setLoading
        }
      );

      if (!response || !response.data) return;

      const updatedOrder = response.data;
      if (!["COMPLETED", "CANCELED"].includes(updatedOrder.status)) {
        setActiveDelivery(updatedOrder);
      } else {
        setActiveDelivery(null);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  useEffect(() => {
    if (orders) {
      const readyForPickupOrders = orders.filter(
        (order) => order.status === OrderStatus.READY_FOR_PICKUP
      );
      setAvailableOrders(readyForPickupOrders);

      const activeDelivery = orders.find((order) => {
        return (
          order.courier?.id === userId &&
          !["COMPLETED", "CANCELED"].includes(order.status)
        );
      });

      setActiveDelivery(activeDelivery || null);

      readyForPickupOrders.forEach(async (order, index) => {
        if (
          !order.customer ||
          !order.restaurant ||
          !order.customer.address ||
          !order.restaurant.address
        ) {
          console.log("Can't calculate distance for order", order);
          return;
        }

        const response = await getDistance(
          order.customer.address,
          order.restaurant.address
        );

        if (!response) {
          return;
        }

        const { distance, duration } = response;

        setAvailableOrders((prev) =>
          prev.map((o, i) => (i === index ? { ...o, distance, duration } : o))
        );
      });
    }
  }, [orders, userId]);

  const getButtonText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.READY_FOR_PICKUP:
        return "Start delivery";
      case OrderStatus.WAITING_FOR_PICKUP:
        return "I have picked up the order";
      case OrderStatus.IN_TRANSIT:
        return "I have delivered the order";
      case OrderStatus.COMPLETED:
        return "Delivery completed";
      case OrderStatus.CANCELED:
        return "Delivery canceled";
      default:
        return "Unknown status";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Section>
        <header>
          <h2 className="mb-3">Your current active delivery</h2>
        </header>
        {activeDelivery ? (
          <>
            <Button
              variant="default"
              className="w-full mb-3"
              onClick={() => handleActiveDeliveryButtonClick()}
            >
              {getButtonText(activeDelivery.status)}
            </Button>

            <RouteMap
              order={activeDelivery}
              distance={activeDelivery.distance || "Calculating..."}
              duration={activeDelivery.duration || "Calculating..."}
              addressPickUp={`${activeDelivery.restaurant?.address}, ${activeDelivery.restaurant?.zipCode} ${activeDelivery.restaurant?.city}`}
              addressDeliverTo={`${activeDelivery.customer?.address}, ${activeDelivery.customer?.zipCode} ${activeDelivery.customer?.city}`}
            />
          </>
        ) : (
          <div>No active delivery</div>
        )}
      </Section>

      <Section>
        <header>
          <h2>Available orders</h2>
        </header>
        <DashboardGrid>
          {availableOrders.map((order) => (
            <PartnerOrderCard
              key={order.id}
              order={order}
              loading={loading}
              activeDelivery={activeDelivery}
              distance={order.distance || "Calculating..."}
              duration={order.duration || "Calculating..."}
              handleButtonClick={handleButtonClick}
            />
          ))}
        </DashboardGrid>
      </Section>
    </>
  );
};

export default PartnerGrid;
