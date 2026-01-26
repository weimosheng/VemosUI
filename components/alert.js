// 警告框组件

// 确保VemosUI已存在
function registerAlertComponent() {
  if (window.VemosUI) {
    // 注册警告框组件
    window.VemosUI.registerComponent('v-alert', {
      props: ['type', 'closable', 'showIcon', 'title', 'description', 'center'],
      template(props) {
        const { 
          type = 'info', 
          closable = false, 
          showIcon = false, 
          title, 
          description, 
          center = false 
        } = props;
        
        // 确保type值有效
        const validTypes = ['success', 'warning', 'info', 'error'];
        const alertType = validTypes.includes(type) ? type : 'info';
        
        // 检查布尔属性
        const isClosable = props.hasOwnProperty('closable') && 
                          (closable === '' || closable === 'true' || closable === true);
        const hasShowIcon = props.hasOwnProperty('showIcon') && 
                           (showIcon === '' || showIcon === 'true' || showIcon === true);
        const isCenter = props.hasOwnProperty('center') && 
                        (center === '' || center === 'true' || center === true);
        
        // 获取插槽内容
        const slotContent = this.shadowRoot ? '<slot></slot>' : '';
        
        // 生成图标HTML
        let iconHtml = '';
        if (hasShowIcon) {
          const iconMap = {
            'success': '✓',
            'warning': '⚠',
            'info': 'ℹ',
            'error': '✕'
          };
          const icon = iconMap[alertType] || 'ℹ';
          iconHtml = `<span class="v-alert__icon">${icon}</span>`;
        }
        
        // 生成标题HTML
        const titleHtml = title ? `<div class="v-alert__title">${title}</div>` : '';
        
        // 生成描述HTML
        const descHtml = description ? `<div class="v-alert__desc">${description}</div>` : '';
        
        // 生成关闭按钮HTML
        const closeBtnHtml = isClosable ? 
          `<span class="v-alert__close" id="close-btn">✕</span>` : '';
        
        // 根据是否有插槽内容调整布局
        const hasSlotContent = slotContent.trim() !== '';
        const contentHtml = hasSlotContent ? 
          `<div class="v-alert__content">${slotContent}</div>` : '';
        
        // 决定整体样式类
        let alertClass = 'v-alert';
        alertClass += ` v-alert--${alertType}`;
        if (isCenter) alertClass += ' v-alert--center';
        if (hasShowIcon) alertClass += ' v-alert--with-icon';
        
        return `
          <div class="${alertClass}">
            ${iconHtml}
            <div class="v-alert__body">
              ${titleHtml}
              ${descHtml}
              ${contentHtml}
            </div>
            ${closeBtnHtml}
          </div>
        `;
      },
      
      styles: `
        .v-alert {
          position: relative;
          padding: 16px 16px;
          margin-bottom: 16px;
          border-radius: 4px;
          box-sizing: border-box;
          width: 100%;
          font-size: 14px;
          line-height: 1.5;
          display: flex;
          align-items: center;
          border: 1px solid var(--vemos-border-default, #dcdfe6);
        }
        
        .v-alert--center {
          justify-content: center;
          text-align: center;
        }
        
        .v-alert--center .v-alert__body {
          flex: 1;
          text-align: center;
        }
        
        .v-alert--success {
          background-color: var(--vemos-bg-success);
          color: var(--vemos-text-success);
        }
        
        .v-alert--warning {
          background-color: var(--vemos-bg-warning);
          color: var(--vemos-text-warning);
        }
        
        .v-alert--info {
          background-color: var(--vemos-bg-info);
          color: var(--vemos-text-info);
        }
        
        .v-alert--error {
          background-color: var(--vemos-bg-error);
          color: var(--vemos-text-error);
        }
        
        .v-alert__icon {
          font-size: 16px;
          margin-right: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 16px;
        }
        
        .v-alert--with-icon .v-alert__body {
          margin-left: 8px;
        }
        
        .v-alert__body {
          flex: 1;
        }
        
        .v-alert__title {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 16px;
        }
        
        .v-alert__desc {
          margin-bottom: 8px;
          color: inherit;
        }
        
        .v-alert__content {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--vemos-border-default, rgba(0,0,0,0.06));
        }
        
        .v-alert--center .v-alert__content {
          margin-top: 0;
          padding-top: 0;
          border: none;
        }
        
        .v-alert__close {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 16px;
          color: var(--vemos-text-default, #909399);
          line-height: 1;
        }
        
        .v-alert__close:hover {
          color: var(--vemos-text-primary, #606266);
        }
      `,
      
      mounted() {
        const closeBtn = this.shadowRoot.getElementById('close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            this.style.display = 'none';
          });
        }
      }
    });
  }
}

// 确保在VemosUI初始化后执行
if (window.VemosUI) {
  registerAlertComponent();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.VemosUI) {
      registerAlertComponent();
    }
  });
}