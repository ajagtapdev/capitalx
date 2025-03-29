export interface CreditCard {
  id: number;
  cardName: string;      // e.g., "Chase Sapphire Reserve"
  holderName: string;    // e.g., "John Smith"
  number: string;
  expiry: string;
  type: "Visa Infinite" | "Visa Signature" | "American Express" | "Mastercard";
  color: string;
  securityCode: string;
} 