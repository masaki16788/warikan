"use client";

import { useState } from "react";
import Image from "next/image";

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
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            旅行の割り勘アプリ
          </h1>
          <section>
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
          <section>
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
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert h-[14px] w-4"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
