"use client";

import { useState } from "react";
import ParticipantSection from "./components/ParticipantSection";
import PaymentSection from "./components/PaymentSection";
import SettlementSection from "./components/SettlementSection";
import { calculateSettlement } from "./lib/calculateSettlement";
import type { Participant, Payment } from "./lib/types";

export default function Home() {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [nameError, setNameError] = useState("");
  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentError, setPaymentError] = useState("");
  const [participantError, setParticipantError] = useState("");

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
  function handleRemovePayment(id: string) {
    setPayments(payments.filter((payment) => payment.id !== id));
    setParticipantError("");
  }
  const settlement = calculateSettlement(participants, payments);
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold">
            旅行の割り勘アプリ
          </h1>
          <ParticipantSection
            name={name}
            participants={participants}
            nameError={nameError}
            participantError={participantError}
            setName={setName}
            handleAddParticipant={handleAddParticipant}
            handleRemoveParticipant={handleRemoveParticipant}
          />
          <PaymentSection
            participants={participants}
            payments={payments}
            payerId={payerId}
            amount={amount}
            purpose={purpose}
            paymentError={paymentError}
            setPayerId={setPayerId}
            setAmount={setAmount}
            setPurpose={setPurpose}
            handleAddPayment={handleAddPayment}
            handleRemovePayment={handleRemovePayment}
          />
          <SettlementSection
            settlement={settlement}
            participantCount={participants.length}
            paymentCount={payments.length}
          />
        </div>
      </main>
    </div>
  );
}
