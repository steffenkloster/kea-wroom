import { prisma } from "@/lib/prisma";

export async function GET(request: { params: { id: string } }) {
  const { id } = request.params;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: id,
      isBlocked: false,
      owner: {
        isBlocked: false,
        isDeleted: false
      }
    },
    include: { items: true }
  });

  if (!restaurant) {
    return {
      status: 404,
      body: {
        message: "Restaurant not found"
      }
    };
  }

  return {
    status: 200,
    body: {
      message: "Retrieved restaurant successfully",
      data: restaurant
    }
  };
}
