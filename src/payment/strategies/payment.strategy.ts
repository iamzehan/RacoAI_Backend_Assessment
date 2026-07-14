export interface PaymentStrategy {
    initiatePayment(orderId: string): Promise<any>;

    verifyPayment(transactionId: string): Promise<any>;

    refund(transactionId: string): Promise<any>;
}