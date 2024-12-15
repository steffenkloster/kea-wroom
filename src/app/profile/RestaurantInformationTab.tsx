"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sync } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { RestaurantDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateRestaurant } from "@/lib/api/restaurants/updateRestaurant";
import { getOwnRestaurant } from "@/lib/api/restaurants/getOwnRestaurant";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters."
  }),
  description: z.string(),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters." }),
  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters." }),
  zipCode: z.string().length(4, { message: "Zip code must be 4 characters." })
});

const RestaurantInformationTab = () => {
  const [loading, setLoading] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["restaurantInformation"],
    queryFn: async (): Promise<RestaurantDTO | null> => {
      const response = await getOwnRestaurant();
      if (response) {
        return response.data as RestaurantDTO;
      }

      return null;
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      zipCode: ""
    }
  });

  const { reset } = form;

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        description: data.description || "",
        address: data.address,
        city: data.city,
        zipCode: data.zipCode
      });
    }
  }, [data, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await updateRestaurant(values, {
      setLoading,
      onSuccess: () => {
        toast.success("Restaurant information updated successfully.");
      }
    });
  }

  return isLoading ? (
    <div>Loading ..</div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="My Restaurant"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant name</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-white"
                  placeholder="A nice description about your restaurant"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  autoComplete="street-address"
                  placeholder="Guldbergsgade 29N"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 w-full">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip code</FormLabel>
                <FormControl>
                  <Input
                    className="w-16 flex-shrink-0"
                    autoComplete="postal-code"
                    placeholder="2200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="address-level2"
                    placeholder="Copenhagen N"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div></div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Sync className="animate-spin" />
          ) : (
            "Update restaurant information"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RestaurantInformationTab;
