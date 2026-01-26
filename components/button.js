// 按钮组件

// 确保VemosUI已存在
function registerButtonComponent() {
  if (window.VemosUI) {
    // 注册按钮组件
    window.VemosUI.registerComponent('v-button', {
      // 更新props数组，将danger替换为error
      props: ['type', 'size', 'disabled', 'loading', 'icon', 'block', 'dashed', 'text', 'color', 'background', 'circle'],
      template(props) {
        const { 
          type = 'default', 
          size = 'medium', 
          disabled = false, 
          loading = false, 
          icon, 
          block = false, 
          dashed = false,
          text = false,
          color,
          background,
          circle
        } = props;
        
        // 确保type值有效
        const validTypes = ['default', 'primary', 'success', 'warning', 'info', 'error'];
        const buttonType = validTypes.includes(type) ? type : 'default';
        
        // 检查dashed属性是否存在（支持布尔属性语法）
        const isDashed = props.hasOwnProperty('dashed') && 
                        (dashed === '' || dashed === 'true' || dashed === true);
                        
        // 检查circle属性是否存在（支持布尔属性语法）
        const isCircle = props.hasOwnProperty('circle') && 
                        (circle === '' || circle === 'true' || circle === true);

        // 如果指定了自定义颜色，应用自定义样式
        const customStyles = [];
        if (color) customStyles.push(`color: ${color}`);
        if (background) customStyles.push(`background-color: ${background}`);
        const customStyleStr = customStyles.length > 0 ? `style="${customStyles.join('; ')}"` : '';
        
        // 根据dashed和circle属性决定边框样式
        let buttonClass = 'v-button';
        if (isDashed) buttonClass += ' v-button--dashed';
        if (isCircle) buttonClass += ' v-button--circle';
        buttonClass += ` v-button--${type} v-button--${size}`;
        
        // 生成图标HTML
        const iconHtml = icon ? `<i class="${icon} v-button__icon"></i>` : '';
        
        // 如果是圆形按钮且没有文字内容，则只显示图标
        // 否则显示图标和slot内容
        const contentHtml = isCircle 
          ? iconHtml
          : `${iconHtml}<span class="v-button__text"><slot></slot></span>`;

        return `
          <button 
            class="${buttonClass}" 
            ${disabled === '' || disabled === 'true' ? 'disabled' : ''}
            ${customStyleStr}
          >
            ${contentHtml}
          </button>
        `;
      },
      styles: `
        .v-button {
          display: inline-block;
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid var(--vemos-border-default, #dcdfe6);
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          outline: none;
          position: relative;
          text-align: center;
          overflow: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          min-height: 32px;
          min-width: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .v-button:focus {
          outline: none;
        }
        
        .v-button.v-button--default {
          background-color: var(--vemos-bg-default, #fff);
          color: var(--vemos-text-default, #606266);
        }
        
        /* 暗黑模式下默认按钮的样式 */
        [data-theme="dark"] .v-button.v-button--default {
          background-color: var(--vemos-bg-default);
          color: var(--vemos-text-default);
          border-color: var(--vemos-border-default);
        }
        
        .v-button.v-button--primary {
          background-color: var(--vemos-bg-primary);
          border-color: var(--vemos-bg-primary);
          color: var(--vemos-text-primary);
        }
        
        /* 暗黑模式下主要按钮的样式 */
        [data-theme="dark"] .v-button.v-button--primary {
          background-color: var(--vemos-bg-primary);
          border-color: var(--vemos-bg-primary);
          color: var(--vemos-text-primary);
        }
        
        .v-button.v-button--success {
          background-color: var(--vemos-bg-success);
          border-color: var(--vemos-bg-success);
          color: var(--vemos-text-success);
        }
        
        /* 暗黑模式下成功按钮的样式 */
        [data-theme="dark"] .v-button.v-button--success {
          background-color: var(--vemos-bg-success);
          border-color: var(--vemos-bg-success);
          color: var(--vemos-text-success);
        }
        
        .v-button.v-button--warning {
          background-color: var(--vemos-bg-warning);
          border-color: var(--vemos-bg-warning);
          color: var(--vemos-text-warning);
        }
        
        /* 暗黑模式下警告按钮的样式 */
        [data-theme="dark"] .v-button.v-button--warning {
          background-color: var(--vemos-bg-warning);
          border-color: var(--vemos-bg-warning);
          color: var(--vemos-text-warning);
        }
        
        .v-button.v-button--error {
          background-color: var(--vemos-bg-error);
          border-color: var(--vemos-bg-error);
          color: var(--vemos-text-error);
        }
        
        [data-theme="dark"] .v-button.v-button--error {
          background-color: var(--vemos-bg-error);
          border-color: var(--vemos-bg-error);
          color: var(--vemos-text-error);
        }
        
        .v-button.v-button--info {
          background-color: var(--vemos-bg-info);
          border-color: var(--vemos-bg-info);
          color: var(--vemos-text-info);
        }
        
        [data-theme="dark"] .v-button.v-button--info {
          background-color: var(--vemos-bg-info);
          border-color: var(--vemos-bg-info);
          color: var(--vemos-text-info);
        }
        
        /* 虚线按钮样式 */
        .v-button.v-button--dashed {
          background-color: transparent;
          border-style: dashed;
        }
        
        .v-button.v-button--dashed.v-button--default {
          color: var(--vemos-bg-default);
          border-color: var(--vemos-bg-default);
        }
        
        .v-button.v-button--dashed.v-button--primary {
          color: var(--vemos-bg-primary);
          border-color: var(--vemos-bg-primary);
        }
        
        .v-button.v-button--dashed.v-button--success {
          color: var(--vemos-bg-success);
          border-color: var(--vemos-bg-success);
        }
        
        .v-button.v-button--dashed.v-button--warning {
          color: var(--vemos-bg-warning);
          border-color: var(--vemos-bg-warning);
        }
        
        .v-button.v-button--dashed.v-button--error {
          color: var(--vemos-bg-error);
          border-color: var(--vemos-bg-error);
        }
        
        .v-button.v-button--dashed.v-button--info {
          color: var(--vemos-bg-info);
          border-color: var(--vemos-bg-info);
        }
        
        [data-theme="dark"] .v-button.v-button--dashed.v-button--default {
          color: var(--vemos-bg-default);
          border-color: var(--vemos-bg-default);
        }
        
        [data-theme="dark"] .v-button.v-button--dashed.v-button--primary {
          color: var(--vemos-bg-primary);
          border-color: var(--vemos-bg-primary);
        }
        
        [data-theme="dark"] .v-button.v-button--dashed.v-button--success {
          color: var(--vemos-bg-success);
          border-color: var(--vemos-bg-success);
        }
        
        [data-theme="dark"] .v-button.v-button--dashed.v-button--warning {
          color: var(--vemos-bg-warning);
          border-color: var(--vemos-bg-warning);
        }
        
        [data-theme="dark"] .v-button.v-button--dashed.v-button--error {
          color: var(--vemos-bg-error);
          border-color: var(--vemos-bg-error);
        }
        
        [data-theme="dark"] .v-button.v-button--dashed.v-button--info {
          color: var(--vemos-bg-info);
          border-color: var(--vemos-bg-info);
        }
        
        .v-button.v-button--text {
          background-color: transparent;
          border: none;
          color: var(--vemos-text-primary, #409eff);
        }
        
        /* 暗黑模式下文本按钮的样式 */
        [data-theme="dark"] .v-button.v-button--text {
          background-color: transparent;
          border: none;
          color: var(--vemos-text-primary, #63b3ed);
        }
        
        .v-button.v-button--circle {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          padding: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .v-button.v-button--circle.v-button--small {
          width: 32px;
          height: 32px;
          padding: 6px;
        }
        
        .v-button.v-button--circle.v-button--large {
          width: 48px;
          height: 48px;
          padding: 10px;
        }
        
        .v-button.v-button--small {
          padding: 6px 12px;
          font-size: 12px;
        }
        
        .v-button.v-button--large {
          padding: 10px 20px;
          font-size: 16px;
        }
        
        .v-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .v-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .v-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .v-button__text {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        
        .v-button__icon {
          margin-right: 6px;
          vertical-align: middle;
          width: 1em;
          height: 1em;
        }
        
        .v-button--circle .v-button__icon {
          margin-right: 0;
        }
      `,
      mounted() {
        // 动态加载Font Awesome CSS到shadowRoot
        if (!this.shadowRoot.querySelector('#font-awesome')) {
          const link = document.createElement('link');
          link.id = 'font-awesome';
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
          this.shadowRoot.appendChild(link);
        }
        
        // 添加按钮点击波纹效果
        const button = this.shadowRoot.querySelector('.v-button');
        if (button) {
          button.addEventListener('click', (e) => {
            if (button.disabled) return;
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.classList.add('v-ripple');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            // 清理波纹元素
            setTimeout(() => {
              ripple.remove();
            }, 600);
          });
        }
      }
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerButtonComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerButtonComponent);
} else {
  registerButtonComponent();
}