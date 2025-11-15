<template>
  <button
    class="btn"
    :loading="props.loading"
    :disabled="props.disabled"
    @tap="handleTap"
  >
    {{ props.text }}
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['tap'])

const handleTap = () => {
  emit('tap')
}
</script>

<style scoped lang="scss">
.btn {
  width: 100%;
  border: none;
}
</style>
