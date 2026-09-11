import type { Settlement } from "../lib/types";

type Props = {
  settlement: Settlement;
  participantCount: number;
  paymentCount: number;
};

export default function SettlementSection({
  settlement,
  participantCount,
  paymentCount,
}: Props) {
  const { totalAmount, balances, transfers } = settlement;

  return (
    <>
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

        {participantCount === 0 ? (
          <p>まず参加者を登録してください。</p>
        ) : paymentCount === 0 ? (
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
    </>
  );
}
