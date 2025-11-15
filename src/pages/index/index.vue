<template>
  <view class="container">
    <UiSection label="交易对">
      <picker mode="selector" :range="state.symbolOptions" @change="onSymbolSelect">
        <view class="picker">当前：{{ state.symbol }}</view>
      </picker>
    </UiSection>

    <UiSection label="最新价格">
      <view class="price-grid">
        <view class="price-item price-row-bg">
          <view class="price-title">现货</view>
          <view class="price-value">{{ state.spotPrice || '-' }}</view>
        </view>
        <view class="price-item price-row-bg">
          <view class="price-title">合约</view>
          <view class="price-value">{{ state.futuresPrice || '-' }}</view>
        </view>
        <view class="price-item price-row-bg">
          <view class="price-title">合约 - 现货</view>
          <view class="price-value" :class="priceDiffClass">
            {{ state.priceDiff || '-' }}
          </view>
        </view>
      </view>
      <view class="price-actions">
        <button class="mini-btn" size="mini" @tap="refreshPrices">刷新价格</button>
      </view>
    </UiSection>

    <UiSection label="K线周期（ATR 使用此周期）">
      <picker mode="selector" :range="state.intervalOptions" @change="onIntervalSelect">
        <view class="picker">当前：{{ state.interval }}</view>
      </picker>
    </UiSection>

    <UiSection label="ATR 周期">
      <input
        type="number"
        :value="state.atrPeriodInput"
        placeholder="14"
        @input="onInput('atrPeriodInput', $event)"
      />
    </UiSection>

    <UiSection label="ATR 倍数（例如 1.5）">
      <input
        type="digit"
        :value="state.atrMultInput"
        placeholder="1.5"
        @input="onInput('atrMultInput', $event)"
      />
    </UiSection>

    <UiSection label="风控参数">
      <view>
        <view class="sub-label">总本金（U）</view>
        <input
          type="digit"
          :value="state.equityInput"
          placeholder="例如 500"
          @input="onInput('equityInput', $event)"
        />

        <view class="sub-label">单笔风险（%）</view>
        <input
          type="digit"
          :value="state.riskPercentInput"
          placeholder="例如 1 或 2"
          @input="onInput('riskPercentInput', $event)"
        />

        <view class="sub-label">杠杆倍数</view>
        <input
          type="digit"
          :value="state.leverageInput"
          placeholder="例如 3 或 5"
          @input="onInput('leverageInput', $event)"
        />
      </view>
    </UiSection>

    <UiSection label="开仓方向">
      <picker mode="selector" :range="state.directionOptions" @change="onDirectionChange">
        <view class="picker">当前：{{ directionLabel }}</view>
      </picker>
    </UiSection>

    <UiSection label="开仓价（Entry Price）">
      <input
        type="digit"
        :value="state.entryPriceInput"
        placeholder="请输入手动开仓价"
        @input="onInput('entryPriceInput', $event)"
      />
    </UiSection>

    <UiButton text="计算 ATR、止损与仓位建议" :loading="state.loading" @tap="onCalcTap" />

    <UiResultCard
      :symbol="state.symbol"
      :interval="state.interval"
      :direction="state.direction"
      :atr="state.atr"
      :atrPeriodInput="state.atrPeriodInput"
      :entryPriceInput="state.entryPriceInput"
      :stopLossPrice="state.stopLossPrice"
      :riskPercentInput="state.riskPercentInput"
      :riskAmount="state.riskAmount"
      :stopDistance="state.stopDistance"
      :positionNotional="state.positionNotional"
      :positionQty="state.positionQty"
      :rrRatio="state.rrRatio"
    />

    <view v-if="state.error" class="error">
      {{ state.error }}
    </view>
  </view>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import UiButton from '@/components/ui-button.vue'
import UiResultCard from '@/components/ui-result-card.vue'
import UiSection from '@/components/ui-section.vue'
import { INTERVAL_OPTIONS, SYMBOL_OPTIONS } from '@/config/trading'
import { calcATR } from '@/utils/atr'
import { fetchCandlesFromBinance, fetchFuturesPrice, fetchSpotPrice } from '@/utils/binanceApi'
import { calcPositionSize } from '@/utils/risk'

const DIRECTION_OPTIONS = ['多单', '空单']
const DIRECTION_VALUES = ['long', 'short']

const state = reactive({
  symbolOptions: SYMBOL_OPTIONS,
  symbol: 'BTCUSDT',
  intervalOptions: INTERVAL_OPTIONS,
  interval: '1h',
  atrPeriodInput: '14',
  atrMultInput: '1.5',
  equityInput: '',
  riskPercentInput: '',
  leverageInput: '',
  entryPriceInput: '',
  directionOptions: DIRECTION_OPTIONS,
  direction: 'long',
  spotPrice: null,
  futuresPrice: null,
  priceDiff: null,
  loading: false,
  atr: null,
  stopLossPrice: null,
  error: '',
  rrRatio: null,
  riskAmount: null,
  stopDistance: null,
  positionNotional: null,
  positionQty: null,
})

const priceDiffClass = computed(() => {
  if (!state.priceDiff) return ''
  return parseFloat(state.priceDiff) >= 0 ? 'price-up' : 'price-down'
})

const directionLabel = computed(() => (state.direction === 'long' ? '多单' : '空单'))

const resetResults = () => {
  state.atr = null
  state.stopLossPrice = null
  state.riskAmount = null
  state.stopDistance = null
  state.positionNotional = null
  state.positionQty = null
  state.rrRatio = null
}

const setError = message => {
  state.error = message
  state.loading = false
  resetResults()
}

const onSymbolSelect = e => {
  const idx = Number(e.detail.value)
  const nextSymbol = state.symbolOptions[idx]
  if (!nextSymbol) return
  state.symbol = nextSymbol
  refreshPrices()
}

const onIntervalSelect = e => {
  const idx = Number(e.detail.value)
  const nextInterval = state.intervalOptions[idx]
  if (nextInterval) {
    state.interval = nextInterval
  }
}

const onDirectionChange = e => {
  const idx = Number(e.detail.value)
  const next = DIRECTION_VALUES[idx]
  if (!next) return
  state.direction = next
}

const onInput = (field, event) => {
  state[field] = event.detail.value
}

const refreshPrices = async () => {
  const { symbol } = state
  state.spotPrice = null
  state.futuresPrice = null
  state.priceDiff = null
  try {
    const [spot, fut] = await Promise.all([
      fetchSpotPrice(symbol),
      fetchFuturesPrice(symbol),
    ])
    const diff = fut - spot
    state.spotPrice = spot.toFixed(2)
    state.futuresPrice = fut.toFixed(2)
    state.priceDiff = diff.toFixed(2)
  } catch (err) {
    console.error('刷新价格失败', err)
    state.error = '刷新现货/合约价格失败（请检查合法域名配置）'
  }
}

const onCalcTap = async () => {
  const atrPeriod = parseInt(state.atrPeriodInput, 10)
  const atrMult = parseFloat(state.atrMultInput)
  const entryPrice = parseFloat(state.entryPriceInput)
  const equity = parseFloat(state.equityInput)
  const riskPercent = parseFloat(state.riskPercentInput)
  const leverage = parseFloat(state.leverageInput)

  if (!entryPrice || Number.isNaN(entryPrice) || entryPrice <= 0) {
    setError('开仓价无效，请输入开仓价')
    return
  }

  if (!atrPeriod || Number.isNaN(atrPeriod) || atrPeriod <= 0) {
    setError('ATR 周期无效，请输入大于 0 的整数')
    return
  }

  if (!atrMult || Number.isNaN(atrMult) || atrMult <= 0) {
    setError('ATR 倍数无效，请输入大于 0 的数字')
    return
  }

  state.loading = true
  state.error = ''
  resetResults()

  try {
    const candles = await fetchCandlesFromBinance(state.symbol, state.interval, 200)
    const atrValue = calcATR(candles, atrPeriod)
    if (!atrValue) {
      setError('K线数量不足，无法计算 ATR')
      return
    }

    let stopLossPrice = 0
    if (state.direction === 'long') {
      stopLossPrice = entryPrice - atrMult * atrValue
    } else {
      stopLossPrice = entryPrice + atrMult * atrValue
    }

    const riskDistance = Math.abs(entryPrice - stopLossPrice)
    const rrValue = atrMult
    const rrText = `1 : ${rrValue.toFixed(2)}`

    const baseResult = {
      loading: false,
      atr: atrValue.toFixed(2),
      stopLossPrice: stopLossPrice.toFixed(2),
      stopDistance: riskDistance.toFixed(2),
      rrRatio: rrText,
    }

    if (
      !Number.isNaN(equity) && equity > 0 &&
      !Number.isNaN(riskPercent) && riskPercent > 0 &&
      !Number.isNaN(leverage) && leverage > 0
    ) {
      const pos = calcPositionSize({
        equity,
        riskPercent,
        leverage,
        entryPrice,
        stopLossPrice,
      })

      if (pos) {
        Object.assign(state, {
          ...baseResult,
          riskAmount: pos.riskAmount.toFixed(2),
          positionNotional: pos.finalNotional.toFixed(2),
          positionQty: pos.qty.toFixed(4),
        })
        return
      }
    }

    Object.assign(state, {
      ...baseResult,
      riskAmount: null,
      positionNotional: null,
      positionQty: null,
    })
  } catch (err) {
    console.error('请求K线失败', err)
    setError('请求现货K线失败（请确认 api.binance.com 合法域名已配置）')
  }
}

onLoad(() => {
  refreshPrices()
})
</script>

<style scoped>
.error {
  margin-top: 24rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: rgba(248, 113, 113, 0.15);
  color: #b91c1c;
  text-align: center;
}
</style>
