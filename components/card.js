// 卡片组件

// 确保VemosUI已存在
function registerCardComponent() {
  if (window.VemosUI) {
    // 注册卡片组件
    window.VemosUI.registerComponent('v-card', {
      props: ['title', 'subtitle', 'header', 'footer'],
      template(props) {
        const { title = '', subtitle = '', header = '', footer = '', children } = props;
        
        return `
          <div class="v-card">
            ${(title || header) ? `<div class="v-card__header">
              <div class="v-card__title">${title || header}</div>
              ${subtitle ? `<div class="v-card__subtitle">${subtitle}</div>` : ''}
            </div>` : ''}
            <div class="v-card__body">
              ${children || '<slot></slot>'}
            </div>
            ${footer ? `<div class="v-card__footer">${footer}</div>` : ''}
          </div>
        `;
      },
      styles: `
        .v-card {
          border: 1px solid var(--vemos-border-default, #dcdfe6);
          border-radius: 4px;
          background-color: var(--vemos-bg-default, #fff);
          color: var(--vemos-text-default, #303133);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        
        /* 暗黑模式下卡片的样式 */
        [data-theme="dark"] .v-card {
          background-color: var(--vemos-bg-default, #2d3748);
          color: var(--vemos-text-default, #e2e8f0);
          border-color: var(--vemos-border-default, #4a5568);
        }
        
        .v-card__header {
          padding: 16px 20px 0px 20px;
          box-sizing: border-box;
          transition: all 0.3s;
        }
        
        .v-card__title {
          font-size: 16px;
          font-weight: bold;
          color: var(--vemos-text-default, #303133);
          margin-bottom: 4px;
        }
        
        /* 暗黑模式下标题的样式 */
        [data-theme="dark"] .v-card__title {
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        .v-card__subtitle {
          font-size: 14px;
          color: var(--vemos-text-tertiary, #909399);
          margin-top: 2px;
        }
        
        /* 暗黑模式下副标题的样式 */
        [data-theme="dark"] .v-card__subtitle {
          color: var(--vemos-text-tertiary, #cbd5e0) !important;
        }
        
        .v-card__body {
          padding: 12px 20px 12px 20px;
          transition: all 0.3s;
        }
        
        .v-card__footer {
          padding: 0px 20px 16px 20px;
          box-sizing: border-box;
          transition: all 0.3s;
          color: var(--vemos-text-tertiary, #909399);
          font-size: 14px;
        }
        
        /* 暗黑模式下页脚的样式 */
        [data-theme="dark"] .v-card__footer {
          color: var(--vemos-text-tertiary, #cbd5e0) !important;
        }
      `
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerCardComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerCardComponent);
} else {
  registerCardComponent();
}