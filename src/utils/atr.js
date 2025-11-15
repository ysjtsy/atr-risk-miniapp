export function calcATR(candles, period) {
  if (!candles || candles.length < period + 1) return null

  const trs = []

  for (let i = 1; i < candles.length; i += 1) {
    const cur = candles[i]
    const prev = candles[i - 1]

    const range1 = cur.high - cur.low
    const range2 = Math.abs(cur.high - prev.close)
    const range3 = Math.abs(cur.low - prev.close)

    trs.push(Math.max(range1, range2, range3))
  }

  const lastTR = trs.slice(-period)
  const avg = lastTR.reduce((a, b) => a + b, 0) / lastTR.length

  return avg
}
