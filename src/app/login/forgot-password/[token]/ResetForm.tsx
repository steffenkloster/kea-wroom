"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/lib/api/auth/resetPassword";

interface ResetFormProps {
  email: string;
  token: string;
}

const formSchema = z
  .object({
    email: z.string(),
    token: z.string(),
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

const ResetForm: React.FC<ResetFormProps> = ({ email, token }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      token: token,
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await resetPassword(values, {
      setLoading,
      onSuccess: () => {
        setSuccess(true);
      }
    });
  };

  return success ? (
    <>
      <Alert variant="success">
        <AlertTitle className="font-semibold">Success</AlertTitle>
        <AlertDescription>
          Your password has been successfully changed. You can now log in with
          your new password.
        </AlertDescription>
      </Alert>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "default" }), "w-full mt-3")}
      >
        Go to login
      </Link>
    </>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="MySecretPa$$word666"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div></div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Sync className="animate-spin" /> : "Change password"}
        </Button>
      </form>
    </Form>
  );
};

export default ResetForm;
