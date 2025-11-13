// pages/index/index.js

// 引入工具函数 & 配置
const { calcATR } = require('../../utils/atr.js');
const {
  fetchCandlesFromBinance,
  fetchSpotPrice,
  fetchFuturesPrice
} = require('../../utils/binanceApi.js');
const {
  SYMBOL_OPTIONS,
  INTERVAL_OPTIONS
} = require('../../config/trading.js');

Page({
  data: {
    // ▼ 交易对列表（默认 BTCUSDT）
    symbolOptions: SYMBOL_OPTIONS,
    symbol: 'BTCUSDT',

    // ▼ K线周期列表（用于 ATR）
    intervalOptions: INTERVAL_OPTIONS,
    interval: '1h',

    // 输入（全部用字符串，避免小数点被覆盖）
    atrPeriodInput: '14',
    atrMultInput: '1.5',
    entryPriceInput: '',

    directionOptions: ['多单', '空单'],
    direction: 'long',

    // 最新价格展示
    spotPrice: null,
    futuresPrice: null,
    priceDiff: null, // 合约 - 现货

    loading: false,
    atr: null,
    stopLossPrice: null,
    error: ''
  },

  onLoad() {
    // 初始化时拉一次价格
    this.refreshPrices();
  },

  // ▼ 交易对选择
  onSymbolSelect(e) {
    const idx = Number(e.detail.value);
    const symbol = this.data.symbolOptions[idx];
    this.setData({ symbol }, () => {
      this.refreshPrices();
    });
  },

  // ▼ K线周期选择
  onIntervalSelect(e) {
    const idx = Number(e.detail.value);
    this.setData({ interval: this.data.intervalOptions[idx] });
  },

  // ▼ 输入相关
  onAtrPeriodInput(e) {
    this.setData({ atrPeriodInput: e.detail.value });
  },

  onAtrMultInput(e) {
    this.setData({ atrMultInput: e.detail.value });
  },

  onDirectionChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ direction: idx === 0 ? 'long' : 'short' });
  },

  onEntryPriceInput(e) {
    this.setData({ entryPriceInput: e.detail.value });
  },

  // ▼ 刷新价格（现货 + 合约）
  refreshPrices() {
    const { symbol } = this.data;

    this.setData({
      spotPrice: null,
      futuresPrice: null,
      priceDiff: null
    });

    Promise.all([fetchSpotPrice(symbol), fetchFuturesPrice(symbol)])
      .then(([spot, fut]) => {
        const diff = fut - spot;
        this.setData({
          spotPrice: spot.toFixed(2),
          futuresPrice: fut.toFixed(2),
          priceDiff: diff.toFixed(2)
        });
      })
      .catch(err => {
        console.error('刷新价格失败', err);
        this.setData({
          error: '刷新现货/合约价格失败（请检查合法域名配置）'
        });
      });
  },

  // 一键用合约价填入开仓价
  onUseFuturesPrice() {
    const { futuresPrice } = this.data;
    if (!futuresPrice) {
      this.setData({ error: '暂未获取到合约价格，请先点击刷新价格' });
      return;
    }
    this.setData({
      entryPriceInput: String(futuresPrice),
      error: ''
    });
  },

  // ▼ 计算 ATR + 止损价
  onCalcTap() {
    const {
      atrPeriodInput,
      atrMultInput,
      entryPriceInput,
      direction,
      symbol,
      interval
    } = this.data;

    const atrPeriod = parseInt(atrPeriodInput, 10);
    const atrMult = parseFloat(atrMultInput);
    const entryPrice = parseFloat(entryPriceInput);

    if (!entryPrice || Number.isNaN(entryPrice) || entryPrice <= 0) {
      this.setData({
        error: '开仓价无效，请输入或使用“用合约价填入开仓价”',
        atr: null,
        stopLossPrice: null
      });
      return;
    }

    if (!atrPeriod || Number.isNaN(atrPeriod) || atrPeriod <= 0) {
      this.setData({
        error: 'ATR 周期无效，请输入大于 0 的整数',
        atr: null,
        stopLossPrice: null
      });
      return;
    }

    if (!atrMult || Number.isNaN(atrMult) || atrMult <= 0) {
      this.setData({
        error: 'ATR 倍数无效，请输入大于 0 的数字',
        atr: null,
        stopLossPrice: null
      });
      return;
    }

    this.setData({
      loading: true,
      error: '',
      atr: null,
      stopLossPrice: null
    });

    // 用现货K线算 ATR（更稳定，不受合约资金费率影响）
    fetchCandlesFromBinance(symbol, interval, 200)
      .then(candles => {
        const atr = calcATR(candles, atrPeriod);
        if (!atr) {
          this.setData({
            loading: false,
            error: 'K线数量不足，无法计算 ATR'
          });
          return;
        }

        let stopLoss;
        if (direction === 'long') {
          stopLoss = entryPrice - atrMult * atr;
        } else {
          stopLoss = entryPrice + atrMult * atr;
        }

        this.setData({
          loading: false,
          atr: atr.toFixed(2),
          stopLossPrice: stopLoss.toFixed(2)
        });
      })
      .catch(err => {
        console.error('请求K线失败', err);
        this.setData({
          loading: false,
          error: '请求现货K线失败（请确认 api.binance.com 合法域名已配置）'
        });
      });
  }
});