import { PaymentProvider } from "../generated/prisma/enums.js";

import { PaymentStrategy } from "./strategies/payment.strategy.js";
import { StripeStrategy } from "./strategies/stripe.strategy.js";
import { BKashStrategy } from "./strategies/bkash.strategy.js";

export class PaymentFactory {
  static create(provider: PaymentProvider): PaymentStrategy {
    switch (provider) {
      case PaymentProvider.STRIPE:
        return new StripeStrategy();

      case PaymentProvider.BKASH:
        return new BKashStrategy();

      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}