import type { Participant, Payment } from "../lib/types";

type Props = {
  participants: Participant[];
  payments: Payment[];
  payerId: string;
  amount: string;
  purpose: string;
  paymentError: string;
  setPayerId: (id: string) => void;
  setAmount: (amount: string) => void;
  setPurpose: (purpose: string) => void;
  handleAddPayment: () => void;
  handleRemovePayment: (id: string) => void;
};

export default function PaymentSection({
  participants,
  payments,
  payerId,
  amount,
  purpose,
  paymentError,
  setPayerId,
  setAmount,
  setPurpose,
  handleAddPayment,
  handleRemovePayment,
}: Props) {
  return (
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
  );
}
