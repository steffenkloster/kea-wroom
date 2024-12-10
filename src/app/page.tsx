"use client";

import { Section } from "@/components/Section";
import { AddressAutocompleteInput } from "@/components/ui/address-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Home() {
  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    console.log("Selected place:", place);
  };

  return (
    <>
      <Section
        className="bg-primary overflow-hidden relative h-160"
        padding="none"
        noMaxWidth={true}
        outside={
          <div className="relative w-full h-full">
            <Image
              src="/wroom-banner-blue.jpg"
              alt="Wroom banner"
              fill
              className="object-cover"
              priority // Optional: Ensures the image is loaded immediately for above-the-fold content
            />
          </div>
        }
      >
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 max-w-content">
          <div className="max-w-lg flex flex-col gap-6">
            <h1 className="text-white text-5xl">
              Fast, fresh, delicious. Wroomed straight to your door.
            </h1>
            <div className="flex gap-3 items-end">
              <div className="grid w-full items-center gap-1.5 flex-grow">
                <Label htmlFor="address">Your delivery address</Label>
                <AddressAutocompleteInput
                  id="address"
                  placeholder="Guldbergsgade 29N, 2200 København N"
                  onPlaceSelected={handlePlaceSelected}
                  autoComplete="off"
                  useCurrentLocation={true}
                />
              </div>
              <Button variant={"secondary"}>Find restaurants</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gray-50">
        <div className="grid grid-cols-3 gap-12">
          <div className="relative w-full rounded-lg overflow-hidden">
            <Image
              src="/courier.jpg"
              alt="Courier delivering packages"
              fill
              className="object-cover w-full"
              priority
            />
          </div>
          <div className="flex flex-col gap-3 col-span-2">
            <h2 className="text-3xl text-black">Become a courier</h2>
            <p className="text-gray-600 text-lg">
              Ready to hit the road and deliver smiles? Join Wroom today and
              become part of a community of trusted couriers who ensure fast,
              fresh deliveries straight to our customers&apos; doors. Work on
              your schedule, earn great pay, and bring joy to every doorstep!
            </p>
            <p className="text-gray-600">
              Whether you&apos;re looking for a full-time gig or a flexible way
              to earn extra income, Wroom has you covered. Start your journey as
              a courier and make a difference in your city.
            </p>
            <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Join as a Courier
            </button>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid grid-cols-3 gap-12">
          <div className="flex flex-col gap-3 col-span-2">
            <h2 className="text-3xl text-black">
              Grow Your Restaurant with Wroom
            </h2>
            <p className="text-gray-600 text-lg">
              Do you run a restaurant and want to reach more hungry customers?
              Partner with Wroom and let us help you bring your delicious dishes
              straight to their doors. Join our growing network of restaurants
              and boost your business with seamless delivery solutions.
            </p>
            <p className="text-gray-600">
              With Wroom, you focus on what you do best — crafting amazing food
              — while we handle the logistics. Expand your reach, increase your
              sales, and delight more customers every day. Sign up now and take
              your restaurant to the next level with Wroom!
            </p>
            <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Join as a Restaurant
            </button>
          </div>

          <div className="relative w-full rounded-lg overflow-hidden">
            <Image
              src="/restaurant.jpeg"
              alt="Courier delivering packages"
              fill
              className="object-cover w-full"
              priority
            />
          </div>
        </div>
      </Section>
    </>
  );
}
