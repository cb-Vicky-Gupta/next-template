// Type declarations for @cashfreepayments/cashfree-js
declare module "@cashfreepayments/cashfree-js" {
    interface CashfreeLoadOptions {
        mode: "sandbox" | "production";
    }

    interface CheckoutOptions {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank" | "_modal";
        returnUrl?: string;
    }

    interface PaymentError {
        code?: string;
        message?: string;
    }

    interface PaymentDetails {
        paymentMessage?: string;
    }

    interface CheckoutResult {
        error?: PaymentError;
        redirect?: boolean;
        paymentDetails?: PaymentDetails;
    }

    interface CashfreeInstance {
        checkout: (options: CheckoutOptions) => Promise<CheckoutResult>;
    }

    export function load(options: CashfreeLoadOptions): Promise<CashfreeInstance>;
}
