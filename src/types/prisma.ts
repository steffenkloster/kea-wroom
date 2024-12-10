import { Prisma } from "@prisma/client";

export type UserWithRestaurant = Prisma.UserGetPayload<{
  include: { restaurant: true };
}>;
