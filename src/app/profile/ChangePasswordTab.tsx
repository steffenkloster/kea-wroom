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
import { toast } from "sonner";
import { useState } from "react";
import { updateOwnUser } from "@/lib/api";

const formSchema = z
  .object({
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
    repeatPassword: z
      .string()
      .min(8, { message: "Please confirm your password." })
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match."
  });

const ChangePasswordTab = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      repeatPassword: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateOwnUser(
      {
        password: values.password
      },
      {
        setLoading,
        onSuccess: () => {
          toast.success("Password updated successfully.");
          form.reset();
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  placeholder="$3cureP@ssw0rd"
                  type="password"
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
              <FormLabel>Repeat password</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  placeholder="$3cureP@ssw0rd"
                  type="password"
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Sync className="animate-spin" /> : "Update password"}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordTab;
