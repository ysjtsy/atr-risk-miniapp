<template>
  <view v-if="props.atr" class="result-card-wrapper">
    <view class="direction-strip" :class="props.direction === 'long' ? 'strip-long' : 'strip-short'" />

    <view class="result-card">
      <view class="result-header">
        <view class="tag tag-symbol">{{ props.symbol }}</view>
        <view class="tag tag-interval">{{ props.interval }}</view>
        <view class="tag tag-direction">
          {{ props.direction === 'long' ? '多单计划' : '空单计划' }}
        </view>
      </view>

      <view class="result-row">
        <text class="result-label">ATR{{ props.atrPeriodInput }}</text>
        <text class="result-value">{{ props.atr }}</text>
      </view>

      <view class="result-row">
        <text class="result-label">Entry</text>
        <text class="result-value">{{ props.entryPriceInput }}</text>
      </view>

      <view class="result-row">
        <text class="result-label">Stop Loss</text>
        <text class="result-value">{{ props.stopLossPrice }}</text>
      </view>

      <view class="result-row result-small">
        <text class="result-label"></text>
        <text class="result-hint">({{ props.stopDistance }} 点距离)</text>
      </view>

      <view class="result-divider" />

      <view v-if="props.positionQty" class="risk-section">
        <view class="section-title">风险</view>

        <view class="result-row">
          <text class="result-label">风险 {{ props.riskPercentInput }}%</text>
          <text class="result-value">{{ props.riskAmount }}</text>
        </view>

        <view class="result-row">
          <text class="result-label">RR</text>
          <text class="result-value">{{ props.rrRatio }}</text>
        </view>

        <view class="result-divider" />

        <view class="section-title">仓位</view>

        <view class="result-row">
          <text class="result-label">名义仓位</text>
          <text class="result-value">{{ props.positionNotional }}</text>
        </view>

        <view class="result-row">
          <text class="result-label">仓位数量</text>
          <text class="result-value result-value-strong">{{ props.positionQty }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  symbol: {
    type: String,
    default: '',
  },
  interval: {
    type: String,
    default: '',
  },
  direction: {
    type: String,
    default: 'long',
  },
  atr: {
    type: String,
    default: '',
  },
  atrPeriodInput: {
    type: String,
    default: '',
  },
  entryPriceInput: {
    type: String,
    default: '',
  },
  stopLossPrice: {
    type: String,
    default: '',
  },
  riskPercentInput: {
    type: String,
    default: '',
  },
  riskAmount: {
    type: String,
    default: '',
  },
  stopDistance: {
    type: String,
    default: '',
  },
  positionNotional: {
    type: String,
    default: '',
  },
  positionQty: {
    type: String,
    default: '',
  },
  rrRatio: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="scss">
.result-card-wrapper {
  position: relative;
  margin-top: 24rpx;
}

.direction-strip {
  position: absolute;
  left: 0;
  top: 0;
  width: 8rpx;
  height: 100%;
  border-radius: 8rpx;
}

.strip-long {
  background-color: rgba(34, 197, 94, 0.85);
}

.strip-short {
  background-color: rgba(239, 68, 68, 0.85);
}

.result-card {
  padding: 26rpx 26rpx 30rpx 36rpx;
  border-radius: 20rpx;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10rpx 25rpx rgba(15, 23, 42, 0.08);
}

.result-header {
  display: flex;
  gap: 12rpx;
  margin-bottom: 18rpx;
}

.tag {
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
}

.tag-symbol {
  color: #111827;
}

.tag-interval {
  color: #6b7280;
}

.tag-direction {
  color: #0f766e;
  background-color: #ecfeff;
  border-color: #67e8f9;
}

.section-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10rpx;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.result-label {
  font-size: 26rpx;
  color: #6b7280;
}

.result-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
}

.result-value-strong {
  font-size: 30rpx;
  font-weight: 700;
  color: #2563eb;
}

.result-small .result-hint {
  font-size: 22rpx;
  color: #9ca3af;
}

.result-divider {
  margin: 16rpx 0;
  height: 1rpx;
  background-color: #e5e7eb;
}
</style>
