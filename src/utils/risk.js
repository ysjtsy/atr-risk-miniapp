export function calcPositionSize({
  equity,
  riskPercent,
  leverage,
  entryPrice,
  stopLossPrice,
}) {
  if (
    !equity || equity <= 0 ||
    !riskPercent || riskPercent <= 0 ||
    !leverage || leverage <= 0 ||
    !entryPrice || entryPrice <= 0 ||
    !stopLossPrice || stopLossPrice <= 0
  ) {
    return null
  }

  const stopDistance = Math.abs(entryPrice - stopLossPrice)
  if (stopDistance <= 0) return null

  const riskAmount = equity * (riskPercent / 100)
  const notionalByRisk = (riskAmount * entryPrice) / stopDistance
  const maxNotionalByLev = equity * leverage
  const finalNotional = Math.min(notionalByRisk, maxNotionalByLev)
  const qty = finalNotional / entryPrice

  return {
    riskAmount,
    stopDistance,
    notionalByRisk,
    maxNotionalByLev,
    finalNotional,
    qty,
  }
}
