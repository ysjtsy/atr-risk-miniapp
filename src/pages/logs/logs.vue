<template>
  <view class="container">
    <UiSection label="历史记录" sub-label="最近操作时间戳">
      <scroll-view class="scrollarea" scroll-y>
        <view
          v-for="(log, index) in logs"
          :key="log.timeStamp"
          class="log-item"
        >
          {{ index + 1 }}. {{ log.date }}
        </view>
      </scroll-view>
    </UiSection>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import UiSection from '@/components/ui-section.vue'
import { formatTime } from '@/utils/util'

const logs = ref([])

const normalizeLogs = list =>
  list.map(log => ({
    date: formatTime(new Date(log)),
    timeStamp: log,
  }))

onLoad(() => {
  const stored = uni.getStorageSync('logs') || []
  logs.value = normalizeLogs(stored)
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.scrollarea {
  flex: 1;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

.log-item {
  margin-top: 20rpx;
  text-align: center;
}

.log-item:last-child {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
