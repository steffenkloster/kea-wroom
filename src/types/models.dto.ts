export interface UserTokenDTO {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  firstName: string;
  lastName: string;
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  address?: string;
  city?: string;
  zipCode?: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  restaurant?: RestaurantDTO;
}

export interface RestaurantDTO {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner?: UserDTO;
  items: ItemDTO[];
}

export interface ItemDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  restaurant: RestaurantDTO;
}

export interface OrderDTO {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  pickupTime?: Date;
  deliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  customer?: UserDTO;
  restaurant?: RestaurantDTO;
  courier?: UserDTO;
  items?: OrderItemDTO[];
}

export interface OrderItemDTO {
  id: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  order: OrderDTO; // Reference to OrderDTO
  item: ItemDTO; // Reference to ItemDTO
}

export enum Role {
  CUSTOMER = "CUSTOMER",
  PARTNER = "PARTNER",
  RESTAURANT = "RESTAURANT",
  ADMIN = "ADMIN"
}

export enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  PREPARING = "PREPARING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  WAITING_FOR_PICKUP = "WAITING_FOR_PICKUP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}
