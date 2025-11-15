<template>
  <view class="section">
    <view class="label">{{ props.label }}</view>
    <view v-if="props.subLabel" class="sub-label">{{ props.subLabel }}</view>
    <slot />
  </view>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  subLabel: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.section {
  width: 100%;
  box-sizing: border-box;
}
</style>
