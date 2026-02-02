// "use server";

// import { revalidatePath } from "next/cache";
// import { prisma } from "@/app/server/db";
// import { checkUserRole } from "@/app/shared/functions";
// import { reviewSchema } from "@/app/validation/review";

// // Type that matches what ProductDetails expects
// export interface ReviewResponse {
//     id: string;
//     author: string;
//     avatar?: string;
//     rating: number;
//     date: string;
//     comment: string;
//     likes: number;
// }

// export async function writeReview({
//     productId,
//     review,
//     rating = 5,
// }: {
//     productId: string;
//     review: string;
//     rating?: number;
// }) {
//     try {
//         const user = await checkUserRole();
//         const validate = reviewSchema.parse({ productId, review });
//         if (!validate) {
//             return {
//                 success: false,
//                 message: "Invalid data",
//             };
//         }

//         // Check if user already has a review for this product
//         const existingReview = await prisma.reviews.findUnique({
//             where: {
//                 userId_productId: {
//                     userId: user.user.id,
//                     productId,
//                 },
//             },
//         });

//         if (existingReview) {
//             return {
//                 success: false,
//                 message: "You have already reviewed this product",
//             };
//         }

//         const result = await prisma.reviews.create({
//             data: {
//                 userId: user.user.id,
//                 productId,
//                 review,
//                 rating,
//             },
//         });

//         revalidatePath(`/products/${productId}`);

//         return {
//             success: true,
//             message: "Review added successfully",
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: "Something went wrong",
//         };
//     }
// }

// export async function getReviews({ productId }: { productId: string }): Promise<{
//     success: boolean;
//     message: string;
//     data?: ReviewResponse[];
// }> {
//     try {
//         const reviews = await prisma.reviews.findMany({
//             where: {
//                 productId,
//             },
//             include: {
//                 user: {
//                     select: {
//                         name: true,
//                         image: true,
//                     },
//                 },
//             },
//             orderBy: {
//                 createdAt: "desc",
//             },
//         });

//         // Transform database records to match the UI interface
//         const transformedReviews: ReviewResponse[] = reviews.map((r) => ({
//             id: r.id,
//             author: r.user.name || "Anonymous",
//             avatar: r.user.image || undefined,
//             rating: r.rating,
//             date: r.createdAt.toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//             }),
//             comment: r.review,
//             likes: r.likes,
//         }));

//         return {
//             success: true,
//             message: "Reviews fetched successfully",
//             data: transformedReviews,
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: "Something went wrong",
//             data: [],
//         };
//     }
// }

// export async function getOverallRating({ productId }: { productId: string }): Promise<{
//     success: boolean;
//     message: string;
//     data?: {
//         averageRating: number;
//         totalReviews: number;
//     };
// }> {
//     try {
//         const result = await prisma.reviews.aggregate({
//             where: {
//                 productId,
//             },
//             _avg: {
//                 rating: true,
//             },
//             _count: {
//                 rating: true,
//             },
//         });

//         return {
//             success: true,
//             message: "Overall rating fetched successfully",
//             data: {
//                 averageRating: result._avg.rating ? Number(result._avg.rating.toFixed(1)) : 0,
//                 totalReviews: result._count.rating,
//             },
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: "Something went wrong",
//             data: {
//                 averageRating: 0,
//                 totalReviews: 0,
//             },
//         };
//     }
// }

// export async function getAllUserReviews() {
//     try {
//         const user = await checkUserRole();
//         const getReviews = await prisma.reviews.findMany({
//             where: {
//                 userId: user.user.id
//             },
//             include: {
//                 product: {
//                     include: {
//                         category: {
//                             select: {
//                                 id: true,
//                                 name: true,
//                                 slug: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         // Transform data to convert Prisma Decimal to number
//         const transformedReviews = getReviews.map((review) => ({
//             id: review.id,
//             review: review.review,
//             rating: review.rating,
//             productId: review.productId,
//             createdAt: review.createdAt,
//             updatedAt: review.updatedAt,
//             product: {
//                 id: review.product.id,
//                 name: review.product.name,
//                 slug: review.product.slug,
//                 description: review.product.description,
//                 price: Number(review.product.price),
//                 comparePrice: review.product.comparePrice ? Number(review.product.comparePrice) : null,
//                 stock: review.product.stock,
//                 images: review.product.images,
//                 thumbnail: review.product.thumbnail,
//                 isActive: review.product.isActive,
//                 isFeatured: review.product.isFeatured,
//                 categoryId: review.product.categoryId,
//                 brand: review.product.brand,
//                 tags: review.product.tags,
//                 specifications: review.product.specifications,
//                 createdAt: review.product.createdAt,
//                 updatedAt: review.product.updatedAt,
//                 category: review.product.category
//             }
//         }));

//         return {
//             success: true,
//             message: "Reviews fetched successfully",
//             data: transformedReviews
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: "Something went wrong",
//             data: []
//         };
//     }
// }