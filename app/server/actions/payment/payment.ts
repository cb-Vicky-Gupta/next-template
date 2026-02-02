// "use server";

// import { prisma } from "@/app/server/db";
// import { NOTIFICATIONS } from "@/app/shared/constants/notification";
// import { checkUserRole } from "@/app/shared/functions";
// import { serializeData } from "@/app/shared/serialize";
// import { CreatePaymentOrderSchema, type CreatePaymentOrderInput } from "@/app/validation/payment";
// import { Cashfree, CFEnvironment } from "cashfree-pg";

// function getCashfreeClient() {
//     const appId = process.env.CASHFREE_APP_ID;
//     const secretKey = process.env.CASHFREE_SECRET_KEY;
//     // Use CASHFREE_ENVIRONMENT to control sandbox/production mode
//     // This allows deploying to production while still using sandbox for testing
//     const cashfreeEnv = process.env.CASHFREE_ENVIRONMENT || "sandbox";

//     if (!appId || !secretKey) {
//         console.error("Cashfree credentials missing:", {
//             CASHFREE_APP_ID: appId ? "✓ Set" : "✗ Missing",
//             CASHFREE_SECRET_KEY: secretKey ? "✓ Set" : "✗ Missing",
//         });
//         throw new Error("Cashfree API credentials are not configured. Please check CASHFREE_APP_ID and CASHFREE_SECRET_KEY in your .env file.");
//     }

//     // Only use production environment if explicitly set to "production"
//     const environment = cashfreeEnv === "production"
//         ? CFEnvironment.PRODUCTION
//         : CFEnvironment.SANDBOX;

//     console.log(`Initializing Cashfree in ${environment === CFEnvironment.PRODUCTION ? "PRODUCTION" : "SANDBOX"} mode (CASHFREE_ENVIRONMENT=${cashfreeEnv})`);

//     return new Cashfree(environment, appId, secretKey);
// }

// function generateOrderId(): string {
//     const timestamp = Date.now().toString(36).toUpperCase();
//     const random = Math.random().toString(36).substring(2, 8).toUpperCase();
//     return `ORD-${timestamp}-${random}`;
// }

// /**
//  * Creates an order with online payment and initiates Cashfree payment session
//  */
// export async function createOnlinePaymentOrder(data: CreatePaymentOrderInput) {
//     try {
//         const session = await checkUserRole();

//         const validationResult = CreatePaymentOrderSchema.safeParse(data);
//         if (!validationResult.success) {
//             return {
//                 success: false,
//                 error: validationResult.error.issues[0]?.message || NOTIFICATIONS.ERROR.VALIDATION,
//             };
//         }

//         const { items, shippingAddress, subtotal, shipping, tax, total, customerPhone } = validationResult.data;

//         // Validate products exist and have sufficient stock
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

//         // Check stock availability
//         for (const item of items) {
//             const product = products.find((p) => p.id === item.productId);
//             if (!product || product.stock < item.quantity) {
//                 return {
//                     success: false,
//                     error: `Insufficient stock for ${item.name}`,
//                 };
//             }
//         }

//         const orderId = generateOrderId();
//         const cashfree = getCashfreeClient();

//         // Create Cashfree order
//         const orderRequest = {
//             order_amount: total,
//             order_currency: "INR",
//             order_id: orderId,
//             customer_details: {
//                 customer_id: session.user.id,
//                 customer_phone: customerPhone,
//                 customer_email: session.user.email || "",
//                 customer_name: session.user.name || "",
//             },
//             order_meta: {
//                 // return_url: `${process.env.NEXT_PUBLIC_URL}/order-confirmation?order_id=${orderId}`,
//                 return_url: `${process.env.NEXT_PUBLIC_URL}/products`,
//             },
//         };

//         console.log("Creating Cashfree order with request:", JSON.stringify(orderRequest, null, 2));

//         let response;
//         try {
//             response = await cashfree.PGCreateOrder(orderRequest);
//         } catch (apiError: any) {
//             // Log detailed error from Cashfree
//             console.error("Cashfree API Error Details:", {
//                 status: apiError.response?.status,
//                 statusText: apiError.response?.statusText,
//                 data: apiError.response?.data,
//                 message: apiError.message,
//             });

//             const errorMessage = apiError.response?.data?.message ||
//                 apiError.response?.data?.error ||
//                 apiError.message ||
//                 "Failed to create payment order";
//             return {
//                 success: false,
//                 error: errorMessage,
//             };
//         }

//         if (response.status === 200 && response.data?.payment_session_id) {
//             // Create order in database with pending payment status
//             const order = await prisma.$transaction(async (tx) => {
//                 const newOrder = await tx.order.create({
//                     data: {
//                         orderNumber: orderId,
//                         userId: session.user.id,
//                         subtotal,
//                         shipping,
//                         tax,
//                         total,
//                         shippingAddress: shippingAddress,
//                         status: "PENDING",
//                         items: {
//                             create: items.map((item) => ({
//                                 productId: item.productId,
//                                 name: item.name,
//                                 price: item.price,
//                                 quantity: item.quantity,
//                             })),
//                         },
//                     },
//                     include: {
//                         items: true,
//                     },
//                 });

//                 // Reserve stock (decrement)
//                 for (const item of items) {
//                     await tx.product.update({
//                         where: { id: item.productId },
//                         data: {
//                             stock: {
//                                 decrement: item.quantity,
//                             },
//                         },
//                     });
//                 }

//                 // Create payment record
//                 await tx.payment.create({
//                     data: {
//                         userId: session.user.id,
//                         orderId: newOrder.id,
//                         paymentMethod: "ONLINE",
//                         orderDetails: {
//                             orderNumber: orderId,
//                             items: items,
//                             subtotal,
//                             shipping,
//                             tax,
//                             total,
//                             shippingAddress,
//                             cashfreeOrderId: response.data?.cf_order_id,
//                         },
//                         status: "Awaiting Payment",
//                     },
//                 });

//                 return newOrder;
//             });

//             return {
//                 success: true,
//                 data: {
//                     orderId: orderId,
//                     orderDbId: order.id,
//                     paymentSessionId: response.data.payment_session_id,
//                     cfOrderId: response.data.cf_order_id,
//                 },
//                 message: "Payment session created successfully",
//             };
//         } else {
//             return {
//                 success: false,
//                 error: NOTIFICATIONS.ORDER.PAYMENT_FAILED,
//             };
//         }
//     } catch (error) {
//         console.error("Create online payment order error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// /**
//  * Verifies payment status with Cashfree and updates order
//  */
// export async function verifyPaymentStatus(orderId: string) {
//     try {
//         const session = await checkUserRole();

//         const order = await prisma.order.findFirst({
//             where: {
//                 orderNumber: orderId,
//                 userId: session.user.id,
//             },
//             include: {
//                 payment: true,
//             },
//         });

//         if (!order) {
//             return {
//                 success: false,
//                 error: NOTIFICATIONS.ORDER.NOT_FOUND,
//             };
//         }

//         const cashfree = getCashfreeClient();
//         const response = await cashfree.PGOrderFetchPayments(orderId);

//         if (response.status === 200 && response.data && response.data.length > 0) {
//             const latestPayment = response.data[0];
//             const paymentStatus = latestPayment.payment_status;

//             let orderStatus: "CONFIRMED" | "CANCELLED" | "PENDING" = "PENDING";
//             let dbPaymentStatus = "Pending";

//             if (paymentStatus === "SUCCESS") {
//                 orderStatus = "CONFIRMED";
//                 dbPaymentStatus = "Completed";
//             } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
//                 orderStatus = "CANCELLED";
//                 dbPaymentStatus = "Failed";

//                 // Restore stock for failed payments
//                 const orderItems = await prisma.orderItem.findMany({
//                     where: { orderId: order.id },
//                 });

//                 for (const item of orderItems) {
//                     await prisma.product.update({
//                         where: { id: item.productId },
//                         data: {
//                             stock: {
//                                 increment: item.quantity,
//                             },
//                         },
//                     });
//                 }
//             }

//             // Update order and payment status
//             await prisma.$transaction([
//                 prisma.order.update({
//                     where: { id: order.id },
//                     data: { status: orderStatus },
//                 }),
//                 prisma.payment.updateMany({
//                     where: { orderId: order.id },
//                     data: { status: dbPaymentStatus },
//                 }),
//             ]);

//             return {
//                 success: true,
//                 data: {
//                     orderId: order.orderNumber,
//                     orderStatus,
//                     paymentStatus: dbPaymentStatus,
//                 },
//                 message: paymentStatus === "SUCCESS"
//                     ? NOTIFICATIONS.ORDER.PAYMENT_SUCCESS
//                     : NOTIFICATIONS.ORDER.PAYMENT_FAILED,
//             };
//         }

//         return {
//             success: true,
//             data: {
//                 orderId: order.orderNumber,
//                 orderStatus: order.status,
//                 paymentStatus: order.payment?.status || "Pending",
//             },
//         };
//     } catch (error) {
//         console.error("Verify payment status error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// export async function getPaymentStatus(orderId: string) {
//     try {
//         const session = await checkUserRole();

//         const payment = await prisma.payment.findFirst({
//             where: {
//                 order: {
//                     orderNumber: orderId,
//                 },
//                 userId: session.user.id,
//             },
//             include: {
//                 order: true,
//             },
//         });

//         if (!payment) {
//             return {
//                 success: false,
//                 error: NOTIFICATIONS.ORDER.NOT_FOUND,
//             };
//         }

//         return {
//             success: true,
//             data: serializeData(payment),
//             message: "Payment status retrieved successfully",
//         };
//     } catch (error) {
//         console.error("Get payment status error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// export async function getUserPayments() {
//     try {
//         const session = await checkUserRole();

//         const payments = await prisma.payment.findMany({
//             where: {
//                 userId: session.user.id,
//             },
//             include: {
//                 order: {
//                     select: {
//                         orderNumber: true,
//                         status: true,
//                         total: true,
//                     },
//                 },
//             },
//             orderBy: {
//                 createdAt: "desc",
//             },
//         });

//         return {
//             success: true,
//             data: serializeData(payments),
//             message: "Payments retrieved successfully",
//         };
//     } catch (error) {
//         console.error("Get user payments error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

// export async function updatePaymentStatus(orderId: string, status: string) {
//     try {
//         const session = await checkUserRole();

//         // Determine order status based on payment status
//         let orderStatus: "CONFIRMED" | "CANCELLED" | "PENDING" = "PENDING";
//         if (status === "Paid") {
//             orderStatus = "CONFIRMED";
//         } else if (status === "Failed") {
//             orderStatus = "CANCELLED";
//         }

//         // Update both payment and order status in a transaction
//         const result = await prisma.$transaction(async (tx) => {
//             const order = await tx.order.findFirst({
//                 where: {
//                     orderNumber: orderId,
//                     userId: session.user.id,
//                 },
//             });

//             if (!order) {
//                 throw new Error(NOTIFICATIONS.ORDER.NOT_FOUND);
//             }

//             // Update payment status
//             await tx.payment.updateMany({
//                 where: {
//                     orderId: order.id,
//                     userId: session.user.id,
//                 },
//                 data: {
//                     status: status,
//                 },
//             });

//             // Update order status
//             await tx.order.update({
//                 where: { id: order.id },
//                 data: { status: orderStatus },
//             });

//             // If payment failed, restore stock
//             if (status === "Failed") {
//                 const orderItems = await tx.orderItem.findMany({
//                     where: { orderId: order.id },
//                 });

//                 for (const item of orderItems) {
//                     await tx.product.update({
//                         where: { id: item.productId },
//                         data: {
//                             stock: {
//                                 increment: item.quantity,
//                             },
//                         },
//                     });
//                 }
//             }

//             return order;
//         });

//         return {
//             success: true,
//             message: NOTIFICATIONS.ORDER.UPDATED,
//             data: {
//                 orderId: result.orderNumber,
//                 orderStatus,
//                 paymentStatus: status,
//             },
//         };
//     } catch (error) {
//         console.error("Update payment status error:", error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : NOTIFICATIONS.ERROR.GENERIC,
//         };
//     }
// }

