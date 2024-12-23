"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sync } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Role } from "@/types";
import { createUser } from "@/lib/api/auth/createUser";
import { useSessionContext } from "@/providers/SessionProvider";
import { JWT } from "next-auth/jwt";

const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters."
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters."
    }),
    email: z
      .string()
      .regex(emailRegex, { message: "Invalid email address." })
      .nonempty({ message: "Email is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must include at least one uppercase letter."
      })
      .regex(/[a-z]/, {
        message: "Password must include at least one lowercase letter."
      })
      .regex(/[0-9]/, { message: "Password must include at least one number." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must include at least one special character."
      }),
    phone: z.string().min(8, {
      message: "Phone number must be at least 8 characters."
    }),
    repeatPassword: z
      .string()
      .min(8, { message: "Please confirm your password." }),
    address: z.string().min(2, {
      message: "Address must be at least 2 characters."
    }),
    city: z.string().min(2, {
      message: "City name must be at least 2 characters."
    }),
    zipCode: z.string().length(4, {
      message: "Zip code must be 4 characters."
    }),
    restaurantName: z.string().min(2, {
      message: "Restaurant name must be at least 2 characters."
    }),
    restaurantAddress: z.string().min(2, {
      message: "Address must be at least 2 characters."
    }),
    restaurantCity: z.string().min(2, {
      message: "City must be at least 2 characters."
    }),
    restaurantZipCode: z.string().length(4, {
      message: "Zip code must be 4 characters."
    })
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match."
  });

const SignupForm = ({ role = Role.CUSTOMER }: { role?: Role }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSession } = useSessionContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      restaurantName: "",
      restaurantAddress: "",
      restaurantCity: "",
      restaurantZipCode: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await createUser(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode,
        restaurantName: values.restaurantName,
        restaurantAddress: values.restaurantAddress,
        restaurantCity: values.restaurantCity,
        restaurantZipCode: values.restaurantZipCode,
        role: role.toString()
      },
      {
        setLoading
      }
    );

    if (!response) {
      return;
    }

    const user = response.data;
    setSession(user as JWT);

    setLoading(true);
    toast.success(
      "Account created successfully! Redirecting to verification page ..."
    );

    router.push("/login/verify");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <h2>Personal information</h2>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  placeholder="john.doe@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="MySecretPa$$word666"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your password must be at least 8 characters long, include a
                lowercase letter, an uppercase letter, a number, and a special
                character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="MySecretPa$$word666"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Just making sure there aren&apos;t any typos in your password!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div></div>
        <h2>Restaurant information</h2>
        <FormField
          control={form.control}
          name="restaurantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Nordic Noodle"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="restaurantAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
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
            name="restaurantZipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip code</FormLabel>
                <FormControl>
                  <Input
                    className="w-16 flex-shrink-0"
                    autoComplete="off"
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
            name="restaurantCity"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
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
            "Create your Wroom account"
          )}
        </Button>

        <hr />

        <p className="text-sm text-center">
          <strong>Already a member?</strong>{" "}
          <a href="/login">Log in to your account instead.</a>
        </p>
      </form>
    </Form>
  );
};

export default SignupForm;
