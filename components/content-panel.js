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
          contentDiv.innerHTML = `<div style="color: #f56c6c; text-align: center; padding: 40px;">加载失败: ${error.message}</div>`;
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
          background-color: #fafafa;
          overflow: hidden;
        }
        
        .v-content-panel__header {
          padding: 15px 20px;
          border-bottom: 1px solid #e6e6e6;
          background-color: #fff;
          flex-shrink: 0;
        }
        
        .v-content-panel__body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        
        .v-content-panel__content {
          background-color: #fff;
          padding: 20px;
          border-radius: 4px;
        }
        
        .v-content-panel__footer {
          padding: 10px 20px;
          border-top: 1px solid #e6e6e6;
          background-color: #fff;
          text-align: center;
          font-size: 12px;
          color: #909399;
          flex-shrink: 0;
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