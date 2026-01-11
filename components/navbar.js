// 导航栏组件示例

// 确保VemosUI已存在
function registerNavbarComponent() {
  if (window.VemosUI) {
    // 注册导航栏组件
    window.VemosUI.registerComponent('v-navbar', {
      props: ['title', 'fixed', 'theme'],
      template(props) {
        const { title = 'VemosUI', fixed = false, theme = 'default' } = props;
        
        return `
          <nav class="v-navbar v-navbar--${theme} ${fixed === '' || fixed === 'true' ? 'v-navbar--fixed' : ''}">
            <div class="v-navbar__left">
              <slot name="left"></slot>
            </div>
            <div class="v-navbar__center">
              <span class="v-navbar__title">${title}</span>
            </div>
            <div class="v-navbar__right">
              <slot name="right"></slot>
            </div>
          </nav>
        `;
      },
      styles: `
        .v-navbar {
          display: flex;
          align-items: center;
          height: 60px;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,.08);
          padding: 0 20px;
          box-sizing: border-box;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .v-navbar--default {
          background-color: #fff;
          color: #303133;
        }
        
        .v-navbar--primary {
          background-color: #409EFF;
          color: #fff;
        }
        
        .v-navbar--success {
          background-color: #67c23a;
          color: #fff;
        }
        
        .v-navbar--warning {
          background-color: #e6a23c;
          color: #fff;
        }
        
        .v-navbar--danger {
          background-color: #f56c6c;
          color: #fff;
        }
        
        .v-navbar--info {
          background-color: #909399;
          color: #fff;
        }
        
        .v-navbar--dark {
          background-color: #303133;
          color: #fff;
        }
        
        .v-navbar--light {
          background-color: #f5f7fa;
          color: #303133;
        }
        
        .v-navbar--fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        
        .v-navbar__left {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
        }
        
        .v-navbar__center {
          flex: 1 1 auto;
          text-align: center;
        }
        
        .v-navbar__right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
        }
        
        .v-navbar__title {
          font-size: 18px;
          font-weight: 500;
          color: inherit;
        }
        
        /* 确保插槽内容颜色正确 */
        .v-navbar--primary ::slotted(*),
        .v-navbar--success ::slotted(*),
        .v-navbar--warning ::slotted(*),
        .v-navbar--danger ::slotted(*),
        .v-navbar--info ::slotted(*),
        .v-navbar--dark ::slotted(*) {
          color: #fff;
        }
        
        .v-navbar--light ::slotted(*) {
          color: #303133;
        }
        
        .v-navbar--default ::slotted(*) {
          color: #303133;
        }
      `
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerNavbarComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerNavbarComponent);
} else {
  registerNavbarComponent();
}