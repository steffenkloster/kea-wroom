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
import { toast } from "sonner";
import { useState } from "react";
import { deleteOwnUser } from "@/lib/api";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const formSchema = z.object({
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

const SettingsTab = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await deleteOwnUser(values.password, {
      setLoading,
      onSuccess: () => {
        toast.success("Your account has been successfully deleted.");
        form.reset();
        window.location.reload();
      },
      onError: (error) => {
        if (error.statusCode === 409) {
          toast.error("Your password is invalid.");
          form.setError("password", {
            type: "manual",
            message: "Your password is invalid."
          });
          return;
        }

        if (error.statusCode.toString().startsWith("4")) {
          toast.error(error.error);
          return;
        }

        toast.error("An error occurred. Please try again later.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <h3>Delete account</h3>
      <p>
        If you no longer want to have your Wroom account, you can delete it
        here.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete account</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. If you wish to continue, please type
              your password below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 text-black"
            >
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div></div>
              <Button
                type="submit"
                variant="destructive"
                className="w-full"
                disabled={loading || !form.getValues().password}
              >
                {loading ? (
                  <Sync className="animate-spin" />
                ) : (
                  "Delete my account"
                )}
              </Button>

              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsTab;
