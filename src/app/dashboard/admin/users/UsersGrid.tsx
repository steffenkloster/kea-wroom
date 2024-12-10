"use client";

import { UserCard, DashboardGrid } from "@/components/DashboardGrid";
import { adminBlockUser, adminGetUsers } from "@/lib/api";
import { UserDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

const ItemsGrid = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async (): Promise<UserDTO[] | null> => {
      const response = await adminGetUsers();
      if (response) {
        console.log(response);
        return response.data as UserDTO[];
      }

      return null;
    }
  });

  const handleClickEvent = async (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            isBlocked: !user.isBlocked
          };
        }

        return user;
      })
    );

    await adminBlockUser(id, {
      onError: (error) => {
        toast.error(error.error);

        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user.id === id) {
              return {
                ...user,
                isBlocked: !user.isBlocked
              };
            }

            return user;
          })
        );
      }
    });
  };

  const [users, setUsers] = useState<UserDTO[]>([]);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
      setFilteredUsers(data);
    }
  }, [data]);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();

    setFilteredUsers(
      users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return (
          fullName.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery)
        );
      })
    );
  }, [query, users]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Search users by name or email"
      />
      <DashboardGrid>
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            handleClickEvent={handleClickEvent}
          />
        ))}
      </DashboardGrid>
    </>
  );
};

export default ItemsGrid;
