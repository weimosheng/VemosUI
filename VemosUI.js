class VemosUI {
  constructor() {
    this.components = {};
    this.init();
  }

  /**
   * 注册组件
   * @param {string} name - 组件名称
   * @param {Object} component - 组件定义
   */
  registerComponent(name, component) {
    this.components[name] = component;
    this.defineCustomElement(name, component);
  }

  /**
   * 定义自定义元素
   * @param {string} name - 组件名称
   * @param {Object} component - 组件定义
   */
  defineCustomElement(name, component) {
    if (!customElements.get(name)) {
      class VemosComponent extends HTMLElement {
        constructor() {
          super();
          
          // 创建shadow DOM以隔离样式 - 注意这里不需要再给this.shadowRoot赋值
          this.attachShadow({mode: 'open'});
        }

        connectedCallback() {
          // 当元素被添加到DOM时调用
          this.render();
          
          // 如果组件有mounted生命周期钩子，则调用它
          if (component.mounted) {
            component.mounted.call(this);
          }
        }

        static get observedAttributes() {
          // 返回需要监听的属性列表
          return component.props || [];
        }

        attributeChangedCallback(name, oldValue, newValue) {
          // 属性变化时重新渲染
          if (oldValue !== newValue) {
            this.render();
            
            // 如果组件有updated生命周期钩子，则调用它
            if (component.updated) {
              component.updated.call(this, name, oldValue, newValue);
            }
          }
        }

        render() {
          // 获取当前元素的属性
          const props = {};
          for (let attr of this.attributes) {
            props[attr.name] = attr.value;
          }

          // 不再将innerHTML作为children传递，而是让Shadow DOM原生处理slot
          const renderedHTML = component.template 
            ? component.template.call(this, props)
            : this.getDefaultTemplate(props);
            
          // 使用已有的shadowRoot属性而不是重新赋值
          this.shadowRoot.innerHTML = renderedHTML;

          // 添加默认样式
          if (component.styles) {
            const style = document.createElement('style');
            style.textContent = component.styles;
            this.shadowRoot.appendChild(style);
          }
          
          // 添加全局动画样式
          if (!this.shadowRoot.querySelector('#vemosui-animations')) {
            const animationStyle = document.createElement('style');
            animationStyle.id = 'vemosui-animations';
            animationStyle.textContent = `
              /* 全局动画样式 */
              :host {
                animation: vemos-fade-in 0.3s ease-out;
              }
              
              @keyframes vemos-fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              /* 按钮波纹效果 */
              .v-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(226, 226, 226, 0.7);
                transform: scale(0);
                animation: vemos-ripple 0.6s linear;
                pointer-events: none;
              }
              
              @keyframes vemos-ripple {
                to {
                  transform: scale(4);
                  opacity: 0;
                }
              }
            `;
            this.shadowRoot.appendChild(animationStyle);
          }
        }

        getDefaultTemplate(props) {
          // 默认模板，使用原生slot处理内容投影
          return '<slot></slot>';
        }
      }

      customElements.define(name, VemosComponent);
    }
  }

  /**
   * 初始化VemosUI
   */
  init() {
    // 检查浏览器是否支持自定义元素
    if (typeof customElements === 'undefined' || !window.customElements) {
      console.error('您的浏览器不支持Web Components标准，VemosUI无法运行');
      return;
    }
    // 核心框架初始化完成，不再注册内置组件
  }
}

// 等待DOM加载完成后初始化VemosUI
document.addEventListener('DOMContentLoaded', () => {
  window.VemosUI = new VemosUI();
});