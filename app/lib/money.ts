import type { Currency } from "./types";

export function parsePaymentAmount(text: string, currency: Currency): number {
  const trimmed = text.trim();
  const format = currency === "JPY" ? /^\d+$/ : /^\d+(\.\d{1,2})?$/;
  const amount = Number(trimmed);
  if (!format.test(trimmed) || !Number.isFinite(amount) || amount <= 0) {
    throw new Error(currency === "JPY"
      ? "金額は1円以上の整数で入力してください"
      : "金額は0より大きく、小数第2位までで入力してください");
  }
  if (amount > Number.MAX_SAFE_INTEGER / 100) {
    throw new Error("金額が扱える上限を超えています。金額を小さくしてください");
  }
  return amount;
}

export function roundConvertedAmount(
  originalAmount: number,
  usdJpy: number,
  usdCurrency = 1
): number {
  if (![originalAmount, usdJpy, usdCurrency].every(v => Number.isFinite(v) && v > 0)) {
    throw new Error("金額または為替レートが正しくありません");
  }
  const rounded = Math.round((originalAmount * usdJpy) / usdCurrency);
  if (!Number.isSafeInteger(rounded)) {
    throw new Error("円換算後の金額が扱える範囲を超えています");
  }
  return rounded;
}
