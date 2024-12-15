"use client";

import { DashboardGrid, OrderCard } from "@/components/DashboardGrid";
import { getOrders } from "@/lib/api/restaurants/getOrders";
import { updateOrderStatus } from "@/lib/api/restaurants/updateOrderStatus";
import { OrderDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const OrdersGrid = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["resturantOrders"],
    queryFn: async (): Promise<OrderDTO[] | null> => {
      const response = await getOrders();
      if (response) {
        console.log(response);
        return response.data as OrderDTO[];
      }

      return null;
    }
  });

  const STATUS_ORDER = ["PENDING", "ACCEPTED", "PREPARING", "READY_FOR_PICKUP"];

  const handleButtonClick = async (order: OrderDTO) => {
    const currentIndex = STATUS_ORDER.indexOf(order.status);
    const nextIndex = currentIndex + 1;
    const nextStatus = STATUS_ORDER[nextIndex];

    if (nextStatus) {
      const response = await updateOrderStatus(order.id, nextStatus, {
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

  const handleCancelOrder = async (order: OrderDTO) => {
    const status = "CANCELED";
    const response = await updateOrderStatus(order.id, status, {
      setLoading
    });

    if (!response || !response.data) return;

    const updatedOrder = response.data;
    const updatedOrders = orders.map((o) =>
      o.id === updatedOrder.id ? updatedOrder : o
    );

    setOrders(updatedOrders);
  };

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardGrid>
      {orders.map((order) => (
        <OrderCard
          loading={loading}
          key={order.id}
          order={order}
          handleButtonClick={handleButtonClick}
          handleCancelOrder={handleCancelOrder}
        />
      ))}
    </DashboardGrid>
  );
};

export default OrdersGrid;
