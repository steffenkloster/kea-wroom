"use client";

import { ItemCard, DashboardGrid } from "@/components/DashboardGrid";
import { deleteItem, getItems } from "@/lib/api";
import { ItemDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { toast } from "sonner";

const ItemsGrid = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["resturantItems"],
    queryFn: async (): Promise<ItemDTO[] | null> => {
      const response = await getItems();
      if (response) {
        console.log(response);
        return response.data as ItemDTO[];
      }

      return null;
    }
  });

  const handleDeleteItem = async (id: string) => {
    const deletedItem = items.find((item) => item.id === id);
    if (!deletedItem) return;

    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    await deleteItem(id, {
      onError: () => {
        toast.error(
          "Something went wrong when trying to delete the item. Please try again."
        );
        setItems((prevItems) => [...prevItems, deletedItem]);
      }
    });
  };

  const [items, setItems] = useState<ItemDTO[]>([]);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardGrid>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
      ))}
    </DashboardGrid>
  );
};

export default ItemsGrid;
