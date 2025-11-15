1. 设计目标

本规范用于统一本项目在 微信小程序 / H5 / App 的视觉与交互风格。目标：

专业、克制、接近交易终端（TradingView / Binance Pro）

浅色科技工具面板（与 styles/base.wxss 的实现保持一致）

组件可复用

对齐 TDesign 的思路：统一色板、统一圆角、统一间距、统一字号层级

便于未来扩展到 Web / iOS / Android

2. 色板规范（Colors）
2.1 基础色（与 styles/base.wxss 一致）
名称	用途	值
color.bg.body	页面背景	#F3F4F6
color.bg.card	普通卡片（Section/价格卡）	#FFFFFF
color.bg.cardElevated	强调卡片（结果卡片）	#FFFFFF（配合阴影）
color.border.subtle	普通边框	#E5E7EB
color.border.strong	强调边框	#D1D5DB
2.2 文本色
名称	用途	值
color.text.primary	主文案	#111827
color.text.secondary	字段标题	#4B5563
color.text.muted	弱说明文本	#6B7280
2.3 品牌与状态色
名称	用途	值
color.brand.primary	主按钮	渐变：#3B82F6 → #6366F1
color.state.long	多单高亮	#16A34A
color.state.short	空单高亮	#DC2626
color.state.warning	关键数值强调（例如仓位数量）	#2563EB
2.4 价格色（涨/跌）
名称	用途	值
color.price.up	价格上涨	#16A34A
color.price.down	价格下跌	#DC2626
2.5 错误提示
名称	用途	值
color.feedback.errorBg	错误背景	#FEE2E2
color.feedback.errorBorder	错误边框	#FCA5A5
color.feedback.errorText	错误文字	#B91C1C
3. 字体与字号（Typography）
名称	用途	样式
font.title	页面主标题	32rpx / 粗体
font.sectionLabel	Section 标题	26–28rpx / 500 / 次要色
font.subLabel	小标题（辅助字段）	24rpx / muted 色
font.body	内容正文	26–28rpx
font.small	注释文字	22–24rpx
font.numberStrong	关键数字（止损 / 仓位）	28–30rpx / 600–700 / warning 色
4. 间距与圆角（Spacing & Radius）
4.1 间距

全部基于 8 像素网格体系：

页面内边距：24rpx

Section 间距：24rpx

Section 内部 Padding：20rpx 22rpx

Label 与输入框：10–12rpx

Section 内行距：12–16rpx

4.2 圆角
元素	圆角
Section 卡片	18rpx
结果卡片	18rpx
按钮	14–16rpx
Tag	999rpx（全圆）
5. 组件规范（Components）

以下组件为整个项目的基础 UI 模块，所有页面应复用这些结构与样式。

5.1 页面容器
<view class="container"> ... </view>

background-color: color.bg.body
color: color.text.primary
padding: 24rpx
display: flex; flex-direction: column; gap: 24rpx

5.2 Section 卡片（表单区块）
<view class="section">
  <view class="label">字段名</view>
  <input ... />
</view>


视觉：

背景：color.bg.card

边框：1px solid color.border.subtle

圆角：18rpx

内边距：20rpx 22rpx

内部结构建议固定：

第一行：标题 .label

后续：输入框 / picker / second label 等

5.3 输入组件（Input / Picker）
<input class="input" />
<picker class="picker">...</picker>


规范：

边框：1px solid color.border.subtle

圆角：10rpx

padding：12–14rpx

字号：28rpx

背景：color.bg.card

文本：color.text.primary

5.4 主按钮（Primary Button）
<button class="btn">计算止损与仓位</button>


规范：

背景：主色渐变 color.brand.primary

字号：30rpx，font-weight: 600

padding：22rpx

圆角：16rpx

文字：#fff

5.5 次级按钮（Mini Button）
<view class="mini-btn">刷新价格</view>


规范：

边框：1px solid #374151

背景：color.bg.card

字号：24rpx

padding：8rpx 18rpx

圆角：999rpx

5.6 价格卡片（Price Grid）
<view class="price-grid">
  <view class="price-row-bg">
    <text class="price-title">现货</text>
    <text class="price-value price-up">42500.23</text>
  </view>
</view>


规范：

背景：color.bg.card

边框：1px solid color.border.subtle

行背景：轻灰透明 rgba(255,255,255,0.03)

涨跌色：price-up / price-down

5.7 Tag（币种 / 周期 / 多空）
<view class="tag tag-symbol">BTCUSDT</view>


样式：

padding：4rpx 12rpx

圆角：999rpx

字号：22rpx

边框：1px solid

变体：

tag-symbol（主文字）

tag-interval（次级）

tag-direction（绿色 / 红色依方向）

5.8 结果卡片（Result Card）

结构：

<view class="result-card-wrapper">
  <view class="direction-strip strip-long"></view>

  <view class="result-card">
    <view class="result-header"> ...tag...</view>
    <view class="result-row"> ... </view>
    <view class="result-divider"></view>
    <view class="result-row"> ... </view>
  </view>
</view>


视觉规范：

左侧色条：

.strip-long = 多单绿色

.strip-short = 空单红色

transition: 0.25s（方向切换动画）

卡片本体：

背景：color.bg.cardElevated（渐变）

边框：color.border.subtle

padding-left：28rpx（腾出色条空间）

圆角：18rpx

.result-row：左右对齐

.result-value-strong：强调重要数字

5.9 错误提示
<view class="error">输入错误，请检查风控参数</view>


样式：

背景：color.feedback.errorBg

边框：1px solid color.feedback.errorBorder

文字：color.feedback.errorText

圆角：12rpx

padding：16rpx 18rpx

6. 未来扩展到 H5 / App 的指导建议

H5 版本推荐用：

Vue + TDesign Vue

或 React + TDesign React
→ 色板、圆角、Tag 形态可与小程序完全一致

App 版本（原生/Flutter/RN）

自己封装 Button / Tag / Card

视觉全照本规范即可

7. 版本信息

UI 规范版本：v1.0

核心思想来源：TDesign + 专业交易终端风

适用范围：

微信小程序

未来 H5

原生 iOS / Android

设计者：顺治 × ChatGPT