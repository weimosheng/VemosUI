// 内容面板组件示例

// 确保VemosUI已存在
function registerContentPanelComponent() {
  if (window.VemosUI) {
    // 定义loadContent函数
    const loadContent = async function(self, src) {
      if (!src) return;
      
      try {
        // 发送fetch请求获取内容
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text();
        
        // 更新内容
        const contentDiv = self.shadowRoot.querySelector('.v-content-panel__content');
        if (contentDiv) {
          contentDiv.innerHTML = content;
        }
      } catch (error) {
        console.error('加载内容失败:', error);
        
        const contentDiv = self.shadowRoot.querySelector('.v-content-panel__content');
        if (contentDiv) {
          contentDiv.innerHTML = `<div style="color: var(--vemos-text-error, #f56c6c); text-align: center; padding: 40px;">加载失败: ${error.message}</div>`;
        }
      }
    };

    // 注册内容面板组件
    window.VemosUI.registerComponent('v-content-panel', {
      props: ['src'],
      template(props) {
        const { src = '' } = props;
        
        return `
          <div class="v-content-panel">
            <div class="v-content-panel__header">
              <slot name="header"></slot>
            </div>
            <div class="v-content-panel__body">
              <div class="v-content-panel__content">
                <slot name="content"></slot>
              </div>
            </div>
            <div class="v-content-panel__footer">
              <slot name="footer"></slot>
            </div>
          </div>
        `;
      },
      styles: `
        .v-content-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: var(--vemos-bg-tertiary, #fafafa);
          overflow: hidden;
          color: var(--vemos-text-default, #303133);
        }
        
        /* 暗黑模式下内容面板的样式 */
        [data-theme="dark"] .v-content-panel {
          background-color: var(--vemos-bg-tertiary, #4a5568);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        .v-content-panel__header {
          padding: 15px 20px;
          border-bottom: 1px solid var(--vemos-border-default, #e6e6e6);
          background-color: var(--vemos-bg-default, #fff);
          flex-shrink: 0;
        }
        
        /* 暗黑模式下头部的样式 */
        [data-theme="dark"] .v-content-panel__header {
          background-color: var(--vemos-bg-default, #2d3748);
          border-color: var(--vemos-border-default, #4a5568);
        }
        
        .v-content-panel__body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background-color: var(--vemos-bg-default, #fff);
        }
        
        /* 暗黑模式下主体的样式 */
        [data-theme="dark"] .v-content-panel__body {
          background-color: var(--vemos-bg-default, #2d3748);
        }
        
        .v-content-panel__content {
          background-color: var(--vemos-bg-default, #fff);
          padding: 20px;
          border-radius: 4px;
          color: var(--vemos-text-default, #303133);
        }
        
        /* 暗黑模式下内容区的样式 */
        [data-theme="dark"] .v-content-panel__content {
          background-color: var(--vemos-bg-default, #2d3748);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        .v-content-panel__footer {
          padding: 10px 20px;
          border-top: 1px solid var(--vemos-border-default, #e6e6e6);
          background-color: var(--vemos-bg-default, #fff);
          text-align: center;
          font-size: 12px;
          color: var(--vemos-text-tertiary, #909399);
        }
        
        /* 暗黑模式下底部的样式 */
        [data-theme="dark"] .v-content-panel__footer {
          background-color: var(--vemos-bg-default, #2d3748);
          border-color: var(--vemos-border-default, #4a5568);
          color: var(--vemos-text-tertiary, #a0aec0);
        }
      `,
      async mounted() {
        // 监听src属性变化来加载内容
        if (this.getAttribute('src')) {
          await loadContent(this, this.getAttribute('src'));
        }
      },
      async updated(attrName) {
        if (attrName === 'src') {
          await loadContent(this, this.getAttribute('src'));
        }
      }
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerContentPanelComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerContentPanelComponent);
} else {
  registerContentPanelComponent();
}