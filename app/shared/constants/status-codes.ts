// ==================== HTTP STATUS CODES ====================

export const STATUS_CODES = {
    // 2xx Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // 3xx Redirection
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,

    // 4xx Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // 5xx Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const;

// Status code messages for API responses
export const STATUS_MESSAGES = {
    // 2xx Success
    [STATUS_CODES.OK]: "Success",
    [STATUS_CODES.CREATED]: "Resource created successfully",
    [STATUS_CODES.ACCEPTED]: "Request accepted",
    [STATUS_CODES.NO_CONTENT]: "No content",

    // 4xx Client Errors
    [STATUS_CODES.BAD_REQUEST]: "Bad request",
    [STATUS_CODES.UNAUTHORIZED]: "Authentication required",
    [STATUS_CODES.PAYMENT_REQUIRED]: "Payment required",
    [STATUS_CODES.FORBIDDEN]: "Access forbidden",
    [STATUS_CODES.NOT_FOUND]: "Resource not found",
    [STATUS_CODES.METHOD_NOT_ALLOWED]: "Method not allowed",
    [STATUS_CODES.CONFLICT]: "Resource conflict",
    [STATUS_CODES.UNPROCESSABLE_ENTITY]: "Validation failed",
    [STATUS_CODES.TOO_MANY_REQUESTS]: "Too many requests",

    // 5xx Server Errors
    [STATUS_CODES.INTERNAL_SERVER_ERROR]: "Internal server error",
    [STATUS_CODES.SERVICE_UNAVAILABLE]: "Service unavailable",
    [STATUS_CODES.GATEWAY_TIMEOUT]: "Gateway timeout",
} as const;

// Helper function to check if status code is successful
export function isSuccessStatus(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
}

// Helper function to check if status code is client error
export function isClientError(statusCode: number): boolean {
    return statusCode >= 400 && statusCode < 500;
}

// Helper function to check if status code is server error
export function isServerError(statusCode: number): boolean {
    return statusCode >= 500 && statusCode < 600;
}

// Type exports
export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
