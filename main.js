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
  // 在主文件的 defineCustomElement 方法中更新
defineCustomElement(name, component) {
  if (!customElements.get(name)) {
    class VemosComponent extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        // 绑定组件方法到实例
        for (const key in component) {
          if (typeof component[key] === 'function' && key !== 'template') {
            this[key] = component[key].bind(this);
          }
        }
      }

      connectedCallback() {
        this.render();
        
        if (this.mounted) {
          this.mounted();
        }
      }

      static get observedAttributes() {
        return component.props || [];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          this.render();
          
        if (this.updated) {
          this.updated(name, oldValue, newValue);
        }
        }
      }

      render() {
        const props = {};
        for (let attr of this.attributes) {
          props[attr.name] = attr.value;
        }

        const renderedHTML = component.template 
          ? component.template.call(this, props)
          : this.getDefaultTemplate(props);
          
        this.shadowRoot.innerHTML = renderedHTML;

        if (component.styles) {
          const style = document.createElement('style');
          style.textContent = component.styles;
          this.shadowRoot.appendChild(style);
        }
        
        // 添加全局动画样式
        if (!this.shadowRoot.querySelector('#vemos-animations')) {
          const animationStyle = document.createElement('style');
          animationStyle.id = 'vemos-animations';
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
    
    // 添加主题样式
    this.createThemeStyles();
    
    // 添加Font Awesome图标库
    this.loadFontAwesome();
    
    // 检查系统主题偏好设置
    this.checkSystemThemePreference();
    
    // 监听系统主题变化
    this.listenSystemThemeChange();
    
    // 初始化响应式断点（新增）
    this.initBreakpoints();
  }
  
  /**
   * 初始化响应式断点
   */
  initBreakpoints() {
    // 定义响应式断点
    this.breakpoints = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600
    };
    
    // 添加响应式CSS变量
    this.createResponsiveStyles();
  }

  /**
   * 创建响应式样式
   */
  createResponsiveStyles() {
    const style = document.createElement('style');
    style.id = 'vemos-responsive';
    style.textContent = `
      /* 响应式断点变量 */
      :root {
        --vemos-breakpoint-xs: ${this.breakpoints.xs}px;
        --vemos-breakpoint-sm: ${this.breakpoints.sm}px;
        --vemos-breakpoint-md: ${this.breakpoints.md}px;
        --vemos-breakpoint-lg: ${this.breakpoints.lg}px;
        --vemos-breakpoint-xl: ${this.breakpoints.xl}px;
        --vemos-breakpoint-xxl: ${this.breakpoints.xxl}px;
      }
      
      /* 响应式媒体查询辅助类 */
      @media (max-width: ${this.breakpoints.sm - 1}px) {
        .v-hidden-xs {
          display: none !important;
        }
      }
      
      @media (min-width: ${this.breakpoints.sm}px) and (max-width: ${this.breakpoints.md - 1}px) {
        .v-hidden-sm {
          display: none !important;
        }
      }
      
      @media (min-width: ${this.breakpoints.md}px) and (max-width: ${this.breakpoints.lg - 1}px) {
        .v-hidden-md {
          display: none !important;
        }
      }
      
      @media (min-width: ${this.breakpoints.lg}px) and (max-width: ${this.breakpoints.xl - 1}px) {
        .v-hidden-lg {
          display: none !important;
        }
      }
      
      @media (min-width: ${this.breakpoints.xl}px) {
        .v-hidden-xl {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * 创建主题样式元素
   */
  createThemeStyles() {
    // 创建颜色变量定义
    const themeVariables = {
      light: {
        'default': { bg: '#f8f9fa', text: '#212529' },
        'tertiary': { bg: '#6c757d', text: '#adb5bd' },
        'primary': { bg: '#007bff', text: '#ffffff' },  // 白色文字
        'success': { bg: '#28a745', text: '#ffffff' },  // 白色文字
        'info': { bg: '#17a2b8', text: '#ffffff' },    // 白色文字
        'warning': { bg: '#ffc107', text: '#000000' }, // 黑色文字
        'error': { bg: '#dc3545', text: '#ffffff' }    // 白色文字
      },
      dark: {
        'default': { bg: '#212529', text: '#f8f9fa' },
        'tertiary': { bg: '#adb5bd', text: '#6c757d' },
        'primary': { bg: '#339af0', text: '#ffffff' }, // 白色文字
        'success': { bg: '#40c057', text: '#ffffff' }, // 白色文字
        'info': { bg: '#22b8cf', text: '#ffffff' },   // 白色文字
        'warning': { bg: '#ffd43b', text: '#000000' }, // 黑色文字
        'error': { bg: '#fa5252', text: '#ffffff' }    // 白色文字
      }
    };

    // 生成CSS变量
    const generateThemeCSS = (theme, prefix) => {
      let css = '';
      for (const [type, colors] of Object.entries(theme)) {
        css += `--vemos-bg-${type}: ${colors.bg};\n        --vemos-text-${type}: ${colors.text};\n        `;
      }
      return css;
    };

    const style = document.createElement('style');
    style.id = 'vemos-themes';
    style.textContent = `
      /* 全局主题变量 */
      :root {
        /* 默认明亮主题 */
        ${generateThemeCSS(themeVariables.light, '')}
        
        /* 通用变量 */
        --vemos-border-default: #dcdfe6;
      }

      /* 暗黑主题 */
      [data-theme="dark"] {
        ${generateThemeCSS(themeVariables.dark, '')}
        
        /* 通用变量 */
        --vemos-border-default: #4a5568;
      }

      /* 兼容系统偏好设置的暗黑模式 */
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme]) {
          ${generateThemeCSS(themeVariables.dark, '')}
          
          /* 通用变量 */
          --vemos-border-default: #4a5568;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * 加载Font Awesome图标库
   */
  loadFontAwesome() {
    // 检查是否已存在Font Awesome链接
    if (document.querySelector('link[href*="fontawesome"]')) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }
  
  /**
   * 检查系统主题偏好设置
   */
  checkSystemThemePreference() {
    const savedTheme = localStorage.getItem('vemos-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  /**
   * 监听系统主题变化
   */
  listenSystemThemeChange() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('vemos-theme')) {
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    });
  }
  
  /**
   * 切换主题
   * @param {'light'|'dark'|'auto'} theme - 要切换的主题
   */
  toggleTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('vemos-theme', 'light');
    } else if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('vemos-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('vemos-theme');
      this.checkSystemThemePreference();
    }
  }
  
  /**
   * 获取当前主题
   * @returns {'light'|'dark'|'auto'} 当前主题
   */
  getCurrentTheme() {
    const savedTheme = localStorage.getItem('vemos-theme');
    if (savedTheme) {
      return savedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  }
  
  /**
   * 切换暗黑模式
   * @param {boolean} enable - 是否启用暗黑模式
   */
  toggleDarkMode(enable) {
    if (enable) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('vemos-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('vemos-theme', 'light');
    }
  }
  
  /**
   * 检查是否为暗黑模式
   * @returns {boolean} 是否为暗黑模式
   */
  isDarkMode() {
    const savedTheme = localStorage.getItem('vemos-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }
}

// 等待DOM加载完成后初始化VemosUI
document.addEventListener('DOMContentLoaded', () => {
  window.VemosUI = new VemosUI();
});