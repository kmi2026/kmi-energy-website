# KMI Energy 二次开发人员向导 (Developer Guide)

本文档主要面向 **前端开发工程师**。提供如何进行项目的二次开发、环境启动、修改业务逻辑以及样式扩展的核心参考。

---

## 1. 项目架构概述
- **核心构建**：纯原生 HTML5 与 Vanilla CSS/JS 配合构建的一套轻量化 Jamstack 应用，没有用到任何 React/Vue/Node.js 打包流（Webpack/Vite）。
- **组件系统**：采用业界标准的 `Swiper.js` 驱动全站子页面的产品与品牌无限轮播与滑动手势。
- **配置与数据**：所有动态文本和图片的注入配置均在 `/assets/data/zh.json` 和 `/en.json` 当中流转。

## 2. 本地调试与测试跑通 (Local Serving)
因为代码采用无依赖的纯原生技术，您可以不必 `npm run build`。最快的运行方式是：
1. `git clone` 代码库。
2. 使用 VS Code 打开主目录。
3. 安装并右键点击 `index.html`，选择 **Live Server** (VS Code 拓展)。
4. 尽情预览所有的界面变动。

> [!WARNING]
> 本地的表单由于直接发送 POST 到 Google Scripts，可能会有一定的跨域限制。正式环境下的 HTTPS 测试不会存在此问题。

## 3. 目录与资源组织
- `/assets/css/`：`styles.css` 管理所有界面的主题和样式代码。可根据最新 UI 需求在这里添加对应的查询断点规则。
- `/assets/js/`：`script.js`（核心逻辑和 DOM 添加） 以及 `lang.js`（用于前台的 i18n 语言加载流）。
- `/assets/data/`：语言映射模板 JSON，这才是您的 Data Store。若新添加 HTML 元素，请赋予其 `data-i18n="xxx"`，同时在 zh.json 和 en.json 内加入对应属性来使得双语同步起效。
- `/api/`：Vercel 的无服务器云函数 (Serverless Functions) 存放地，包含与 Sveltia CMS 进行的 OAuth Callback 认证模块。如果您只修改纯前端展示，则可以一辈子不碰该目录。

## 4. CMS 部署兼容性注意事项
前端所有被设定了动态注入的地方，**务必要在 `/admin/config.yml` 内同样完成对应数据字段的设计与绑定**，这样内容管理员在后台修改文本时，才会真正反映到生成的 JSON 内，避免两头割裂。
