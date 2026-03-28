# KMI Energy 网站管理员手册 (Site Admin Guide)

本文档面向 **网站所有者 / 系统管理员 (Admin)**。在此您可以了解网站的整体架构、权限分配策略以及系统级的服务集成。

---

## 1. 架构概览与优势 (Jamstack 体系)
本项目采用 **Jamstack** (JavaScript, API, Markup) 现代前端架构构建：
- **纯静态前台**：无任何 PHP/MySQL 等传统重型数据库，网页在全球 CDN（Vercel）节点分发，具有极速的加载体验和 **100% 的防黑客注入安全性**。
- **无服务器后端 (Serverless)**：所有敏感功能（如 CMS 登录鉴权回调）全部部署在 Vercel 的 `/api` 边缘函数通道内，零运维成本。

## 2. 源码部署位置与控制权限
- **代码仓库托管**：Github (组织：`kmi2026`, 仓库名：`kmi-energy-website`)
- **部署平台 (Host)**：[Vercel](https://vercel.com/) (归属账号绑定的 KMI2026)
- **CMS 强依赖关系**：由于 CMS 需要经 Github 的 OAuth 进行鉴权登录，然后对 `main` 分支进行合并操作，因此管理员必须妥善保管 Github 账号密码。
- **权限管理机制**：任何人要想在 `https://www.kmienergy.com/admin` 成功登录，其 Github 账号必须作为 Collaborator 被添加到 `kmi2026/kmi-energy-website` 仓库的白名单中。如果您需要将网站管理权限下发给其他同事，请按照 [02_Content_Editor_Guide.md](./02_Content_Editor_Guide.md) 的说明操作。

## 3. CMS Auth 后台鉴权配置 (OAUTH)
网站后台（Sveltia CMS）依赖 Github App 鉴权。如果未来更换域名或仓库，您必须更新 OAUTH 配置：

> [!CAUTION]
> 严重警告：修改此项会导致所有后台用户重新登录，配置错误将直接导致后台瘫痪。

### GitHub 端设定
1. 使用管理员账号登录 Github，前往 `Settings` -> 左下角 `Developer Settings` -> `OAuth Apps` -> 选择您的 CMS 应用。
2. **Homepage URL** 需设置为正式地址：`https://www.kmienergy.com` 
3. **Authorization callback URL** 必须设置为带 API 的完整路径：`https://www.kmienergy.com/api/callback`

### Vercel 端环境变量
在 Vercel 中，找到项目设置 (Settings) -> Environment Variables，需确保填写了前一步应用生成的凭证：
- **`GITHUB_CLIENT_ID`**
- **`GITHUB_CLIENT_SECRET`** (切勿公开这个字符串)

配置好后请在 Vercel 的部署页面重新触发一次部署 (Redeploy) 以使环境变量生效。
