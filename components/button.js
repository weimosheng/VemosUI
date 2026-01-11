// 按钮组件

// 确保VemosUI已存在
function registerButtonComponent() {
  if (window.VemosUI) {
    // 注册按钮组件
    window.VemosUI.registerComponent('v-button', {
      props: ['type', 'size', 'disabled'],
      template(props) {
        const { type = 'default', size = 'medium', disabled = false, children } = props;
        
        return `
          <button 
            class="v-button v-button--${type} v-button--${size}" 
            ${disabled === '' || disabled === 'true' ? 'disabled' : ''}
          >
            <span class="v-button__text">${children || '<slot></slot>'}</span>
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