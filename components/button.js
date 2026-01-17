// 按钮组件

// 确保VemosUI已存在
function registerButtonComponent() {
  if (window.VemosUI) {
    // 注册按钮组件
    window.VemosUI.registerComponent('v-button', {
      props: ['type', 'size', 'disabled', 'dashed', 'color', 'background', 'icon', 'circle'],
      template(props) {
        const { 
          type = 'default', 
          size = 'medium', 
          disabled = false, 
          dashed = false,
          color, 
          background,
          icon = '',
          circle = false
        } = props;
        
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
          border: 1px solid #dcdfe6;
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
          background-color: #fff;
          color: #606266;
        }
        
        .v-button.v-button--primary {
          background-color: #409eff;
          border-color: #409eff;
          color: #fff;
        }
        
        .v-button.v-button--success {
          background-color: #67c23a;
          border-color: #67c23a;
          color: #fff;
        }
        
        .v-button.v-button--warning {
          background-color: #e6a23c;
          border-color: #e6a23c;
          color: #fff;
        }
        
        .v-button.v-button--danger {
          background-color: #f56c6c;
          border-color: #f56c6c;
          color: #fff;
        }
        
        .v-button.v-button--text {
          background-color: transparent;
          border: none;
          color: #606266;
        }
        
        .v-button.v-button--dashed {
          border-style: dashed;
          background-color: transparent;
        }
        
        .v-button.v-button--dashed.v-button--default {
          color: #606266;
          border-color: #dcdfe6;
        }
        
        .v-button.v-button--dashed.v-button--primary {
          color: #409eff;
          border-color: #409eff;
          background-color: transparent;
        }
        
        .v-button.v-button--dashed.v-button--success {
          color: #67c23a;
          border-color: #67c23a;
          background-color: transparent;
        }
        
        .v-button.v-button--dashed.v-button--warning {
          color: #e6a23c;
          border-color: #e6a23c;
          background-color: transparent;
        }
        
        .v-button.v-button--dashed.v-button--danger {
          color: #f56c6c;
          border-color: #f56c6c;
          background-color: transparent;
        }
        
        .v-button.v-button--dashed.v-button--text {
          color: #606266;
          background-color: transparent;
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
        }
        
        .v-button--circle .v-button__icon {
          margin-right: 0;
        }
      `,
      mounted() {
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