1. add MCP bằng CLI

Figma:
```
claude mcp add figma \
  --env FIGMA_API_KEY=$FIGMA_API_KEY \
  -- npx -y figma-developer-mcp --stdio
```

GitHub:
```
claude mcp add github \
  --env GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_TOKEN \
  -- npx -y @modelcontextprotocol/server-github
```

Linear:
```
claude mcp add linear \
  --env LINEAR_API_KEY=$LINEAR_API_KEY \
  -- npx -y mcp-server-linear
```

claude mcp remove linear

2. Sử dụng Symlink (Cách sạch nhất trên Ubuntu)
# Xóa file cấu hình cũ (nếu có)
rm ~/.claude.json

# Tạo link từ file dự án tới file mặc định của Claude
ln -s /home/ttthang/Practice/AI-first-todo-SaaS/.claude/settings.json ~/.claude.json

3. Sử dụng tham số --config (Nếu dùng Claude CLI)
claude --config /home/ttthang/Practice/AI-first-todo-SaaS/.claude/settings.json

--------------------------------------------
# Cách 1: Dùng nano (ngay trong terminal)
nano ~/.bashrc

# Cách 2: Dùng gedit (giao diện cửa sổ)
gedit ~/.bashrc


Cách sửa triệt để (Dùng Symlink)
# 1. Xóa file settings cũ ở thư mục Home (nếu có)
rm -rf ~/.claude/settings.json

# 2. Tạo thư mục .claude ở Home nếu chưa có
mkdir -p ~/.claude

# 3. Tạo liên kết (Symlink) từ file dự án sang file hệ thống
ln -s /home/ttthang/Practice/AI-first-todo-SaaS/.claude/settings.json ~/.claude/settings.json