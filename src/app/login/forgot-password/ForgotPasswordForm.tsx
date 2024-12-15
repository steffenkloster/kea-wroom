"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Sync } from "@mui/icons-material";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { forgotPassword } from "@/lib/api/auth/forgotPassword";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  const formSchema = z.object({
    email: z
      .string()
      .regex(emailRegex, { message: "Invalid email address." })
      .nonempty({ message: "Email is required." })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await forgotPassword(values.email, {
      setLoading,
      onSuccess: () => {
        setSuccess(true);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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

          <div></div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || success}
          >
            {loading ? <Sync className="animate-spin" /> : "Forgot password"}
          </Button>
        </form>
      </Form>
      {success && (
        <Alert variant="success" className="mt-3">
          <AlertTitle className="font-semibold">E-mail sent</AlertTitle>
          <AlertDescription>
            We&apos;ve sent you an e-mail with a link to reset your password.
            Please check your inbox or spam folder.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
