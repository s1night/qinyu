# 轻遇 - 轻社交平台

一个面向年轻人的轻社交平台，旨在解决年轻人不爱社交、不愿出门的问题。

## 功能特点

### 核心功能
- **兴趣小组** - 创建或加入别人的小组，小组内可以发帖子讨论，支持匿名回复和匿名发帖
- **轻出门广场** - 发布一起出门任务，最多招募3人，他人可查看发起人距离自己距离，选择报名，发起人可以拒绝
- **微信扫码登陆** - 便捷的微信扫码登录功能
- **个人主页** - 个人描述，兴趣标签等

### 技术特点
- 响应式设计，完美适配移动端
- 现代化的UI界面
- 安全的用户认证机制
- 实时数据更新

## 技术栈

- **前端框架**：Next.js 16 + React 18 + TypeScript
- **数据库**：PostgreSQL (Vercel Postgres)
- **ORM**：Drizzle ORM
- **样式**：Tailwind CSS
- **包管理器**：pnpm

## 安装步骤

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
复制 `.env.local.example` 文件为 `.env.local` 并配置相应的环境变量：

```bash
cp .env.local.example .env.local
```

### 启动开发服务器
```bash
pnpm run dev
```

开发服务器将在 http://localhost:3000 启动。

## 项目结构

```
.
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/           # API 路由
│   │   ├── lib/           # 工具函数和会话管理
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 主页
│   └── db/                # 数据库相关
│       ├── db.ts          # 数据库连接
│       └── schema.ts      # 数据库表结构
├── .env.local            # 环境变量
├── next.config.js        # Next.js 配置
├── package.json          # 项目依赖
├── tailwind.config.js    # Tailwind CSS 配置
└── tsconfig.json         # TypeScript 配置
```

## API 端点

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 小组相关
- `GET /api/groups` - 获取小组列表
- `POST /api/groups` - 创建小组
- `GET /api/groups/[groupId]` - 获取小组详情
- `POST /api/groups/[groupId]/join` - 加入小组
- `POST /api/groups/[groupId]/leave` - 退出小组

### 个人信息相关
- `GET /api/profile` - 获取个人信息
- `PUT /api/profile` - 更新个人信息

## 部署

项目可以部署到 Vercel，使用以下步骤：

1. 连接你的 GitHub 仓库到 Vercel
2. 配置环境变量（与 `.env.local` 相同）
3. 点击部署按钮

## 开发说明

### 数据库迁移
使用 Drizzle ORM 进行数据库迁移：

```bash
pnpm drizzle-kit push
```

### 代码规范
项目使用 ESLint 进行代码规范检查：

```bash
pnpm lint
```

### 构建生产版本
```bash
pnpm run build
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License