# KMI Energy 网站项目完整操作与维护手册

本文档记录了 KMI Energy 网站项目的整体技术架构、部署详情、环境地址以及日常维护和重新部署的标准化流程。

## 1. 项目整体介绍
KMI Energy 官方企业网站是一个支持中英双语、带有现代化动态交互并且适配移动端/PC端的企业展示网站。项目旨在向全球客户高效呈现公司的四大核心业务：隔离降噪解决方案、燃气发电机组、燃气调压系统以及全球属地化运维。
网站抛弃了传统的重型后端数据库（如 PHP/MySQL 等），拥抱了现代化的 **Jamstack** (JavaScript, API, and Markup) 架构，这赋予了网站极快的全球加载速度、绝对的数据安全性和极低的服务器维护成本。

## 2. 网页前端技术实现
- **核心构建**：纯原生 HTML5 与 CSS3 配合 Vanilla JavaScript (原生 JS) 编写，代码通俗易懂，无需搭建复杂的 Node.js / Webpack 打包编译环境，降低了二开接手的门槛。
- **动态交互**：采用了业界标准的 `Swiper.js` 驱动所有子页面的产品与业务横向轮播图卡片，提供流畅的滑动与触控支持。
- **国际化 (i18n)**：基于前端 JavaScript 引擎与本地的 `assets/data/zh.json` (中文库) 和 `assets/data/en.json` (英文库) 数据映射机制。利用浏览器机制记录访客的语言偏好，在前端动态渲染并替换所有带有 `data-i18n` 属性的 DOM 标签。
- **表单系统**：网站底部的“联系我们 / 获取报价”表单集成使用了 Google Apps Script (GAS) 处理前端跨域 POST 请求，无需自建服务器即可实现留言自动写入 Google Sheets 电子表格，并向指定邮箱发送实时提醒通知。

## 3. CMS 后台管理与内容维护
- **CMS 选型**：采用了 **Sveltia CMS**（基于主流 Decap / Netlify CMS 优化的高性能、轻量化分支）。
- **Git-based 核心机制**：管理员不需要懂代码。您在 CMS 登录后可视化面板中所做的任何修改（更改文字、上传轮播图、添加产品列表等），点击保存后，CMS 会将您的修改自动转化为一个代码提交 (Git Commit) 并直接推送到 Github 源码库的 `main` 分支中。
- **安全鉴权代理**：因为网站是纯静态环境，为了安全链接上 Github 的 OAuth2.0 授权体系，我们在项目中开发了 Serverless Functions 无服务器代理接口（保存在 `netlify/functions` 目录下），用于保护敏感的密钥数据并执行 Github 的权限流转。

## 4. 源码托管与维护地址
所有源代码目前妥善保管在 Github 平台上，开发团队和技术接管人员可在如下地址进行拉取和审查：
- **代码托管平台**：Github
- **所属组织 (Organization)**：`kmi2026`
- **项目工程库名 (Repository)**：`kmi-energy-website`
- **🔗 源码主页维护地址**：[https://github.com/kmi2026/kmi-energy-website](https://github.com/kmi2026/kmi-energy-website)

## 5. 网站部署与外网访问地址
本项目目前挂载了代码仓库的双重部署通道，供日常运行与测试使用：

### ✅ 主通道：Netlify (推荐，CMS 必须走此通道)
Netlify 环境承载了我们开发的 Serverless 后端代理接口，因此它是完整运行后台功能的唯一环境。
- **部署平台**：Netlify
- **归属账号**：KMI2026 (通过 Github 授权登录绑定的 Netlify 账户)
- **🔗 官网生产环境外网地址**：[https://zingy-peony-812939.netlify.app/](https://zingy-peony-812939.netlify.app/)
- **🔗 CMS 管理后台访问地址**：[https://zingy-peony-812939.netlify.app/admin/](https://zingy-peony-812939.netlify.app/admin/) 
  *(切记：管理员编辑修改网站内容时，务必通过此链接登录！)*

### 备用通道：Github Pages (仅供纯前端展示)
- **部署平台**：Github Pages
- **🔗 备用展示测试地址**：[https://kmi2026.github.io/kmi-energy-website/](https://kmi2026.github.io/kmi-energy-website/)

## 6. 如何重新触发构建与部署
通常情况下，网站处于 **“全自动化免维护运作 (CI/CD)”** 状态：
当你无论是在 Github 直接修改代码文件、开发人员用终端 `git push`、还是非技术人员在 **CMS 中点击“发布/保存”** 时，Github 会自动发送一个隐藏的通信脉冲 (Webhook) 告诉 Netlify。Netlify 服务器收到信号后会立即拉取最新代码并静默更新网站，整个过程大约在 **1 ~ 2 分钟内全自动完成**，您只需要稍后强刷浏览器（Ctrl+F5 或 Shift+F5）即可看到变化。

**如果在极端情况下需要强行手动重发部署，请按如下流程操作：**
1. 访问 Netlify 官网 (`https://app.netlify.com/`)。
2. 使用 Github 账户联合登录 Netlify。
3. 在 Dashboard 中点击进入名为 `zingy-peony-812939` 的站点控制台。
4. 在页面左侧边栏或顶部导航点击进入 **Deploys** (部署详情页) 选项卡。
5. 在页面右侧找到并点击 **"Trigger deploy"** 按钮，在其下拉菜单中选择 **"Deploy site"** 或 **"Clear cache and deploy site"**。
6. 服务器即会强制清空老缓存，拉取 Github 上的最新代码执行重新发布。
