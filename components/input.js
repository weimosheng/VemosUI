// 输入框组件示例

// 确保VemosUI已存在
function registerInputComponent() {
  if (window.VemosUI) {
    // 注册输入框组件
    window.VemosUI.registerComponent('v-input', {
      props: ['type', 'placeholder', 'value', 'disabled', 'readonly', 'name'],
      template(props) {
        const {
          type = 'text',
          placeholder = '',
          value = '',
          disabled = false,
          readonly = false,
          name = '',
          children
        } = props;

        return `
          <div class="v-input-wrapper">
            <input
              type="${type}"
              class="v-input__inner"
              placeholder="${placeholder}"
              value="${value}"
              name="${name}"
              ${disabled === '' || disabled === 'true' ? 'disabled' : ''}
              ${readonly === '' || readonly === 'true' ? 'readonly' : ''}
            />
          </div>
        `;
      },
      styles: `
        .v-input-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
          transition: all 0.3s;
        }
        
        .v-input__inner {
          position: relative;
          display: inline-block;
          width: 100%;
          height: 36px;
          padding: 0 12px;
          background-color: var(--vemos-bg-default, #fff);
          background-image: none;
          border: 1px solid var(--vemos-border-default, #dcdfe6);
          border-radius: 4px;
          box-sizing: border-box;
          color: var(--vemos-text-default, #606266);
          font-size: inherit;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        
        /* 暗黑模式下输入框的样式 */
        [data-theme="dark"] .v-input__inner {
          background-color: var(--vemos-bg-default, #2d3748);
          border-color: var(--vemos-border-default, #4a5568);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        .v-input__inner::placeholder {
          color: var(--vemos-text-tertiary, #c0c4cc);
          transition: all 0.3s;
        }
        
        [data-theme="dark"] .v-input__inner::placeholder {
          color: var(--vemos-text-tertiary, #718096);
        }
        
        .v-input__inner:hover {
          border-color: var(--vemos-text-tertiary, #b4bccc);
        }
        
        [data-theme="dark"] .v-input__inner:hover {
          border-color: var(--vemos-text-tertiary, #718096);
        }
        
        .v-input__inner:focus {
          outline: none;
          border-color: var(--vemos-bg-primary, #409eff);
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
          transform: translateY(-1px);
        }
        
        .v-input__inner:disabled {
          background-color: var(--vemos-bg-tertiary, #f5f7fa);
          border-color: var(--vemos-border-default, #e4e7ed);
          color: var(--vemos-text-tertiary, #c0c4cc);
          cursor: not-allowed;
        }
        
        [data-theme="dark"] .v-input__inner:disabled {
          background-color: var(--vemos-bg-tertiary, #4a5568);
          border-color: var(--vemos-border-default, #718096);
          color: var(--vemos-text-tertiary, #a0aec0);
        }
      `,
      mounted() {
        // 获取input元素并添加事件监听
        const inputEl = this.shadowRoot.querySelector('.v-input__inner');
        if (inputEl) {
          inputEl.addEventListener('input', (e) => {
            // 触发自定义input事件
            this.dispatchEvent(new CustomEvent('v-input', {
              detail: { value: e.target.value },
              bubbles: true
            }));
          });
          
          inputEl.addEventListener('change', (e) => {
            // 触发自定义change事件
            this.dispatchEvent(new CustomEvent('v-change', {
              detail: { value: e.target.value },
              bubbles: true
            }));
          });
        }
      }
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerInputComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerInputComponent);
} else {
  registerInputComponent();
}