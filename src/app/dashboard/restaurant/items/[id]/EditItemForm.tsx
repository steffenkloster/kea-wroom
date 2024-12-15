"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { ItemDTO } from "@/types";
import { getItem } from "@/lib/api/restaurants/getItem";
import { updateItem } from "@/lib/api/restaurants/updateItem";

const MAX_IMAGES = 3;

const FormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  price: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Price must be a valid number."
    })
    .transform((value) => parseFloat(value)),
  images: z
    .array(z.any())
    .max(MAX_IMAGES, `You can only upload up to ${MAX_IMAGES} images.`)
});

const EditItemForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const { isLoading, data } = useQuery({
    queryKey: ["getItem"],
    queryFn: async (): Promise<ItemDTO | null> => {
      if (!id) return null;

      const response = await getItem(id);
      if (response) {
        return response.data as ItemDTO;
      }

      return null;
    },
    enabled: !!id
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      images: []
    }
  });

  const { reset } = form;

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        description: data.description,
        price: data.price
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!data?.id) return;

    await updateItem(data.id, formData, {
      setLoading,
      onSuccess: () => {
        form.reset();
        router.push("/dashboard/restaurant/items");
        toast.success("Item edited successfully.");
      }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const currentImages = form.getValues("images") || [];

    if (currentImages.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    form.setValue("images", [...currentImages, ...files]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Item name" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the item" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price (e.g., 10.99)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </FormControl>
              <FormDescription>
                You can upload up to {MAX_IMAGES} images.{" "}
                <strong>
                  Your current images will get deleted. Please include your
                  current images, if you wish to keep them on your item.
                </strong>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div></div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Editing Item..." : "Edit Item"}
        </Button>
      </form>
    </Form>
  );
};

export default EditItemForm;
