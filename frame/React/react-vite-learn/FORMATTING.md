# 代码格式化指南

本项目使用 **Prettier + ESLint** 进行代码格式化和质量检查。

## 📦 已安装的工具

- **Prettier** - 代码格式化工具
- **ESLint** - 代码质量检查工具
- **eslint-plugin-prettier** - Prettier 与 ESLint 的集成插件
- **eslint-config-prettier** - 关闭与 Prettier 冲突的 ESLint 规则

## ⚙️ 配置文件

### Prettier 配置 (`.prettierrc`)

```json
{
  "semi": false, // 不使用分号
  "singleQuote": true, // 使用单引号
  "tabWidth": 2, // 缩进 2 个空格
  "trailingComma": "es5", // 尾随逗号
  "printWidth": 100, // 每行最大字符数
  "arrowParens": "always" // 箭头函数参数总是使用括号
}
```

### ESLint 配置 (`eslint.config.js`)

已集成 Prettier，将格式化问题作为 ESLint 错误报告。

## 🚀 常用命令

### 格式化代码

```bash
# 格式化所有源文件
npm run format

# 检查文件格式是否符合规范（不修改文件）
npm run format:check
```

### 代码检查

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复可修复的问题
npm run lint:fix
```

## 💻 VS Code 配置

### 推荐扩展

项目已配置推荐的 VS Code 扩展，打开项目时会提示安装：

1. **Prettier - Code formatter** (esbenp.prettier-vscode)
2. **ESLint** (dbaeumer.vscode-eslint)

### 自动格式化

已配置保存时自动格式化：

- 保存文件时自动运行 Prettier 格式化
- 保存时自动修复 ESLint 问题

配置文件位于 `.vscode/settings.json`

## 📝 忽略文件

以下文件不会被格式化（在 `.prettierignore` 中配置）：

- `node_modules/`
- `dist/`
- `build/`
- `coverage/`
- `*.min.js`
- `package-lock.json`
- `pnpm-lock.yaml`
- `yarn.lock`

## 🔧 自定义配置

如需修改格式化规则，编辑 `.prettierrc` 文件。

常用配置项：

- `semi`: 是否使用分号
- `singleQuote`: 使用单引号还是双引号
- `tabWidth`: 缩进空格数
- `printWidth`: 每行最大字符数
- `trailingComma`: 尾随逗号设置
- `arrowParens`: 箭头函数参数括号

## ⚠️ 注意事项

1. **团队统一**：确保所有团队成员使用相同的配置
2. **提交前检查**：建议在 Git pre-commit hook 中添加格式化检查
3. **CI/CD 集成**：在持续集成流程中添加 `npm run format:check` 和 `npm run lint`

## 🎯 最佳实践

1. 始终在保存文件时启用自动格式化
2. 提交代码前运行 `npm run lint` 和 `npm run format:check`
3. 不要手动格式化已被 Prettier 管理的文件
4. 定期更新 Prettier 和 ESLint 到最新版本
