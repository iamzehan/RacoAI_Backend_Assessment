import { AxiosResponse } from "axios";
import { env } from "../../config/env.js";
import { bkashClient } from "../clients/bkash.client.js";
import { PaymentStrategy } from "./payment.strategy.js";

export class BKashStrategy implements PaymentStrategy {
  private idToken: string | null = null;

  /**
   * Generate a bKash access token.
   */
  private async grantToken(): Promise<string> {
    if (this.idToken) {
      return this.idToken;
    }

    const response = await bkashClient.post<
      {
        id_token: string;
      },
      AxiosResponse<{
        id_token: string;
      }>
    >(
      "/tokenized/checkout/token/grant",
      {
        app_key: env.BKASH_APP_KEY,
        app_secret: env.BKASH_APP_SECRET
      }
    );

    this.idToken = response.data.id_token;

    return this.idToken;
  }

  /**
   * Initiate a payment.
   */
  async initiatePayment(orderId: string): Promise<any> {
    const idToken = await this.grantToken();

    const response = await bkashClient.post(
      "/tokenized/checkout/create",
      {
        mode: "0011",
        payerReference: orderId,
        callbackURL: env.BKASH_CALLBACK_URL,
        amount: "0",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orderId
      },
      {
        headers: {
          Authorization: idToken,
          "X-APP-Key": env.BKASH_APP_KEY
        }
      }
    );

    return response.data;
  }

  /**
   * Execute payment after customer approval.
   */
  async verifyPayment(paymentID: string): Promise<any> {
    const idToken = await this.grantToken();

    const response = await bkashClient.post(
      "/tokenized/checkout/execute",
      {
        paymentID
      },
      {
        headers: {
          Authorization: idToken,
          "X-APP-Key": env.BKASH_APP_KEY
        }
      }
    );

    return response.data;
  }

  /**
   * Refund a payment.
   */
  async refund(transactionId: string): Promise<any> {
    const idToken = await this.grantToken();

    const response = await bkashClient.post(
      "/tokenized/checkout/payment/refund",
      {
        paymentID: transactionId,
        amount: "0",
        trxID: transactionId,
        sku: "",
        reason: "Requested by customer"
      },
      {
        headers: {
          Authorization: idToken,
          "X-APP-Key": env.BKASH_APP_KEY
        }
      }
    );

    return response.data;
  }
}