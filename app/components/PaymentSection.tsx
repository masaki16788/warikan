import type { Currency, Participant, Payment } from "../lib/types";

type Props = {
  isSubmitting: boolean;
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
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export default function PaymentSection({
  isSubmitting,
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
  currency,
  setCurrency,
}: Props) {
  return (
    <section className="min-w-0 [overflow-wrap:anywhere] space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
      <fieldset disabled={isSubmitting} className="min-w-0 space-y-4 disabled:opacity-60">
      <h2>支払いの記録</h2>

      <div>
        <label htmlFor="payer">支払った人</label>
        <select
          id="payer"
          className="block w-full min-w-0 max-w-full border rounded px-3 py-2"
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
        <label htmlFor="currency">通貨</label>
        <select
          id="currency"
          value={currency}
          onChange={(event) => {
            const value = event.target.value;

            if (value === "JPY" || value === "USD" || value === "EUR") {
              setCurrency(value);
            }
          }}
          className="block w-full min-w-0 max-w-full border rounded px-3 py-2"
        >
          <option value="JPY">日本円（JPY）</option>
          <option value="USD">米ドル（USD）</option>
          <option value="EUR">ユーロ（EUR）</option>
        </select>
      </div>

      <div>
        <label htmlFor="amount">金額</label>
        <input
          id="amount"
          type="number"
          min={currency === "JPY" ? "1" : "0.01"}
          step={currency === "JPY" ? "1" : "0.01"}
          className="block w-full min-w-0 max-w-full border rounded px-3 py-2"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <span>{currency === "JPY" ? "円" : currency}</span>
      </div>

      <div>
        <label htmlFor="purpose">用途</label>
        <input
          id="purpose"
          type="text"
          placeholder="例：宿泊費"
          className="block w-full min-w-0 max-w-full border rounded px-3 py-2"
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={handleAddPayment}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        {isSubmitting ? "登録中…" : "支払いを追加"}
      </button>
      {paymentError && (
        <p role="alert" className="text-red-600">
          {paymentError}
        </p>
      )}

      <p className="text-sm text-zinc-600">
        外貨は登録時に取得した参考レートで円換算し、1円未満を四捨五入します。
        カードの実際の請求額とは異なる場合があります。
      </p>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id} className="flex items-start gap-3">
            <span className="min-w-0 flex-1">
              {participants.find(
                (participant) => participant.id === payment.payerId
              )?.name}
              ：{payment.amount.toLocaleString()}円／{payment.purpose}
              {payment.currency !== "JPY" && (
                <small className="block text-zinc-600">
                  元の金額：{payment.originalAmount.toLocaleString("ja-JP", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} {payment.currency}
                  ／1 {payment.currency}＝{payment.exchangeRate}円
                  {payment.rateTimestamp !== null && (
                    <>／レート日時：{new Date(payment.rateTimestamp * 1000).toISOString()}（UTC）</>
                  )}
                </small>
              )}
            </span>

            <button
              type="button"
              onClick={() => handleRemovePayment(payment.id)}
              className="shrink-0 whitespace-nowrap text-red-600"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      </fieldset>
    </section>
  );
}
