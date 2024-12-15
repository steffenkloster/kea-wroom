"use client";

import { AdminItemCard, DashboardGrid } from "@/components/DashboardGrid";
import { Input } from "@/components/ui/input";
import { adminBlockItem } from "@/lib/api/admin/adminBlockItem";
import { adminGetItems } from "@/lib/api/admin/adminGetItems";
import { ItemDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { toast } from "sonner";

const ItemsGrid = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["adminItems"],
    queryFn: async (): Promise<ItemDTO[] | null> => {
      const response = await adminGetItems();
      if (response) {
        console.log(response);
        return response.data as ItemDTO[];
      }

      return null;
    }
  });

  const handleClickEvent = async (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isBlocked: !item.isBlocked
          };
        }

        return item;
      })
    );

    await adminBlockItem(id, {
      onError: (error) => {
        toast.error(error.error);

        setItems((prevItems) =>
          prevItems.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                isBlocked: !item.isBlocked
              };
            }

            return item;
          })
        );
      }
    });
  };

  const [items, setItems] = useState<ItemDTO[]>([]);
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<ItemDTO[]>([]);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();

    setFilteredItems(
      items.filter((item) => {
        return (
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.restaurant.name.toLowerCase().includes(lowerCaseQuery)
        );
      })
    );
  }, [query, items]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Search items by name or restaurant name"
      />
      <DashboardGrid>
        {filteredItems.map((item) => (
          <AdminItemCard
            key={item.id}
            item={item}
            handleClickEvent={handleClickEvent}
          />
        ))}
      </DashboardGrid>
    </>
  );
};

export default ItemsGrid;
