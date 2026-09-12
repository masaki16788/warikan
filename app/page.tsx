"use client";

import { useRef, useState } from "react";
import ParticipantSection from "./components/ParticipantSection";
import PaymentSection from "./components/PaymentSection";
import SettlementSection from "./components/SettlementSection";
import { parsePaymentAmount } from "./lib/money";
import { convertToYen } from "./lib/convertToYen";
import { calculateSettlement } from "./lib/calculateSettlement";
import type { Currency, Participant, Payment } from "./lib/types";


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
  const [currency, setCurrency] = useState<Currency>("JPY");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  function handleAddParticipant() {
    if (submittingRef.current) return;
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
    if (submittingRef.current) return;
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

  async function handleAddPayment() {
    if (submittingRef.current) return;
    let numericAmount: number;
    const trimmedPurpose = purpose.trim();

    if (!participants.some((participant) => participant.id === payerId)) {
      setPaymentError("支払った人を選択してください");
      return;
    }

    try {
      numericAmount = parsePaymentAmount(amount, currency);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "金額が正しくありません");
      return;
    }

    if (trimmedPurpose === "") {
      setPaymentError("用途を入力してください");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setPaymentError("");

    try {
      const converted = await convertToYen(numericAmount, currency);
      const total = payments.reduce((sum, payment) => sum + payment.amount, 0);

      if (!Number.isSafeInteger(total + converted.amount)) {
        throw new Error("合計金額が扱える範囲を超えています");
      }

      const payment: Payment = {
        id: crypto.randomUUID(),
        payerId,
        purpose: trimmedPurpose,
        currency,
        originalAmount: numericAmount,
        ...converted,
      };

      setPayments((current) => [...current, payment]);
      setAmount("");
      setPurpose("");
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "支払いを登録できませんでした"
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleRemovePayment(id: string) {
    if (submittingRef.current) return;
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
            isSubmitting={isSubmitting}
            name={name}
            participants={participants}
            nameError={nameError}
            participantError={participantError}
            setName={setName}
            handleAddParticipant={handleAddParticipant}
            handleRemoveParticipant={handleRemoveParticipant}
          />
          <PaymentSection
            isSubmitting={isSubmitting}
            currency={currency}
            setCurrency={setCurrency}
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
