// 代码展示组件

// 确保VemosUI已存在
function registerCodeDisplayComponent() {
  if (window.VemosUI) {
    // 注册代码展示组件
    window.VemosUI.registerComponent('v-code-display', {
      props: ['code', 'lang', 'show-line-numbers', 'copyable'],
      template(props) {
        // 将连字符格式的属性转换为驼峰格式
        const camelCaseProps = {};
        for (const key in props) {
          const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
          camelCaseProps[camelKey] = props[key];
        }
        
        // 设置默认值
        const showLineNumbers = camelCaseProps.showLineNumbers || 'false';
        const copyable = camelCaseProps.copyable !== undefined ? camelCaseProps.copyable : 'true'; // 默认为 'true'
        const code = camelCaseProps.code || '';
        const lang = camelCaseProps.lang || 'javascript';
        
        let codeToRender = code;
        
        // 优先使用slot内容作为代码，如果code属性未提供
        if (!codeToRender && this.innerHTML) {
          // 获取slot中的内容作为代码
          codeToRender = this.innerHTML.trim();
          
          // 如果代码是通过HTML内容传入的（通常是转义过的），则需要解码
          if (codeToRender.includes('&lt;') || codeToRender.includes('&gt;')) {
            codeToRender = codeToRender
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'");
          }
        }
        
        // 转义HTML字符
        const escapeHtml = (str) => {
          return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        };
        
        // 处理代码内容
        let processedCode = escapeHtml(codeToRender);
        
        // 添加行号
        if (showLineNumbers === '' || showLineNumbers === 'true') {
          const lines = processedCode.split('\n');
          // 将每行包装在span中并加上行号
          processedCode = lines
            .map((line, i) => `<div class="code-line"><span class="line-number">${i + 1}</span><span class="line-content">${line}</span></div>`)
            .join('');
        }
        
        return `
          <div class="v-code-display">
            <div class="v-code-display__header">
              <div class="v-code-display__lang">${lang.toUpperCase()}</div>
              ${(copyable === '' || copyable === 'true') && copyable !== 'false' ? 
                `<button class="v-code-display__copy-btn" title="复制代码">
                  <svg class="v-code-display__copy-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M19 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H7v14h12v-5h-2v1z"/>
                    <path fill="currentColor" d="M15 3h6a2 2 0 0 1 2 2v6h-2V5H15V3z"/>
                  </svg>
                </button>` : ''}
            </div>
            <div class="v-code-display__pre">${processedCode}</div>
          </div>
        `;
      },
      styles: `
        .v-code-display {
          border: 1px solid #eaecef;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          background-color: #2d2d2d;
          overflow: hidden;
        }
        
        .v-code-display__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background-color: #3c3c3c;
          border-bottom: 1px solid #555;
        }
        
        .v-code-display__lang {
          font-size: 12px;
          font-weight: bold;
          color: #f8f8f2;
          text-transform: uppercase;
        }
        
        .v-code-display__copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.6;
          transition: opacity 0.2s;
          color: white;
        }
        
        .v-code-display__copy-btn:hover {
          opacity: 1;
          background-color: rgba(255,255,255,0.1);
        }
        
        .v-code-display__copy-icon {
          fill: white;
        }
        
        .v-code-display__pre {
          margin: 0;
          padding: 16px;
          overflow: auto;
          background-color: #2d2d2d;
          color: #f8f8f2;
          line-height: 1.5;
          font-size: 13px;
          white-space: pre;
          tab-size: 2;
        }
        
        .code-line {
          display: flex;
          align-items: flex-start;
          min-height: 20px;
          line-height: 1.5;
          white-space: pre;
        }
        
        .line-number {
          color: #999;
          user-select: none;
          width: 40px;
          text-align: right;
          padding-right: 16px;
          font-size: 13px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        
        .line-content {
          flex: 1;
          font-family: inherit;
          font-size: 13px;
          white-space: pre;
          color: #f8f8f2;
        }
      `,
      mounted() {
        // 添加复制功能
        const copyableAttr = this.getAttribute('copyable');
        if (copyableAttr !== 'false') {
          const copyBtn = this.shadowRoot.querySelector('.v-code-display__copy-btn');
          const preEl = this.shadowRoot.querySelector('.v-code-display__pre');
          
          if (copyBtn && preEl) {
            copyBtn.addEventListener('click', async () => {
              try {
                // 提取纯文本代码
                let codeText = '';
                const lines = this.shadowRoot.querySelectorAll('.code-line');
                
                if (lines.length > 0) {
                  // 从行元素中提取代码内容
                  codeText = Array.from(lines)
                    .map(line => line.querySelector('.line-content').textContent)
                    .join('\n');
                } else {
                  // 如果没有使用行号，则直接获取文本
                  codeText = preEl.textContent;
                }
                
                await navigator.clipboard.writeText(codeText);
                
                // 显示复制成功的视觉反馈
                const icon = copyBtn.querySelector('.v-code-display__copy-icon');
                const originalIcon = icon.innerHTML;
                
                // 更改图标为成功图标
                icon.innerHTML = '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
                
                // 一段时间后恢复原状
                setTimeout(() => {
                  icon.innerHTML = originalIcon;
                }, 1500);
              } catch (err) {
                console.error('无法复制代码: ', err);
              }
            });
          }
        }
      }
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerCodeDisplayComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerCodeDisplayComponent);
} else {
  registerCodeDisplayComponent();
}