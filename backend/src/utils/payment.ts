import crypto from "crypto";

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean => {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
};

export const verifyWebhookSignature = (
  body: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
};

export const calculatePricing = (
  tickets: Array<{ qty: number; unitPrice: number; taxPercent: number }>
) => {
  let subtotal = 0;
  let tax = 0;

  tickets.forEach((ticket) => {
    const itemSubtotal = ticket.qty * ticket.unitPrice;
    const itemTax = itemSubtotal * (ticket.taxPercent / 100);
    subtotal += itemSubtotal;
    tax += itemTax;
  });

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round((subtotal + tax) * 100) / 100,
  };
};
