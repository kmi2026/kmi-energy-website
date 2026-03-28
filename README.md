# 🌍 KMI Energy 企业官网 (Enterprise Website)

欢迎来到 **KMI Energy** 官方商业网站与后台仓库。本项目通过现代化的 Jamstack 架构搭建出全静态安全防泄漏的轻薄网页体验，搭配强悍的 Sveltia CMS 实现实时化内容编辑方案。

## 📖 角色引导全矩阵 (Role-Based Guidelines)
为了满足不同企业角色的快速上手需求，本项目将技术说明、环境运行以及排版指南高度模块化并收录在了 `docs/` 目录中。请根据您的职责直接进入阅读范围内的核心操作向导：

| 专有向导 | 面向角色受众 | 内容范围说明 |
| :--- | :--- | :--- |
| **[👑 网站管理员手册](./docs/01_Site_Admin_Guide.md)** | **Site Admin** (系统安全/最高权限者) | 介绍站点的顶级管理权限、Vercel部署流程、Github OAuth2 鉴权、架构全解与数据绑定说明。 |
| **[✍️ 内容编辑手册](./docs/02_Content_Editor_Guide.md)** | **Content Editor** (运营/市场文案员) | 一篇**不含任何代码**的傻瓜式指南。带您用表单编辑页实现多语言无缝发布和网站产品大图的增减管理操作。 |
| **[🛠️ 网站运维指南](./docs/03_Site_Ops_Guide.md)** | **Site Ops** (网站运维/DNS 解析专员) | 用于域名关联配置、域名上线流程、检查 Vercel 自动化构建死锁，手动强制清缓存上线记录。 |
| **[👨‍💻 开发者接手指南](./docs/04_Developer_Guide.md)** | **Developer** (前端工程师/二次修改) | 面向前端人员阅读本地环境设置、纯 HTML/JS 组件体系，和对 CSS 全局化调试等开发规范细节。 |

## ⚙️ 核心技术栈概览
- **前端构建框架**：原生的 JavaScript + Vanilla HTML / CSS (0 配置、高容错、快速起跑)
- **视觉动态**：`Swiper.js` 结合纯 CSS CSS3 属性实现炫酷动画效果与 3D 透视流转。
- **动态语言 (i18n)**：基于 `en.json` 和 `zh.json` 的前端文本提取。
- **内容存储与发布平台**：Vercel Serverless 及 CDN。
- **管理后台面板**：[`sveltia-cms`](https://github.com/sveltia/sveltia-cms)

---

**开源及内部许可信息：**
此项目隶属于 KMI Energy 全资财产。所有设计切图文件与架构数据保留相关一切权利。
