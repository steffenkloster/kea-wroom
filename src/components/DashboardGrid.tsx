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

import { Delete } from "@mui/icons-material";
import { cn } from "@/lib/utils";
import { ItemDTO, OrderDTO, UserDTO } from "@/types";

// DashboardGrid component
export const DashboardGrid = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">{children}</div>
  );
};

// DashboardCard component
export const DashboardCard = ({
  header,
  text,
  link
}: {
  header: string;
  text: string;
  link: string;
}) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow flex gap-3 justify-between">
      <div>
        <h2 className="text-xl font-semibold">{header}</h2>
        <p>{text}</p>
      </div>
      <Link href={link} className={buttonVariants({ variant: "default" })}>
        Manage
      </Link>
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
      <header>
        <h2 className="text-xl font-semibold">{item.name}</h2>
      </header>
      <p>{item.description}</p>
      <p>Price: {item.price} kr.</p>

      <div className="flex gap-3 mt-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="">
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

        <Link
          href={`/dashboard/restaurant/items/${item.id}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Edit item
        </Link>
      </div>
    </article>
  );
};

export const OrderCard = ({ order }: { order: OrderDTO }) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow">
      <header>
        <h2 className="text-xl font-semibold">Order #{order.id}</h2>
      </header>
      <p>Total price: {order.totalPrice} kr.</p>
      <p>Order status: {order.status}</p>

      <div className="flex gap-3 mt-3">
        <Link
          href={`/dashboard/restaurant/items/${order.id}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Manage
        </Link>
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
      <p>{item.restaurant.name}</p>

      <div className="flex gap-3 mt-3">
        <Button
          variant={item.isBlocked ? "default" : "destructive"}
          onClick={() => handleClickEvent(item.id)}
        >
          {item.isBlocked ? "Unblock" : "Block"}
        </Button>

        {/* <Link
          href={`/dashboard/admin/items/${item.id}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Edit item
        </Link> */}
        <Button variant="default" className="w-full" disabled>
          Edit item
        </Button>
      </div>
    </article>
  );
};
