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
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginUser } from "@/lib/api/auth/loginUser";
import { useSessionContext } from "@/providers/SessionProvider";
import { JWT } from "next-auth/jwt";

const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
const formSchema = z.object({
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
    })
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useSessionContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await loginUser(
      {
        email: values.email,
        password: values.password
      },
      {
        setLoading,
        onSuccess: () => {}
      }
    );

    const user = response?.data;
    if (!user) {
      return;
    }

    toast.success("Login successful, redirecting...");
    setSession(user as JWT);

    if (!user.isVerified) {
      router.push("/login/verify");
      return;
    }

    router.push(searchParams.get("path") || "/dashboard");
  }

  return (
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
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
          {loading ? <Sync className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
