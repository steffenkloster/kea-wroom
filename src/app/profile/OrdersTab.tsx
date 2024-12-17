"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { OrderDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getCustomersOrders } from "@/lib/api/customers/getCustomersOrders";
import Link from "next/link";

const OrdersTab = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["userOrders"],
    queryFn: async (): Promise<OrderDTO[] | null> => {
      const response = await getCustomersOrders();
      if (response) {
        return response.data as OrderDTO[];
      }

      return null;
    }
  });

  return isLoading ? (
    <div>Loading ..</div>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-56">Order ID</TableHead>
          <TableHead>Restaurant name</TableHead>
          <TableHead className=""></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((order: OrderDTO) => {
          return (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>{order.restaurant?.name}</TableCell>
              <TableCell className="text-right">
                <Link href={`/order/${order.id}`}>View order</Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OrdersTab;
