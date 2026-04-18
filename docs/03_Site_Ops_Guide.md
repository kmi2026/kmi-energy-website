# KMI Energy 网站运维指南 (Site Ops Guide)

本文档面向 **DevOps、网络工程师或技术支持成员**。提供部署环境的日常诊断、域名监控及 CI/CD 自动构建的维护说明。

---

## 1. Cloudflare Pages 自动化构建流 (CI/CD)
本项目挂载了基于 Github `main` 分支的自动化流水线系统。
- 当 Github 发生代码更新（开发人员合并 pull request 或者是 CMS 前台保存）时，Cloudflare Pages 会自动拉取最新代码并启动新的生产部署。
- Cloudflare Pages 通常会进入 `Queued` / `Building` / `Deploying` 状态，并在 **1 到 2 分钟内完成**静态资源发布与 Functions 更新。

## 2. 异常监控与重新部署
如果在前端遇到“缓存过旧、未自动更新”等问题，运维应当直接介入 Cloudflare 部署面板：

1. 使用管理账户登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入 `Workers & Pages` -> `kmi-energy-website`。
3. 打开最近一次生产部署记录，检查构建日志、Functions 日志和发布状态。
4. 如果部署失败，先修复配置或代码问题后再次推送；如果只是需要重新发布，可手动触发新的部署或重新运行最近一次成功配置下的部署。
5. 如果用户端仍看到旧内容，先强制刷新浏览器，再确认访问的是正式域名 `https://kmienergy.com` 而不是旧平台地址。

## 3. 域名解析日常检查 (Domain Management)
- 当前正式域名统一为 `kmienergy.com`。运维应确保它已经在 Cloudflare Pages 中绑定为主域名。
- `www.kmienergy.com` 如继续保留，应做 **301 跳转** 到 `https://kmienergy.com`，避免 SEO 权重与 OAuth 回调分裂。
- 当新申请或变更自定义域名时，请在 `Workers & Pages` -> `Custom domains` 中完成绑定，并确认对应 DNS 记录已切到 Cloudflare 当前项目。

## 4. 后台表单数据库备份 (Google Sheets)
目前的表单数据（留言和获取报价）全部收集在 Google Workspace 内（通过 Google Apps Script 转发）。
- 运维不应随意修整前端 `script.js` 中的 `GOOGLE_SCRIPT_URL`。如遇需要更换收款邮箱，请更换绑定的 Google Sheet，并在表格内点选 `扩展程序 > Apps Script > 新建部署` 以获得新的 Web App URL，填入前端项目并推送代码。
