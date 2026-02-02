// "use server";

// import { prisma } from "@/app/server/db";
// import { NOTIFICATIONS } from "@/app/shared/constants/notification";
// import { checkUserRole } from "@/app/shared/functions";
// import { serializeOrders, serializeOrder, serializeData } from "@/app/shared/serialize";
// import {
//     createOrderSchema,
//     orderSummarySchema,
//     type CreateOrderInput,
//     type OrderSummaryInput,
// } from "@/app/validation/user/order";

// function generateOrderNumber(): string {
//     const timestamp = Date.now().toString(36).toUpperCase();
//     const random = Math.random().toString(36).substring(2, 8).toUpperCase();
//     return `ORD-${timestamp}-${random}`;
// }


// export async function getOrderSummary(data: OrderSummaryInput) {
//     try {
//         const session = await checkUserRole();
//         const validation = orderSummarySchema.safeParse(data);
//         if (!validation.success) {
//             return {
//                 success: false,
//                 error: validation.error.issues[0]?.message || NOTIFICATIONS.ERROR.VALIDATION,
//             };
//         }

//         const { items, addressId } = validation.data;

//         const productIds = items.map((item) => item.productId);
//         const products = await prisma.product.findMany({
//             where: {
//                 id: { in: productIds },
//                 isActive: true,
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 price: true,
//                 stock: true,
//                 thumbnail: true,
//             },
//         });
//         if (products.length !== productIds.length) {
//             return {
//                 success: false,
//                 error: "One or more products not found or unavailable",
//             };
//         }
//         const orderItems = items.map((item) => {
//             const product = products.find((p) => p.id === item.productId);
//             if (!product) {
//                 throw new Error(`Product ${item.productId} not found`);
//             }
//             if (product.stock < item.quantity) {
//                 throw new Error(`Insufficient stock for ${product.name}`);
//             }
//             return {
//                 productId: product.id,
//                 name: product.name,
//                 price: Number(product.price),
//                 quantity: item.quantity,
//                 thumbnail: product.thumbnail,
//                 lineTotal: Number(product.price) * item.quantity,
//             };
//         });
//         const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
//         const shipping = subtotal >= 500 ? 0 : 50;
//         const taxRate = 0.18;
//         const tax = subtotal * taxRate;
//         const total = subtotal + shipping + tax;

//         let shippingAddress = null;
//         if (addressId) {
//             shippingAddress = await prisma.address.findFirst({
//                 where: {
//                     id: addressId,
//                     userId: session.user.id,
//                 },
//             });
//         }

//         return {
//             success: true,
//             data: {
//                 items: orderItems,
//                 subtotal: Math.round(subtotal * 100) / 100,
//                 shipping: Math.round(shipping * 100) / 100,
//                 tax: Math.round(tax * 100) / 100,
//                 total: Math.round(total * 100) / 100,
//                 shippingAddress,
//             },
//         };
//     } catch (error) {
//         console.error("Get order summary error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// export async function createOrder(data: CreateOrderInput) {
//     try {
//         const session = await checkUserRole();
//         const validation = createOrderSchema.safeParse(data);
//         if (!validation.success) {
//             return {
//                 success: false,
//                 error: validation.error.issues[0]?.message || NOTIFICATIONS.ERROR.VALIDATION,
//             };
//         }

//         const { items, shippingAddress, subtotal, shipping, tax, total, paymentMethod } = validation.data;

//         const productIds = items.map((item) => item.productId);
//         const products = await prisma.product.findMany({
//             where: {
//                 id: { in: productIds },
//                 isActive: true,
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 price: true,
//                 stock: true,
//             },
//         });

//         if (products.length !== productIds.length) {
//             return {
//                 success: false,
//                 error: "One or more products not found or unavailable",
//             };
//         }

//         for (const item of items) {
//             const product = products.find((p) => p.id === item.productId);
//             if (!product || product.stock < item.quantity) {
//                 return {
//                     success: false,
//                     error: `Insufficient stock for ${item.name}`,
//                 };
//             }
//         }

//         const order = await prisma.$transaction(async (tx) => {
//             const newOrder = await tx.order.create({
//                 data: {
//                     orderNumber: generateOrderNumber(),
//                     userId: session.user.id,
//                     subtotal,
//                     shipping,
//                     tax,
//                     total,
//                     shippingAddress,
//                     items: {
//                         create: items.map((item) => ({
//                             productId: item.productId,
//                             name: item.name,
//                             price: item.price,
//                             quantity: item.quantity,
//                         })),
//                     },
//                 },
//                 include: {
//                     items: true,
//                 },
//             });

//             for (const item of items) {
//                 await tx.product.update({
//                     where: { id: item.productId },
//                     data: {
//                         stock: {
//                             decrement: item.quantity,
//                         },
//                     },
//                 });
//             }

//             await tx.payment.create({
//                 data: {
//                     userId: session.user.id,
//                     orderId: newOrder.id,
//                     paymentMethod: paymentMethod,
//                     orderDetails: {
//                         orderNumber: newOrder.orderNumber,
//                         items: items,
//                         subtotal,
//                         shipping,
//                         tax,
//                         total,
//                         shippingAddress,
//                     },
//                     status: paymentMethod === "COD" ? "Pending" : "Awaiting Payment",
//                 },
//             });

//             return newOrder;
//         });

//         return {
//             success: true,
//             data: serializeOrder(order),
//             message: NOTIFICATIONS.ORDER.CREATED,
//         };
//     } catch (error) {
//         console.error("Create order error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// export async function getOrders() {
//     try {
//         const session = await checkUserRole();

//         const orders = await prisma.order.findMany({
//             where: {
//                 userId: session.user.id,
//             },
//             include: {
//                 items: {
//                     include: {
//                         product: {
//                             select: {
//                                 thumbnail: true,
//                             },
//                         },
//                     },
//                 },
//                 payment: true,
//             },
//             orderBy: {
//                 createdAt: "desc",
//             },
//         });

//         return {
//             success: true,
//             data: serializeOrders(orders),
//         };
//     } catch (error) {
//         console.error("Get orders error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// export async function getOrderById(orderId: string) {
//     try {
//         const session = await checkUserRole();

//         const order = await prisma.order.findFirst({
//             where: {
//                 id: orderId,
//                 userId: session.user.id,
//             },
//             include: {
//                 items: {
//                     include: {
//                         product: {
//                             select: {
//                                 thumbnail: true,
//                                 slug: true,
//                             },
//                         },
//                     },
//                 },
//                 payment: true,
//             },
//         });

//         if (!order) {
//             return {
//                 success: false,
//                 error: NOTIFICATIONS.ORDER.NOT_FOUND,
//             };
//         }

//         return {
//             success: true,
//             data: serializeOrder(order),
//         };
//     } catch (error) {
//         console.error("Get order error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// export async function cancelOrder(orderId: string) {
//     try {
//         const session = await checkUserRole();

//         const order = await prisma.order.findFirst({
//             where: {
//                 id: orderId,
//                 userId: session.user.id,
//             },
//             include: {
//                 items: true,
//             },
//         });

//         if (!order) {
//             return {
//                 success: false,
//                 error: NOTIFICATIONS.ORDER.NOT_FOUND,
//             };
//         }

//         if (order.status !== "PENDING") {
//             return {
//                 success: false,
//                 error: "Only pending orders can be cancelled",
//             };
//         }

//         const updatedOrder = await prisma.$transaction(async (tx) => {
//             const cancelled = await tx.order.update({
//                 where: { id: orderId },
//                 data: { status: "CANCELLED" },
//             });

//             for (const item of order.items) {
//                 await tx.product.update({
//                     where: { id: item.productId },
//                     data: {
//                         stock: {
//                             increment: item.quantity,
//                         },
//                     },
//                 });
//             }

//             return cancelled;
//         });

//         return {
//             success: true,
//             data: serializeOrder(updatedOrder),
//             message: NOTIFICATIONS.ORDER.CANCELLED,
//         };
//     } catch (error) {
//         console.error("Cancel order error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// /**
//  * Updates the quantity of an item in a pending order
//  */
// export async function updateOrderItemQuantity(orderId: string, itemId: string, newQuantity: number) {
//     try {
//         const session = await checkUserRole();

//         if (newQuantity < 1) {
//             return {
//                 success: false,
//                 error: "Quantity must be at least 1",
//             };
//         }

//         const order = await prisma.order.findFirst({
//             where: {
//                 id: orderId,
//                 userId: session.user.id,
//             },
//             include: {
//                 items: true,
//             },
//         });

//         if (!order) {
//             return {
//                 success: false,
//                 error: NOTIFICATIONS.ORDER.NOT_FOUND,
//             };
//         }

//         if (order.status !== "PENDING") {
//             return {
//                 success: false,
//                 error: "Order can only be modified while pending",
//             };
//         }

//         const orderItem = order.items.find((item) => item.id === itemId);
//         if (!orderItem) {
//             return {
//                 success: false,
//                 error: "Order item not found",
//             };
//         }

//         const product = await prisma.product.findUnique({
//             where: { id: orderItem.productId },
//         });

//         if (!product) {
//             return {
//                 success: false,
//                 error: "Product not found",
//             };
//         }

//         const quantityDiff = newQuantity - orderItem.quantity;
//         if (quantityDiff > 0 && product.stock < quantityDiff) {
//             return {
//                 success: false,
//                 error: `Insufficient stock for ${product.name}`,
//             };
//         }

//         const updatedOrder = await prisma.$transaction(async (tx) => {
//             // Update item quantity
//             await tx.orderItem.update({
//                 where: { id: itemId },
//                 data: { quantity: newQuantity },
//             });

//             // Adjust stock
//             await tx.product.update({
//                 where: { id: orderItem.productId },
//                 data: {
//                     stock: {
//                         decrement: quantityDiff,
//                     },
//                 },
//             });

//             // Recalculate totals
//             const updatedItems = await tx.orderItem.findMany({
//                 where: { orderId },
//             });

//             const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
//             const shipping = subtotal >= 500 ? 0 : 50;
//             const taxRate = 0.18;
//             const tax = subtotal * taxRate;
//             const total = subtotal + shipping + tax;

//             return await tx.order.update({
//                 where: { id: orderId },
//                 data: {
//                     subtotal,
//                     shipping,
//                     tax,
//                     total,
//                 },
//                 include: {
//                     items: {
//                         include: {
//                             product: {
//                                 select: {
//                                     thumbnail: true,
//                                 },
//                             },
//                         },
//                     },
//                     payment: true,
//                 },
//             });
//         });

//         return {
//             success: true,
//             data: serializeOrder(updatedOrder),
//             message: "Quantity updated successfully",
//         };
//     } catch (error) {
//         console.error("Update item quantity error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// /**
//  * Removes an item from a pending order
//  */
// export async function removeOrderItem(orderId: string, itemId: string) {
//     try {
//         const session = await checkUserRole();

//         const order = await prisma.order.findFirst({
//             where: {
//                 id: orderId,
//                 userId: session.user.id,
//             },
//             include: {
//                 items: true,
//             },
//         });

//         if (!order) {
//             return {
//                 success: false,
//                 error: NOTIFICATIONS.ORDER.NOT_FOUND,
//             };
//         }

//         if (order.status !== "PENDING") {
//             return {
//                 success: false,
//                 error: "Order can only be modified while pending",
//             };
//         }

//         if (order.items.length <= 1) {
//             return {
//                 success: false,
//                 error: "Cannot remove the only item in an order. Please cancel the order instead.",
//             };
//         }

//         const orderItem = order.items.find((item) => item.id === itemId);
//         if (!orderItem) {
//             return {
//                 success: false,
//                 error: "Order item not found",
//             };
//         }

//         const updatedOrder = await prisma.$transaction(async (tx) => {
//             // Remove item
//             await tx.orderItem.delete({
//                 where: { id: itemId },
//             });

//             // Restore stock
//             await tx.product.update({
//                 where: { id: orderItem.productId },
//                 data: {
//                     stock: {
//                         increment: orderItem.quantity,
//                     },
//                 },
//             });

//             // Recalculate totals
//             const updatedItems = await tx.orderItem.findMany({
//                 where: { orderId },
//             });

//             const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
//             const shipping = subtotal >= 500 ? 0 : 50;
//             const taxRate = 0.18;
//             const tax = subtotal * taxRate;
//             const total = subtotal + shipping + tax;

//             return await tx.order.update({
//                 where: { id: orderId },
//                 data: {
//                     subtotal,
//                     shipping,
//                     tax,
//                     total,
//                 },
//                 include: {
//                     items: {
//                         include: {
//                             product: {
//                                 select: {
//                                     thumbnail: true,
//                                 },
//                             },
//                         },
//                     },
//                     payment: true,
//                 },
//             });
//         });

//         return {
//             success: true,
//             data: serializeOrder(updatedOrder),
//             message: "Item removed successfully",
//         };
//     } catch (error) {
//         console.error("Remove order item error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }
