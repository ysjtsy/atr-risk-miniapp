Component({
  properties: {
    text: {
      type: String,
      value: ''
    },
    loading: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    onTap() {
      // 把点击事件抛给外层页面
      this.triggerEvent('tap');
    }
  }
});
