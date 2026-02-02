// import { getServerSession } from "next-auth";
// import { authOptions } from "../services/NextOptions/auth";

// export async function checkAdminRole() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "ADMIN") {
//     throw new Error("Unauthorized: Admin access required");
//   }
//   return session;
// }
// export async function checkUserRole() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "USER") {
//     throw new Error("Unauthorized: User access required");
//   }
//   return session;
// }