# LittleMei - 女装时尚购物平台 💖

一个现代化、功能完善的女装电商网站，使用 Vue 3 + Vite + Pinia 构建。

## ✨ 特性

### 🎨 UI/UX 设计
- **现代化界面**: 时尚、优雅的粉色主题设计
- **流畅动画**: 丰富的交互动画和过渡效果
- **响应式布局**: 完美适配桌面、平板和移动设备
- **优雅交互**: 悬停效果、点击反馈、平滑滚动

### 🛍️ 核心功能
- **商品展示**: 多种视图模式（网格、列表）
- **分类浏览**: 6大主要分类（外套、上衣、针织衫、连衣裙、牛仔裤、鞋子）
- **搜索功能**: 快速搜索商品
- **筛选排序**: 
  - 价格排序（低到高、高到低）
  - 评分排序
  - 人气排序
  - 价格区间筛选
  - 新品筛选

### 🛒 购物功能
- **购物车**: 
  - 实时更新商品数量
  - 数量增减控制
  - 总价计算
  - 下拉式迷你购物车
- **心愿单**:
  - 收藏喜欢的商品
  - 快速添加到购物车
  - 下拉式心愿单查看
- **快速添加**: 商品卡片上的快速添加按钮
- **实时通知**: Toast 提示反馈

### 📊 状态管理
- **Pinia Store**: 
  - `cartStore`: 购物车和心愿单管理
  - `productsStore`: 商品数据管理
- **持久化数据**: 产品分类和商品信息
- **计算属性**: 自动计算购物车总数和总价

### 🎯 促销活动
- **动态横幅**: 可关闭的促销信息
- **优惠码**: 促销代码展示
- **装饰动画**: 趣味化的浮动图标

### 📧 营销功能
- **邮件订阅**: Newsletter 订阅表单
- **统计展示**: 商品数量、用户数、分类数、评分等

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 自动打开并启用热重载

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
littlemei/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Header.vue       # 顶部导航（搜索、购物车、心愿单）
│   │   ├── PromoBanner.vue  # 促销横幅
│   │   └── Sidebar.vue      # 侧边栏分类导航
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页（Hero、分类、热门商品、Newsletter）
│   │   └── ProductList.vue  # 产品列表页（筛选、排序、商品网格）
│   ├── stores/              # Pinia 状态管理
│   │   ├── cart.js          # 购物车和心愿单 Store
│   │   └── products.js      # 商品数据 Store
│   ├── router/              # Vue Router 配置
│   │   └── index.js
│   ├── App.vue              # 根组件
│   ├── main.js              # 应用入口
│   └── style.css            # 全局样式
├── index.html               # HTML 入口
├── vite.config.js           # Vite 配置
├── package.json             # 项目配置
└── README.md                # 项目说明
```

## 🎨 设计特点

### 视觉设计
- **渐变背景**: 多彩的渐变色方案
- **卡片式布局**: 清晰的信息层次
- **圆角设计**: 柔和的视觉效果
- **阴影系统**: 3D 层次感

### 动画效果
- **悬停动画**: 卡片抬起、缩放效果
- **页面过渡**: 平滑的路由切换
- **加载动画**: 优雅的加载状态
- **Toast 通知**: 滑入滑出提示

### 交互设计
- **即时反馈**: 点击、悬停即时响应
- **下拉菜单**: 购物车和心愿单下拉框
- **快速操作**: 一键添加到购物车
- **双向绑定**: 实时搜索和筛选

## 🛠️ 技术栈

- **Vue 3**: Composition API + `<script setup>`
- **Vue Router 4**: 官方路由管理器
- **Pinia**: 新一代状态管理库
- **Vite**: 极速的开发构建工具
- **CSS3**: 现代化样式、动画、渐变

## 📱 响应式断点

- **桌面**: > 768px（完整功能）
- **平板**: ≤ 768px（优化布局）
- **移动**: < 480px（移动优先设计）

## 🎯 性能优化

- ⚡ **Vite 构建**: 快速的冷启动和热更新
- 🎨 **按需加载**: 路由级代码分割
- 💾 **状态管理**: Pinia 轻量高效
- 🖼️ **图片优化**: SVG 占位符（可替换为实际图片）
- ⚙️ **计算属性**: 缓存复杂计算结果
- 🔄 **虚拟滚动**: 大列表性能优化（待实现）

## 📝 核心功能实现

### 购物车系统
```javascript
// 添加商品
cartStore.addToCart(product)

// 更新数量
cartStore.updateQuantity(productId, quantity)

// 移除商品
cartStore.removeFromCart(productId)

// 获取总数和总价
cartStore.cartCount
cartStore.cartTotal
```

### 心愿单系统
```javascript
// 切换心愿单
cartStore.toggleWishlist(product)

// 检查商品是否在心愿单
cartStore.isInWishlist(productId)

// 心愿单数量
cartStore.wishlistCount
```

### 商品筛选
```javascript
// 按分类获取商品
productsStore.getProductsByCategory(categoryId)

// 获取新品
productsStore.newProducts

// 按 ID 获取商品
productsStore.getProductById(id)
```

## 🚧 待开发功能

- [ ] 产品详情页面
- [ ] 用户认证系统（登录/注册）
- [ ] 个人中心
- [ ] 订单管理
- [ ] 支付集成
- [ ] 商品评论系统
- [ ] 高级搜索功能
- [ ] 尺码指南
- [ ] 商品比较功能
- [ ] 优惠券系统
- [ ] 地址管理
- [ ] 物流跟踪
- [ ] 多语言支持（i18n）
- [ ] 后端 API 集成
- [ ] 数据持久化（LocalStorage/IndexedDB）
- [ ] 图片懒加载
- [ ] PWA 支持

## 🎓 学习要点

这个项目展示了以下 Vue 3 和现代前端开发的最佳实践：

1. **Composition API**: 使用 `<script setup>` 语法
2. **响应式系统**: `ref`、`computed`、`reactive`
3. **状态管理**: Pinia stores
4. **路由管理**: Vue Router
5. **组件通信**: Props、Emits、Provide/Inject
6. **生命周期**: `onMounted`、`onUnmounted` 等
7. **CSS 技巧**: Flexbox、Grid、动画、渐变
8. **用户体验**: 加载状态、错误处理、反馈提示

## 🤝 贡献

欢迎提交 Pull Request 或创建 Issue！

### 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 👥 作者

BeautyMe Team

---

**Enjoy shopping! 🛍️✨**
