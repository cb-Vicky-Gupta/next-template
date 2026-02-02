// ==================== NOTIFICATION MESSAGES ====================

// Generic Messages
export const NOTIFICATIONS = {
    // Success Messages
    SUCCESS: {
        CREATED: "Created successfully",
        UPDATED: "Updated successfully",
        DELETED: "Deleted successfully",
        SAVED: "Saved successfully",
        UPLOADED: "Uploaded successfully",
        SENT: "Sent successfully",
    },

    // Error Messages
    ERROR: {
        GENERIC: "Something went wrong. Please try again.",
        NOT_FOUND: "Resource not found",
        UNAUTHORIZED: "You are not authorized to perform this action",
        FORBIDDEN: "Access denied",
        VALIDATION: "Please check your input and try again",
        SERVER: "Server error. Please try again later.",
        NETWORK: "Network error. Please check your connection.",
        TIMEOUT: "Request timed out. Please try again.",
    },

    // Auth Messages
    AUTH: {
        LOGIN_SUCCESS: "Logged in successfully",
        LOGIN_FAILED: "Invalid email or password",
        LOGOUT_SUCCESS: "Logged out successfully",
        REGISTER_SUCCESS: "Account created successfully",
        REGISTER_FAILED: "Failed to create account",
        PASSWORD_RESET_SENT: "Password reset link sent to your email",
        PASSWORD_RESET_SUCCESS: "Password reset successfully",
        SESSION_EXPIRED: "Your session has expired. Please login again.",
        ACCOUNT_LOCKED: "Account locked. Please contact support.",
        EMAIL_VERIFIED: "Email verified successfully",
        EMAIL_NOT_VERIFIED: "Please verify your email first",
    },

    // Category Messages
    CATEGORY: {
        CREATED: "Category created successfully",
        UPDATED: "Category updated successfully",
        DELETED: "Category deleted successfully",
        NOT_FOUND: "Category not found",
        ALREADY_EXISTS: "Category with this name already exists",
        DELETE_FAILED: "Cannot delete category with associated products",
    },

    // Product Messages
    PRODUCT: {
        CREATED: "Product created successfully",
        UPDATED: "Product updated successfully",
        DELETED: "Product deleted successfully",
        NOT_FOUND: "Product not found",
        OUT_OF_STOCK: "Product is out of stock",
        ADDED_TO_CART: "Product added to cart",
        REMOVED_FROM_CART: "Product removed from cart",
        ADDED_TO_WISHLIST: "Product added to wishlist",
        REMOVED_FROM_WISHLIST: "Product removed from wishlist",
        ALREADY_IN_CART: "Product already in cart",
        ALREADY_IN_WISHLIST: "Product already in wishlist",
    },

    // Order Messages
    ORDER: {
        CREATED: "Order placed successfully",
        UPDATED: "Order updated successfully",
        CANCELLED: "Order cancelled successfully",
        NOT_FOUND: "Order not found",
        PAYMENT_SUCCESS: "Payment successful",
        PAYMENT_FAILED: "Payment failed. Please try again.",
        SHIPPED: "Order has been shipped",
        DELIVERED: "Order delivered successfully",
        REFUND_INITIATED: "Refund initiated successfully",
        REFUND_COMPLETED: "Refund completed successfully",
    },

    // User Messages
    USER: {
        PROFILE_UPDATED: "Profile updated successfully",
        PASSWORD_CHANGED: "Password changed successfully",
        EMAIL_UPDATED: "Email updated successfully",
        ACCOUNT_DELETED: "Account deleted successfully",
        ADDRESS_ADDED: "Address added successfully",
        ADDRESS_UPDATED: "Address updated successfully",
        ADDRESS_DELETED: "Address deleted successfully",
    },

    // Cart Messages
    CART: {
        UPDATED: "Cart updated successfully",
        CLEARED: "Cart cleared successfully",
        ITEM_ADDED: "Item added to cart",
        ITEM_REMOVED: "Item removed from cart",
        QUANTITY_UPDATED: "Quantity updated",
        EMPTY: "Your cart is empty",
    },

    // Review Messages
    REVIEW: {
        CREATED: "Review submitted successfully",
        UPDATED: "Review updated successfully",
        DELETED: "Review deleted successfully",
        ALREADY_REVIEWED: "You have already reviewed this product",
    },

    // Coupon Messages
    COUPON: {
        APPLIED: "Coupon applied successfully",
        REMOVED: "Coupon removed",
        INVALID: "Invalid coupon code",
        EXPIRED: "This coupon has expired",
        NOT_APPLICABLE: "Coupon not applicable for this order",
        MINIMUM_NOT_MET: "Minimum order amount not met for this coupon",
    },

    // File Upload Messages
    UPLOAD: {
        SUCCESS: "File uploaded successfully",
        FAILED: "File upload failed",
        SIZE_EXCEEDED: "File size exceeds the limit",
        INVALID_TYPE: "Invalid file type",
        TOO_MANY_FILES: "Too many files selected",
    },

    // Admin Messages
    ADMIN: {
        USER_CREATED: "User created successfully",
        USER_UPDATED: "User updated successfully",
        USER_DELETED: "User deleted successfully",
        USER_BLOCKED: "User blocked successfully",
        USER_UNBLOCKED: "User unblocked successfully",
        ROLE_UPDATED: "User role updated successfully",
        SETTINGS_UPDATED: "Settings updated successfully",
    },
} as const;

// Type exports for better TypeScript support
export type NotificationType = typeof NOTIFICATIONS;
