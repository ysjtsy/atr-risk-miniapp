<script setup>
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  const logs = uni.getStorageSync('logs') || []
  logs.unshift(Date.now())
  uni.setStorageSync('logs', logs)

  uni.login({
    success() {
      // 登录成功后可在此交换 openId/sessionKey
    },
    fail(err) {
      console.error('uni.login 失败', err)
    },
  })
})
</script>

<style lang="scss">
@import './uni.scss';
</style>
