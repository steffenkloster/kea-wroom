"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Sync } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { verifyUser } from "@/lib/api/auth/verifyUser";
import { resendVerificationCode } from "@/lib/api/auth/resendVerificationCode";

const FormSchema = z.object({
  pin: z.string().regex(/^\d{6}$/, {
    message: "Your verification code must be exactly 6 digits."
  })
});

const VerifyForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const response = await verifyUser(data.pin, {
      setLoading,
      onSuccess: () => {}
    });

    if (!response) return;

    toast.success("Welcome to Wroom!", {
      description:
        "We have successfully verified your account. We're glad to have you here. We're redirecting you to your dashboard now."
    });

    router.push(`/dashboard`);
  };

  const resendVerification = async () => {
    const response = await resendVerificationCode({
      setLoading
    });

    if (!response) {
      toast.error(
        "An error occurred while resending your verification code. Please try again later."
      );
      return;
    }

    toast.success("Verification code sent", {
      description:
        "We have sent a new verification code to your email. Please check your inbox and enter the code here."
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your verification code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the 6 digit code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Sync className="animate-spin" /> : "Verify your account"}
        </Button>

        <hr />
        <p className="text-sm text-center">
          Didn&apos;t receive the code?{" "}
          <a
            className={`${
              loading ? "cursor-wait" : "cursor-pointer"
            } font-semibold`}
            onClick={() => !loading && resendVerification()}
          >
            Resend verification email
          </a>
        </p>
      </form>
    </Form>
  );
};

export default VerifyForm;
