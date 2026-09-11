import type { Participant, Payment, Settlement, Transfer } from "./types";

// 総費用の端数は参加者の登録順に配分し、同じ順で受け渡しを組み合わせる。
export function calculateSettlement(
  participants: Participant[],
  payments: Payment[]
): Settlement {
  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const baseShare =
    participants.length > 0
      ? Math.floor(totalAmount / participants.length)
      : 0;

  const remainder =
    participants.length > 0
      ? totalAmount % participants.length
      : 0;
  const balances = participants.map((participant, index) => {
    const paid = payments
      .filter((payment) => payment.payerId === participant.id)
      .reduce((total, payment) => total + payment.amount, 0);

    const share = baseShare + (index < remainder ? 1 : 0);

    return {
      id: participant.id,
      name: participant.name,
      paid,
      share,
      balance: paid - share,
    };
  });
  const receivers = balances
    .filter((participant) => participant.balance > 0)
    .map((participant) => ({
      id: participant.id,
      name: participant.name,
      remaining: participant.balance,
    }));

  const payers = balances
    .filter((participant) => participant.balance < 0)
    .map((participant) => ({
      id: participant.id,
      name: participant.name,
      remaining: -participant.balance,
    }));

  const transfers: Transfer[] = [];

  let payerIndex = 0;
  let receiverIndex = 0;

  while (
    payerIndex < payers.length &&
    receiverIndex < receivers.length
  ) {
    const payer = payers[payerIndex];
    const receiver = receivers[receiverIndex];

    const transferAmount = Math.min(
      payer.remaining,
      receiver.remaining
    );

    transfers.push({
      fromId: payer.id,
      fromName: payer.name,
      toId: receiver.id,
      toName: receiver.name,
      amount: transferAmount,
    });

    payer.remaining -= transferAmount;
    receiver.remaining -= transferAmount;

    if (payer.remaining === 0) {
      payerIndex += 1;
    }

    if (receiver.remaining === 0) {
      receiverIndex += 1;
    }
  }

  return { totalAmount, balances, transfers };
}
