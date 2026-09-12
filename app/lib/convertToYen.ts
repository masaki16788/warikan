import type { Currency } from "./types";
import { roundConvertedAmount } from "./money";

type Conversion = {
  amount: number;
  exchangeRate: number;
  rateTimestamp: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export async function convertToYen(
  originalAmount: number,
  currency: Currency
): Promise<Conversion> {
  if (!Number.isFinite(originalAmount) || originalAmount <= 0) {
    throw new Error("金額は0より大きい数値を入力してください");
  }

  // 円の支払いでは外部APIを呼ばない。
  if (currency === "JPY") {
    if (!Number.isSafeInteger(originalAmount)) {
      throw new Error("円の金額は扱える範囲の整数で入力してください");
    }
    return { amount: originalAmount, exchangeRate: 1, rateTimestamp: null };
  }

  let data: unknown;
  try {
    const response = await fetch("/api/exchange-rates", {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error();
    data = await response.json();
  } catch {
    throw new Error("為替レートを取得できませんでした。時間をおいて再試行してください");
  }

  if (
    !isRecord(data) ||
    data.source !== "USD" ||
    !isPositiveNumber(data.timestamp) ||
    !Number.isSafeInteger(data.timestamp) ||
    data.timestamp > 8640000000000 ||
    !isRecord(data.quotes) ||
    !isPositiveNumber(data.quotes.USDJPY) ||
    (currency === "EUR" && !isPositiveNumber(data.quotes.USDEUR))
  ) {
    throw new Error("取得した為替レートの形式が正しくありません");
  }

  // 同じUSD基準のレートを使い、1通貨あたりの円レートにそろえる。
  const exchangeRate = currency === "USD"
    ? data.quotes.USDJPY
    : data.quotes.USDJPY / (data.quotes.USDEUR as number);
  const amount = roundConvertedAmount(
    originalAmount,
    data.quotes.USDJPY,
    currency === "USD" ? 1 : (data.quotes.USDEUR as number)
  );

  if (!isPositiveNumber(exchangeRate) || !Number.isSafeInteger(amount)) {
    throw new Error("円換算後の金額が扱える範囲を超えています");
  }

  return { amount, exchangeRate, rateTimestamp: data.timestamp };
}
