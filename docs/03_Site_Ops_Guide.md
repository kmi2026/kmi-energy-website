# KMI Energy 网站运维指南 (Site Ops Guide)

本文档面向 **DevOps、网络工程师或技术支持成员**。提供部署环境的日常诊断、域名监控及 CI/CD 自动构建的维护说明。

---

## 1. Vercel 自动化构建流 (CI/CD)
本项目挂载了基于 Github `main` 分支的自动化流水线系统。
- 当 Github 发生代码更新（开发人员合并 pull request 或者是 CMS 前台保存）时，系统自动发送 Webhook 脉冲信号给 Vercel 服务器。
- Vercel 接收信号后通常会进入 `Building` 状态，并在 **1 分钟内完成**页面打包、边缘缓存失效 (Cache Invalidation) 和上线工作。

## 2. 异常监控与强制更新
如果在前端遇到“缓存过旧、未自动更新”等问题，运维应当直接介入部署面板：

1. 使用管理账户登录 [Vercel 官网](https://vercel.com/)。
2. 进入 `kmi-energy-website` 项目应用仪表板。
3. 点击顶部的 **Deployments**（部署详情）。
4. 在需要重启或强制重构的部署记录旁，点击右上角 `Deploy` 下拉菜单，选择 **"Clear Cache and Deploy Site"**。这会彻底清空 CDN 中的老旧缓存，强制重拉 Github 的新代码！

## 3. 域名解析日常检查 (Domain Management)
- 当新申请自定义公司域名时，须确认 `kmienergy.com` 对应的 A 记录与 CNAME 记录。
- Vercel 环境下添加新域名前，需要使用管理员进入 Settings -> Domains 进行关联。
- Vercel-DNS 分配专属的验证令牌记录（如下面这种格式），域名必须要在云厂商（比如阿里云/Cloudflare）精确设置防劫持映射。
`995eecf2ad83d81b.vercel-dns-017.com.`

## 4. 后台表单数据库备份 (Google Sheets)
目前的表单数据（留言和获取报价）全部收集在 Google Workspace 内（通过 Google Apps Script 转发）。
- 运维不应随意修整前端 `script.js` 中的 `GOOGLE_SCRIPT_URL`。如遇需要更换收款邮箱，请更换绑定的 Google Sheet，并在表格内点选 `扩展程序 > Apps Script > 新建部署` 以获得新的 Web App URL，填入前端项目并推送代码。
