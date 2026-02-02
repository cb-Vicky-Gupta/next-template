/**
 * Utility functions for serializing Prisma data to plain objects
 * This is needed because Prisma returns Decimal objects which cannot be
 * passed directly to Client Components from Server Components
 */

/**
 * Converts Prisma Decimal values to numbers recursively in any object
 */
export function serializeData<T>(data: T): T {
    if (data === null || data === undefined) {
        return data;
    }

    // Handle Decimal type (has toNumber method)
    if (typeof data === 'object' && data !== null && 'toNumber' in data && typeof (data as any).toNumber === 'function') {
        return (data as any).toNumber() as T;
    }

    // Handle Date type - convert to ISO string for serialization
    if (data instanceof Date) {
        return data.toISOString() as unknown as T;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeData(item)) as T;
    }

    // Handle objects
    if (typeof data === 'object' && data !== null) {
        const serialized: Record<string, any> = {};
        for (const [key, value] of Object.entries(data)) {
            serialized[key] = serializeData(value);
        }
        return serialized as T;
    }

    // Return primitive values as-is
    return data;
}

/**
 * Serializes an order object, converting Decimal fields to numbers
 */
export function serializeOrder<T extends Record<string, any>>(order: T): T {
    return serializeData(order);
}

/**
 * Serializes an array of orders
 */
export function serializeOrders<T extends Record<string, any>>(orders: T[]): T[] {
    return orders.map(order => serializeOrder(order));
}
