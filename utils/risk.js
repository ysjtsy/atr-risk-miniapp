// utils/risk.js

/**
 * ATR 驱动 + 风控版仓位计算
 *
 * 已知：
 * - equity: 总本金（U）
 * - riskPercent: 单笔风险占比（%），例如 1, 2, 5
 * - leverage: 杠杆倍数，例如 3, 5
 * - entryPrice: 开仓价
 * - stopLossPrice: 止损价（由 ATR 决定）
 *
 * 目标：
 * - 先用 ATR 得到止损距离 stopDistance
 * - 再用 最大亏损金额 / 止损距离 推出 “风险意义下的名义仓位”
 * - 同时不能超过 杠杆允许的最大名义仓位
 * - 最终给出：名义仓位 & 数量（币）
 */
function calcPositionSize({
  equity,
  riskPercent,
  leverage,
  entryPrice,
  stopLossPrice
}) {
  if (
    !equity || equity <= 0 ||
    !riskPercent || riskPercent <= 0 ||
    !leverage || leverage <= 0 ||
    !entryPrice || entryPrice <= 0 ||
    !stopLossPrice || stopLossPrice <= 0
  ) {
    return null;
  }

  const stopDistance = Math.abs(entryPrice - stopLossPrice);
  if (stopDistance <= 0) return null;

  // 允许亏损金额 = 本金 × 单笔风险%
  const riskAmount = equity * (riskPercent / 100);

  // 仅由“风险 & 止损距离”推导出的名义仓位
  // 推导思路：亏损金额 = 仓位名义 × (止损距离 / 开仓价)
  // => 仓位名义 = 亏损金额 × 开仓价 / 止损距离
  const notionalByRisk = riskAmount * entryPrice / stopDistance;

  // 杠杆上限能提供的最大名义价值
  const maxNotionalByLev = equity * leverage;

  // 最终名义仓位：同时满足风险约束 & 杠杆上限
  const finalNotional = Math.min(notionalByRisk, maxNotionalByLev);

  const qty = finalNotional / entryPrice;

  return {
    riskAmount,        // 允许亏损金额
    stopDistance,      // 止损距离
    notionalByRisk,    // 仅由风险推导的名义仓位
    maxNotionalByLev,  // 杠杆允许的最大名义
    finalNotional,     // 实际使用的名义仓位
    qty                // 建议开仓数量（币）
  };
}

module.exports = {
  calcPositionSize
};
