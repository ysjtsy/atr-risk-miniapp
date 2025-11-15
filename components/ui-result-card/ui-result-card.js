Component({
  options: {
    styleIsolation: 'apply-shared'   // ⭐ 关键：允许页面样式作用到组件
  },
  properties: {
    symbol: String,
    interval: String,
    direction: {
      type: String,
      value: 'long' // long / short
    },
    atr: String,
    atrPeriodInput: String,
    entryPriceInput: String,
    stopLossPrice: String,
    riskPercentInput: String,
    riskAmount: String,
    stopDistance: String,
    positionNotional: String,
    positionQty: String,
    rrRatio: String
  },
  data: {},
  methods: {}
});
