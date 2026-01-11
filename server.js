const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 尝试的端口列表
const portsToTry = [3000, 3001, 3002, 8080, 8081];
let currentPortIndex = 0;

// MIME类型映射
const mimeType = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.xml': 'application/xml'
};

const createServer = () => {
  return http.createServer((req, res) => {
    // 解析请求的路径
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 如果请求的是根路径，则默认访问 index.html
    if (pathname === '/') {
      pathname = '/index.html';  // 修改为直接访问根目录的index.html
    }
    
    // 构建实际文件路径，确保不会跳出当前目录
    const basePath = process.cwd();
    const filePath = path.resolve(basePath, '.' + pathname);
    
    // 确保请求的路径在当前目录内，防止路径遍历攻击
    if (!filePath.startsWith(basePath)) {
      res.writeHead(403, { 'Content-Type': 'text/html' });
      res.write(`
        <!DOCTYPE html>
        <html>
          <head><title>403 Forbidden</title></head>
          <body>
            <h1>403 Forbidden</h1>
            <p>Invalid path.</p>
          </body>
        </html>
      `);
      res.end();
      return;
    }

    // 获取文件扩展名
    const ext = path.extname(filePath).toLowerCase();

    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // 文件不存在，返回 404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write(`
          <!DOCTYPE html>
          <html>
            <head><title>404 Not Found</title></head>
            <body>
              <h1>404 Not Found</h1>
              <p>The requested file ${pathname} was not found.</p>
              <p><a href="/">Go back home</a></p>
            </body>
          </html>
        `);
        res.end();
        return;
      }

      // 读取文件内容
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('500 Internal Server Error');
          res.end();
          return;
        }

        // 根据文件扩展名设置 Content-Type
        const contentType = mimeType[ext] || 'application/octet-stream';
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Expires': '0'
        });
        res.write(data);
        res.end();
      });
    });
  });
};

const server = createServer();

// 尝试监听端口
const tryNextPort = () => {
  if (currentPortIndex >= portsToTry.length) {
    console.error('无法找到可用端口，请手动释放端口或联系管理员');
    return;
  }
  
  const port = portsToTry[currentPortIndex];
  console.log(`尝试启动服务器在端口 ${port}...`);
  
  server.listen(port, () => {
    console.log(`VemosUI 开发服务器运行在 http://localhost:${port}`);
    console.log(`主页: http://localhost:${port}/`);
  });
  
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`端口 ${port} 已被占用，尝试下一个端口...`);
      currentPortIndex++;
      tryNextPort();
    } else {
      console.error('服务器错误:', e);
    }
  });
};

tryNextPort();