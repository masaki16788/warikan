export type Participant = {
  id: string;
  name: string;
};

export type Payment = {
  id: string;
  payerId: string;
  amount: number;
  purpose: string;
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
