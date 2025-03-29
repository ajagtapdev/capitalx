export interface CreditCard {
  id: number;
  cardName: string;      // e.g., "Chase Sapphire Reserve"
  holderName: string;    // e.g., "John Smith"
  number: string;
  expiry: string;
  type: string;
  color: string;
  securityCode: string;
  benefits?: string[];   // Card benefits/rewards
  apr?: string;          // Annual Percentage Rate
} 