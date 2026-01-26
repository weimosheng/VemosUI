// 导航栏组件示例

// 确保VemosUI已存在
function registerNavbarComponent() {
  if (window.VemosUI) {
    // 注册导航栏组件
    window.VemosUI.registerComponent('v-navbar', {
      props: ['title', 'fixed', 'theme', 'logo', 'logoText'],
      template(props) {
        // 检查是否设置了logo或logoText属性
        const hasLogo = 'logo' in props || 'logoText' in props;
        const { title = 'VemosUI', fixed = false, theme = 'default', logo, logoText = 'Logo' } = props;
        
        // 只有在设置了logo或logoText时才显示logo部分
        const logoSection = hasLogo && (logo || logoText) ? `
          <div class="v-navbar__logo">
            ${logo ? `<img src="${logo}" alt="${logoText}" class="v-navbar__logo-img">` : `<span class="v-navbar__logo-text">${logoText}</span>`}
          </div>
        ` : '';
        
        return `
          <nav class="v-navbar v-navbar--${theme} ${fixed === '' || fixed === 'true' ? 'v-navbar--fixed' : ''}">
            <div class="v-navbar__left">
              ${logoSection}
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
          background-color: var(--vemos-bg-default, #fff);
          color: var(--vemos-text-default, #303133);
          box-shadow: 0 2px 4px rgba(0,0,0,.08);
          padding: 0 20px;
          box-sizing: border-box;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        /* 暗黑模式下的全局样式 */
        [data-theme="dark"] .v-navbar {
          background-color: var(--vemos-bg-default, #2d3748);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        .v-navbar--default {
          background-color: var(--vemos-bg-default, #fff);
          color: var(--vemos-text-default, #303133);
        }
        
        .v-navbar--primary {
          background-color: var(--vemos-bg-primary, #409EFF);
          color: var(--vemos-text-primary, #fff);
        }
        
        .v-navbar--success {
          background-color: var(--vemos-bg-success, #67c23a);
          color: var(--vemos-text-success, #fff);
        }
        
        .v-navbar--warning {
          background-color: var(--vemos-bg-warning, #e6a23c);
          color: var(--vemos-text-warning, #fff);
        }
        
        .v-navbar--error {
          background-color: var(--vemos-bg-error, #f56c6c);
          color: var(--vemos-text-error, #fff);
        }
        
        .v-navbar--info {
          background-color: var(--vemos-bg-info, #909399);
          color: var(--vemos-text-info, #fff);
        }
        
        .v-navbar--dark {
          background-color: var(--vemos-bg-default, #303133);
          color: var(--vemos-text-default, #fff);
        }
        
        .v-navbar--light {
          background-color: var(--vemos-bg-tertiary, #f5f7fa);
          color: var(--vemos-text-default, #303133);
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
        
        .v-navbar__logo {
          display: flex;
          align-items: center;
          margin-right: 20px;
        }
        
        .v-navbar__logo-img {
          height: 40px;
          width: auto;
          max-width: 120px;
        }
        
        .v-navbar__logo-text {
          font-size: 18px;
          font-weight: bold;
          color: inherit;
        }
        
        /* 暗黑模式下各个主题的样式 */
        [data-theme="dark"] .v-navbar--default {
          background-color: var(--vemos-bg-default, #2d3748);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        [data-theme="dark"] .v-navbar--primary {
          background-color: var(--vemos-bg-primary, #409EFF);
          color: var(--vemos-text-primary, #fff);
        }
        
        [data-theme="dark"] .v-navbar--success {
          background-color: var(--vemos-bg-success, #67c23a);
          color: var(--vemos-text-success, #fff);
        }
        
        [data-theme="dark"] .v-navbar--warning {
          background-color: var(--vemos-bg-warning, #e6a23c);
          color: var(--vemos-text-warning, #fff);
        }
        
        [data-theme="dark"] .v-navbar--error {
          background-color: var(--vemos-bg-error, #f56c6c);
          color: var(--vemos-text-error, #fff);
        }
        
        [data-theme="dark"] .v-navbar--info {
          background-color: var(--vemos-bg-info, #909399);
          color: var(--vemos-text-info, #fff);
        }
        
        [data-theme="dark"] .v-navbar--dark {
          background-color: var(--vemos-bg-default, #2d3748);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        [data-theme="dark"] .v-navbar--light {
          background-color: var(--vemos-bg-tertiary, #4a5568);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        /* 确保插槽内容颜色正确 */
        .v-navbar--primary ::slotted(*),
        .v-navbar--success ::slotted(*),
        .v-navbar--warning ::slotted(*),
        .v-navbar--error ::slotted(*),
        .v-navbar--info ::slotted(*),
        .v-navbar--dark ::slotted(*) {
          color: var(--vemos-text-primary, #fff) !important;
        }
        
        .v-navbar--light ::slotted(*) {
          color: var(--vemos-text-default, #303133) !important;
        }
        
        .v-navbar--default ::slotted(*) {
          color: var(--vemos-text-default, #303133) !important;
        }
        
        /* 暗黑模式下插槽内容颜色 */
        [data-theme="dark"] .v-navbar ::slotted(*) {
          color: var(--vemos-text-default, #e2e8f0) !important;
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