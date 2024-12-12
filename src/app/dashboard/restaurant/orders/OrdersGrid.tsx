"use client";

import { DashboardGrid, OrderCard } from "@/components/DashboardGrid";
import { getOrders } from "@/lib/api";
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

  const [orders, setOrders] = useState<OrderDTO[]>([]);

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
        <OrderCard key={order.id} order={order} />
      ))}
    </DashboardGrid>
  );
};

export default OrdersGrid;
