// 卡片组件

// 确保VemosUI已存在
function registerCardComponent() {
  if (window.VemosUI) {
    // 注册卡片组件
    window.VemosUI.registerComponent('v-card', {
      props: ['title', 'header'],
      template(props) {
        const { title = '', header = '', children } = props;
        
        return `
          <div class="v-card">
            ${(title || header) ? `<div class="v-card__header">
              <div class="v-card__title">${title || header}</div>
            </div>` : ''}
            <div class="v-card__body">
              ${children || '<slot></slot>'}
            </div>
          </div>
        `;
      },
      styles: `
        .v-card {
          border: 1px solid #ebeef5;
          border-radius: 4px;
          background-color: #fff;
          overflow: hidden;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        
        .v-card:hover {
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .v-card__header {
          padding: 16px 20px;
          border-bottom: 1px solid #ebeef5;
          box-sizing: border-box;
          transition: all 0.3s;
        }
        
        .v-card__title {
          font-size: 16px;
          font-weight: bold;
          color: #303133;
        }
        
        .v-card__body {
          padding: 20px;
          transition: all 0.3s;
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