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
import { getOwnUser } from "@/lib/api";
import { Sync } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { UserDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters."
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters."
  }),
  phone: z
    .string()
    .min(8, { message: "Phone number must be at least 8 characters." }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters." }),
  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters." }),
  zipCode: z.string().length(4, { message: "Zip code must be 4 characters." })
});

const RestaurantInformationTab = () => {
  const [loading, _] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: async (): Promise<UserDTO | null> => {
      const response = await getOwnUser();
      if (response) {
        return response.data as UserDTO;
      }

      return null;
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      zipCode: ""
    }
  });

  const { reset } = form;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // await updateOwnUser(values, {
    //   setLoading,
    //   onSuccess: () => {
    //     toast.success("Personal information updated successfully.");
    //   }
    // });
  }

  return isLoading ? (
    <div>Loading ..</div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="given-name"
                    placeholder="John"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="family-name"
                    placeholder="Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  autoComplete="tel"
                  placeholder="20 20 20 20"
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
            "Update personal information"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RestaurantInformationTab;
