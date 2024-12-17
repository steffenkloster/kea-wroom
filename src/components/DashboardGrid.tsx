import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";

import { Delete } from "@mui/icons-material";
import { ItemDTO, OrderDTO, OrderItemDTO, UserDTO } from "@/types";

// DashboardGrid component
export const DashboardGrid = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="columns-1 gap-4 mt-8 sm:columns-2 [&>article]:break-inside-avoid [&>article]:mb-4">
      {children}
    </div>
  );
};

// DashboardCard component
export const DashboardCard = ({
  header,
  text,
  link,
  disabled = false
}: {
  header: string;
  text: string;
  link: string;
  disabled?: boolean;
}) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow flex gap-3 justify-between">
      <div>
        <h2 className="text-xl font-semibold">{header}</h2>
        <p>{text}</p>
      </div>
      <Button variant={"default"} asChild disabled={disabled}>
        <Link href={link}>Manage</Link>
      </Button>
    </article>
  );
};

export const UserCard = ({
  user,
  handleClickEvent
}: {
  user: UserDTO;
  handleClickEvent: (id: string) => void;
}) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow flex gap-3 justify-between">
      <div>
        <h2 className="text-xl font-semibold">{user.email}</h2>
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>
      {/* <Link
        href={`/dashboard/admin/users/${user.id}`}
        className={buttonVariants({
          variant: user.isBlocked ? "destructive" : "default"
        })}
      >
        {user.isBlocked ? "Unblock" : "Block"}
      </Link> */}
      <Button
        onClick={() => handleClickEvent(user.id)}
        className={buttonVariants({
          variant: user.isBlocked ? "destructive" : "default"
        })}
      >
        {user.isBlocked ? "Unblock" : "Block"}
      </Button>
    </article>
  );
};

export const ItemCard = ({
  item,
  onDelete
}: {
  item: ItemDTO;
  onDelete: (id: string) => void;
}) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow">
      <header className="flex justify-between">
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <Badge variant={item.isBlocked ? "destructive" : "default"}>
          {item.isBlocked ? "Blocked" : "Active"}
        </Badge>
      </header>
      <p>{item.description}</p>
      <p>Price: {item.price} kr.</p>

      <div className="flex gap-3 mt-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className=""
              disabled={item.isBlocked}
            >
              <Delete />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                item <strong>&quot;{item.name}&quot;</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(item.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          asChild={!item.isBlocked}
          variant="default"
          className="w-full"
          disabled={item.isBlocked}
        >
          {item.isBlocked ? (
            "Edit item"
          ) : (
            <Link href={`/dashboard/restaurant/items/${item.id}`}>
              Edit item
            </Link>
          )}
        </Button>
      </div>
    </article>
  );
};

export const OrderCard = ({
  order,
  handleButtonClick,
  handleCancelOrder,
  loading = false
}: {
  order: OrderDTO;
  handleButtonClick: (order: OrderDTO) => void;
  handleCancelOrder: (order: OrderDTO) => void;
  loading?: boolean;
}) => {
  const getButtonProperties = (status: string) => {
    switch (status) {
      case "PENDING":
        return { buttonText: "Accept order", disabled: false };
      case "ACCEPTED":
        return { buttonText: "Prepare order", disabled: false };
      case "PREPARING":
        return { buttonText: "Order ready for pickup", disabled: false };
      case "READY_FOR_PICKUP":
        return { buttonText: "Order is waiting for courier", disabled: true };
      case "IN_TRANSIT":
        return { buttonText: "Order is being delivered", disabled: true };
      case "DELIVERED":
        return { buttonText: "Order delivered", disabled: true };
      case "CANCELED":
        return { buttonText: "Order cancelled", disabled: true };
      default:
        return { buttonText: "Unknown", disabled: true };
    }
  };

  const canCancelOrder = (status: string) => {
    return !["CANCELED", "DELIVERED", "IN_TRANSIT"].includes(status);
  };

  const getItemsOrdered = (items: OrderItemDTO[] | undefined) => {
    if (!items) return <li>Couldn&apos;t get items</li>;

    return items.map((orderItem) => (
      <li key={orderItem.id}>
        {orderItem.quantity} x {orderItem.item.name}
      </li>
    ));
  };

  const { buttonText, disabled } = getButtonProperties(order.status);

  return (
    <article className="bg-white p-6 rounded-lg shadow">
      <header>
        <h2 className="text-xl font-semibold">Order #{order.id}</h2>
      </header>
      <p>Total price: {order.totalPrice} kr.</p>
      <p>Order status: {order.status}</p>

      <hr className="my-3" />

      <strong>Items ordered:</strong>
      <ul className="list-disc ml-6">{getItemsOrdered(order.items)}</ul>

      <div className="flex gap-3 mt-3">
        <AlertDialog>
          <AlertDialogTrigger
            asChild
            disabled={!canCancelOrder(order.status) || loading}
          >
            <Button variant="destructive" className="">
              Cancel order
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will cancel the order{" "}
                <strong>#{order.id}</strong>, costing the customer{" "}
                <strong>{order.totalPrice} kr.</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleCancelOrder(order)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="default"
          className="w-full"
          disabled={disabled || loading}
          onClick={() => handleButtonClick(order)}
        >
          {buttonText}
        </Button>
      </div>
    </article>
  );
};

export const PartnerOrderCard = ({
  order,
  activeDelivery,
  distance,
  duration,
  loading,
  handleButtonClick
}: {
  order: OrderDTO;
  activeDelivery: OrderDTO | null;
  distance?: string;
  duration?: string;
  loading: boolean;
  handleButtonClick: (order: OrderDTO) => void;
}) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow">
      <header>
        <h2 className="text-xl font-semibold">Order #{order.id}</h2>
      </header>
      <p>
        <strong>Pickup address:</strong> {order.restaurant?.name},{" "}
        {order.restaurant?.address},{" "}
        <span className="whitespace-nowrap">
          {order.restaurant?.zipCode} {order.restaurant?.city}
        </span>
      </p>
      <p>
        <strong>Delivery address:</strong> {order.customer?.address},{" "}
        <span className="whitespace-nowrap">
          {order.customer?.zipCode} {order.customer?.city}
        </span>
      </p>
      <p>
        <strong>Distance:</strong> {distance || "Unknown"} (
        {duration || "Unknown"})
      </p>

      <div className="flex gap-3 mt-3">
        <Button
          variant="default"
          className="w-full"
          disabled={activeDelivery !== null || loading}
          onClick={() => handleButtonClick(order)}
        >
          Accept delivery
        </Button>
      </div>
    </article>
  );
};

export const AdminItemCard = ({
  item,
  handleClickEvent
}: {
  item: ItemDTO;
  handleClickEvent: (id: string) => void;
}) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow">
      <header>
        <h2 className="text-xl font-semibold">{item.name}</h2>
      </header>
      <Link href={`/dashboard/restaurants/${item.restaurant.id}`}>
        {item.restaurant.name}
      </Link>

      <div className="flex gap-3 mt-3">
        <Button
          variant={item.isBlocked ? "default" : "destructive"}
          onClick={() => handleClickEvent(item.id)}
        >
          {item.isBlocked ? "Unblock" : "Block"}
        </Button>

        <Button variant="default" className="w-full" disabled>
          Edit item
        </Button>
      </div>
    </article>
  );
};
