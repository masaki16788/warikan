export async function GET() {
    const apiKey = process.env.EXCHANGERATE_API_KEY;

    if (!apiKey) {
        return Response.json(
            { error: "APIキーが設定されていません" },
            { status: 500 }
        );
    }

    const url = new URL("https://api.exchangerate.host/live");
    url.searchParams.set("access_key", apiKey);
    url.searchParams.set("currencies", "JPY,EUR");

    try {
        const response = await fetch(url, {
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return Response.json(
                { error: "為替APIから正常な応答がありませんでした" },
                { status: 502 }
            );
        }

        const data = await response.json();

        if (data?.success !== true) {
            return Response.json(
                {
                    error: "為替レートを取得できませんでした",
                    code:
                        typeof data?.error?.code === "number"
                            ? data.error.code
                            : null,
                },
                { status: 502 }
            );
        }

        return Response.json({
            source: data.source,
            timestamp: data.timestamp,
            quotes: data.quotes,
        });
    } catch {
        return Response.json(
            { error: "為替APIとの通信に失敗しました" },
            { status: 502 }
        );
    }
}