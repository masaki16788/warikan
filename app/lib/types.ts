export type Participant = {
  id: string;
  name: string;
};

export type Currency = "JPY" | "USD" | "EUR";

export type Payment = {
  id: string;
  payerId: string;
  amount: number;
  purpose: string;
  currency: Currency;
  originalAmount: number;
  exchangeRate: number;
  rateTimestamp: number | null;
};

export type Balance = Participant & {
  paid: number;
  share: number;
  balance: number;
};

export type Transfer = {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
};

export type Settlement = {
  totalAmount: number;
  balances: Balance[];
  transfers: Transfer[];
};
