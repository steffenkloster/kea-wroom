"use client";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerPlaceOrder } from "@/lib/api/customers/customerPlaceOrder";
import { CartItem, OrderDTO, OrderItemDTO, RestaurantDTO } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusText } from "@/lib/utils";

const OrderSummaryPage = ({
  restaurant,
  order
}: {
  restaurant: RestaurantDTO;
  order: OrderDTO;
}) => {
  const totalAmount = useMemo(() => {
    return order.items?.reduce((acc, orderItem) => {
      return acc + orderItem.quantity * orderItem.item.price;
    }, 0);
  }, [order.items]);

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
                <BreadcrumbLink href={`/restaurant/${restaurant.id}`}>
                  {restaurant.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Order #{order.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-3">
            <header className="flex justify-between">
              <h1>{restaurant.name}</h1>
              <Badge>{getOrderStatusText(order.status)}</Badge>
            </header>

            <p>
              {restaurant.address}, {restaurant.zipCode} {restaurant.city}
            </p>

            <div>
              <p>Order #{order.id}</p>
            </div>
          </div>
        </div>
      </Section>
      <Section className="bg-secondary">
        <div className="max-w-screen-md mx-auto">
          <header className="flex justify-between w-full mb-3">
            <h2 className="">Items ordered</h2>
          </header>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Quantity</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items?.map((orderItem: OrderItemDTO) => {
                return (
                  <TableRow key={orderItem.id}>
                    <TableCell>{orderItem.quantity}x</TableCell>
                    <TableCell>{orderItem.item.name}</TableCell>
                    <TableCell className="text-right">
                      {(orderItem.item.price * orderItem.quantity).toFixed(2)}{" "}
                      kr.
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell className="text-xl font-semibold">Total</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right text-xl font-semibold">
                  {totalAmount?.toFixed(2)} kr.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Section>
    </>
  );
};

export default OrderSummaryPage;
