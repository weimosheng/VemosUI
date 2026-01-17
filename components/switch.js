// 开关组件示例

// 确保VemosUI已存在
function registerSwitchComponent() {
  if (window.VemosUI) {
    // 注册开关组件
    window.VemosUI.registerComponent('v-switch', {
      props: ['value', 'disabled', 'active-value', 'inactive-value', 'active-text', 'inactive-text', 'active-color', 'inactive-color'],
      template(props) {
        const {
          value = false,
          disabled = false,
          activeValue = true,
          inactiveValue = false,
          activeText = '',
          inactiveText = '',
          activeColor = '#409eff',
          inactiveColor = '#dcdfe6'
        } = props;

        // 判断当前是否为激活状态
        const isActive = value == activeValue;
        const switchBgColor = isActive ? activeColor : inactiveColor;
        
        return `
          <div class="v-switch__wrapper ${isActive ? 'is-checked' : ''}">
            <input 
              type="checkbox" 
              class="v-switch__input" 
              style="display: none;"
              ${isActive ? 'checked' : ''}
              ${disabled === '' || disabled === 'true' ? 'disabled' : ''}
            />
            <label 
              class="v-switch__core"
              style="background-color: ${switchBgColor};"
            >
              <span class="v-switch__action">
                ${isActive && activeText ? activeText : (!isActive && inactiveText ? inactiveText : '')}
              </span>
            </label>
          </div>
        `;
      },
      styles: `
        .v-switch__wrapper {
          display: inline-flex;
          align-items: center;
          position: relative;
          font-size: 14px;
          line-height: 20px;
          height: 20px;
          vertical-align: middle;
          transition: all 0.3s;
        }
        
        .v-switch__core {
          margin: 0;
          position: relative;
          width: 40px;
          height: 20px;
          border: 1px solid #dcdfe6;
          outline: none;
          border-radius: 10px;
          box-sizing: border-box;
          cursor: pointer;
          transition: border-color 0.3s, background-color 0.3s;
          background-color: #dcdfe6;
        }
        
        .v-switch__core .v-switch__action {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 100%;
          width: 18px;
          height: 18px;
          background-color: #fff;
          transform: translateX(2px);
          transition: transform 0.3s cubic-bezier(0.3, 1.0, 0.5, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #fff;
        }
        
        .v-switch__wrapper.is-checked .v-switch__core {
          background-color: #409eff;
        }
        
        .v-switch__wrapper.is-checked .v-switch__action {
          transform: translateX(20px);
        }
        
        .v-switch__wrapper.is-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .v-switch__wrapper:hover .v-switch__core {
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
      `,
      mounted() {
        // 获取核心元素并添加点击事件
        const coreEl = this.shadowRoot.querySelector('.v-switch__core');
        if (coreEl) {
          coreEl.addEventListener('click', () => {
            // 检查是否被禁用
            if (this.hasAttribute('disabled')) return;
            
            // 获取当前值
            const currentValue = this.getAttribute('value');
            const activeValue = this.getAttribute('active-value') || 'true';
            const inactiveValue = this.getAttribute('inactive-value') || 'false';
            
            // 计算新值
            const newValue = currentValue == activeValue ? inactiveValue : activeValue;
            
            // 更新属性
            this.setAttribute('value', newValue);
            
            // 触发自定义change事件
            this.dispatchEvent(new CustomEvent('v-switch-change', {
              detail: { 
                value: newValue,
                checked: newValue == activeValue
              },
              bubbles: true
            }));
          });
        }
      },
      updated(attrName) {
        // 当value属性改变时，更新组件状态
        if (attrName === 'value') {
          this.render();
        }
      }
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerSwitchComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerSwitchComponent);
} else {
  registerSwitchComponent();
}