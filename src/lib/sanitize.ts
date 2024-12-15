import { UserDTO, RestaurantDTO } from "@/types/models.dto";

export function sanitizeUser(user: any): UserDTO {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    address: user.address,
    city: user.city,
    zipCode: user.zipCode,
    isVerified: user.isVerified,
    isDeleted: user.isDeleted,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    restaurant: user.restaurant
      ? ({
          id: user.restaurant.id,
          name: user.restaurant.name,
          description: user.restaurant.description,
          address: user.restaurant.address,
          city: user.restaurant.city,
          zipCode: user.restaurant.zipCode,
          latitude: user.restaurant.latitude,
          longitude: user.restaurant.longitude,
          isBlocked: user.restaurant.isBlocked,
          createdAt: user.restaurant.createdAt,
          updatedAt: user.restaurant.updatedAt
        } as RestaurantDTO)
      : undefined
  };
}
