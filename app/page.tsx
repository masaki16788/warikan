"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >([]);
  function handleAddParticipant() {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      setNameError("参加者の名前を入力してください");
      return;
    }
    setNameError("");

    const participant = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };

    setParticipants([...participants, participant]);
    setName("");
  }
  const [nameError, setNameError] = useState("");
  function handleRemoveParticipant(id: string) {
    if (payments.some((payment) => payment.payerId === id)) {
      setParticipantError(
        "この参加者には支払い記録があります。先に支払い記録を削除してください"
      );
      return;
    }

    setParticipants(
      participants.filter((participant) => participant.id !== id)
    );

    if (payerId === id) {
      setPayerId("");
    }

    setParticipantError("");
  }
  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [payments, setPayments] = useState<
    { id: string; payerId: string; amount: number; purpose: string }[]
  >([]);

  const [paymentError, setPaymentError] = useState("");
  function handleAddPayment() {
    const numericAmount = Number(amount);
    const trimmedPurpose = purpose.trim();

    if (!participants.some((participant) => participant.id === payerId)) {
      setPaymentError("支払った人を選択してください");
      return;
    }

    if (!Number.isSafeInteger(numericAmount) || numericAmount <= 0) {
      setPaymentError("金額は1円以上の扱える範囲の整数で入力してください");
      return;
    }

    if (trimmedPurpose === "") {
      setPaymentError("用途を入力してください");
      return;
    }

    const payment = {
      id: crypto.randomUUID(),
      payerId,
      amount: numericAmount,
      purpose: trimmedPurpose,
    };

    setPayments([...payments, payment]);
    setPaymentError("");
    setAmount("");
    setPurpose("");
  }
  const [participantError, setParticipantError] = useState("");
  function handleRemovePayment(id: string) {
    setPayments(payments.filter((payment) => payment.id !== id));
    setParticipantError("");
  }
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

  const transfers: {
    fromId: string;
    fromName: string;
    toId: string;
    toName: string;
    amount: number;
  }[] = [];

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
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold">
            旅行の割り勘アプリ
          </h1>
          <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
            <h2>参加者</h2>

            <label htmlFor="participant-name">名前</label>
            <input
              id="participant-name"
              type="text"
              placeholder="例：田中さん"
              className="border rounded px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />


            <button
              type="button"
              onClick={handleAddParticipant}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              追加
            </button>
            {nameError && (
              <p role="alert" className="text-red-600">
                {nameError}
              </p>
            )}
            <ul>
              {participants.map((participant) => (
                <li key={participant.id} className="flex items-center gap-3">
                  <span>{participant.name}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(participant.id)}
                    className="text-red-600"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
            {participantError && (
              <p role="alert" className="text-red-600">
                {participantError}
              </p>
            )}
          </section>
          <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
            <h2>支払いの記録</h2>

            <div>
              <label htmlFor="payer">支払った人</label>
              <select 
                id="payer" 
                className="border rounded px-3 py-2" 
                value={payerId}
                onChange={(event) => setPayerId(event.target.value)}
                >
                <option value="">選択してください</option>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount">金額</label>
              <input
                id="amount"
                type="number"
                min="1"
                step="1"
                className="border rounded px-3 py-2"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <span>円</span>
            </div>

            <div>
              <label htmlFor="purpose">用途</label>
              <input
                id="purpose"
                type="text"
                placeholder="例：宿泊費"
                className="border rounded px-3 py-2"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleAddPayment}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              支払いを追加
            </button>
            {paymentError && (
              <p role="alert" className="text-red-600">
                {paymentError}
              </p>
            )}

            <ul>
              {payments.map((payment) => (
                <li key={payment.id} className="flex items-center gap-3">
                  <span>
                    {participants.find(
                      (participant) => participant.id === payment.payerId
                    )?.name}
                    ：{payment.amount.toLocaleString()}円／{payment.purpose}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemovePayment(payment.id)}
                    className="text-red-600"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
            <h2>負担額</h2>
            <p>総費用：{totalAmount.toLocaleString()}円</p>

            <ul>
              {balances.map((participant) => (
                <li key={participant.id}>
                  {participant.name}：
                  負担額 {participant.share.toLocaleString()}円／
                  {participant.balance > 0
                    ? `${participant.balance.toLocaleString()}円受け取る`
                    : participant.balance < 0
                      ? `${Math.abs(participant.balance).toLocaleString()}円支払う`
                      : "精算不要"}
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
            <h2>精算結果</h2>

            {participants.length === 0 ? (
              <p>まず参加者を登録してください。</p>
            ) : payments.length === 0 ? (
              <p>支払いを登録すると、精算結果が表示されます。</p>
            ) : transfers.length === 0 ? (
              <p>全員の負担がそろっているため、受け渡しは不要です。</p>
            ) : (
              <ul>
                {transfers.map((transfer) => (
                  <li key={`${transfer.fromId}-${transfer.toId}`}>
                    {transfer.fromName} → {transfer.toName}：
                    {transfer.amount.toLocaleString()}円
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
