# 谷歌表单零成本后台配置指南 (Google Apps Script)

为了让网站底部的“联系我们 / 获取报价”表单能够真正收集到客户的数据，我们将使用 **Google Sheets** 和它自带的 **Apps Script** 充当免费的云端数据库和 API 接口。

整个过程**完全免费、无需写任何代码**，只需要跟着傻瓜步骤点几下鼠标即可：

### 第一步：创建你的数据库（谷歌表格）
1. 打开浏览器并登录您的 Google 账号，访问 [Google Sheets](https://docs.google.com/spreadsheets/).
2. 点击 **“+ 空白”** 创建一个新的表格，将表格标题命名为 `KMI Website Leads`。
3. 在表格的第一行（表头）依次输入我们定义的4个字段名称：
   - A1 单元格输入：`Name`
   - B1 单元格输入：`Email`
   - C1 单元格输入：`Company`
   - D1 单元格输入：`Message`
   - E1 单元格输入：`Timestamp` *(系统会自动填入提交时间)*

### 第二步：编写接发脚本 (Apps Script)
1. 在表格顶部菜单栏，点击 **【扩展程序 (Extensions)】 > 【Apps 脚本 (Apps Script)】**。这会打开一个新的脚本标签页。
2. 将里面默认的 `function myFunction() {...}` 全部删除。
3. 复制并粘贴以下完整代码：

```javascript
var sheetName = 'Sheet1'; // 如果您上面改了工作表名称，请把这里改成您的名称

function doPost(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      if (headers[i] === 'Timestamp') {
        row.push(new Date());
      } else {
        // e.parameter 包含了我们前端表单提交过来的 name="xxxx" 的数据
        row.push(e.parameter[headers[i].toLowerCase()] || "");
      }
    }
    
    // 写入新的一行
    sheet.appendRow(row);
    
    // 返回成功状态（允许跨域加载）
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": row }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 第三步：生成神奇的 API 链接
1. 在脚本编辑器右上角，点击蓝色按钮 **【部署 (Deploy)】 > 【新建部署 (New deployment)】**。
2. 在左侧点击小齿轮标志 ⚙️，选择 **【Web 应用 (Web app)】**。
3. 填写配置项：
   - 说明栏：写 `v1.0` 即可
   - **执行用户：选择【我 (Me - 你的邮箱)】**
   - **谁可以访问：必须选择【所有人 (Anyone)】** *(重要！只有这样外部网站才能发数据进来)*
4. 点击 **【部署 (Deploy)】** 蓝按钮。
   - *（如果是第一次配置，Google 会要求弹出警告验证权限，点击「审查权限」-> 选您的账号 -> 点左下角「高级」->「转至项目（不安全）」-> 点击「允许」。因为这是您自己的脚本，放心点允许。）*
5. 部署完成后，您会得到一个以 `https://script.google.com/macros/s/.../exec` 开头的 **Web 应用网址 (URL)**。复制它！

### 第四步：告诉我这个链接
将您刚刚复制出来的这串 `https://.../exec` 长链接直接在当前的对话框里发给我。

我会将它填入项目 `script.js` 第 74 行的 `GOOGLE_SCRIPT_URL` 常量中。填好之后，任何人只要点击我们网站末尾的“发送留言”按钮，他们的填表信息就会立马、永久且免费地飞入您的这行谷歌表单里！
