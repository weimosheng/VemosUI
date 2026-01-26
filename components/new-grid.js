// ==========================================
// GridContainer 组件 - 完全重写
// ==========================================
vemos.registerComponent('v-grid-container', {
  props: ['columns', 'gap', 'responsive'],

  template(props) {
    const columns = parseInt(props.columns) || 12;
    const gap = props.gap || '16px';
    const isResponsive = props.responsive === 'true' || props.responsive === '';
    
    return `
      <style>
        /* 网格容器样式 */
        .v-grid-container {
          display: grid;
          grid-template-columns: repeat(${columns}, 1fr);
          gap: ${gap};
          width: 100%;
          box-sizing: border-box;
        }
        
        /* 响应式样式 */
        ${isResponsive ? `
          @media (max-width: 575.98px) {
            .v-grid-container {
              grid-template-columns: repeat(1, 1fr);
            }
          }
          
          @media (min-width: 576px) and (max-width: 767.98px) {
            .v-grid-container {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 768px) and (max-width: 991.98px) {
            .v-grid-container {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          @media (min-width: 992px) and (max-width: 1199.98px) {
            .v-grid-container {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          
          @media (min-width: 1200px) {
            .v-grid-container {
              grid-template-columns: repeat(${columns}, 1fr);
            }
          }
        ` : ''}
        
        /* 网格项基础样式 - 通过容器控制 */
        .v-grid-container ::slotted(*) {
          min-height: 50px;
          box-sizing: border-box;
        }
      </style>
      
      <div class="v-grid-container">
        <slot></slot>
      </div>
    `;
  }
});

// ==========================================
// GridItem 组件 - 简化和修正
// ==========================================
vemos.registerComponent('v-grid-item', {
  props: ['span', 'offset', 'xs', 'sm', 'md', 'lg', 'xl'],

  template(props) {
    const span = parseInt(props.span) || 1;
    const offset = parseInt(props.offset) || 0;
    
    // 生成基础样式
    let gridColumn = '';
    if (offset > 0) {
      gridColumn = `${offset + 1} / span ${span}`;
    } else {
      gridColumn = `span ${span}`;
    }
    
    // 处理响应式属性
    const responsiveStyles = this.generateResponsiveStyles(props);
    
    return `
      <style>
        :host {
          display: block;
          grid-column: ${gridColumn};
        }
        
        ${responsiveStyles}
        
        .grid-item-content {
          height: 100%;
          box-sizing: border-box;
        }
      </style>
      
      <div class="grid-item-content">
        <slot></slot>
      </div>
    `;
  },
  
  generateResponsiveStyles(props) {
    const breakpoints = {
      xs: '(max-width: 575.98px)',
      sm: '(min-width: 576px) and (max-width: 767.98px)',
      md: '(min-width: 768px) and (max-width: 991.98px)',
      lg: '(min-width: 992px) and (max-width: 1199.98px)',
      xl: '(min-width: 1200px)'
    };
    
    let styles = '';
    
    Object.entries(breakpoints).forEach(([bp, query]) => {
      if (props[bp]) {
        const value = props[bp].toString();
        let span = 1;
        let offset = 0;
        
        if (value.includes(',')) {
          const parts = value.split(',');
          span = parseInt(parts[0]) || 1;
          offset = parseInt(parts[1]) || 0;
        } else {
          span = parseInt(value) || 1;
        }
        
        let gridColumn = '';
        if (offset > 0) {
          gridColumn = `${offset + 1} / span ${span}`;
        } else {
          gridColumn = `span ${span}`;
        }
        
        styles += `
          @media ${query} {
            :host {
              grid-column: ${gridColumn};
            }
          }
        `;
      }
    });
    
    return styles;
  }
});

// 添加v-gi作为v-grid-item的别名
vemos.registerComponent('v-gi', {
  props: ['span', 'offset', 'xs', 'sm', 'md', 'lg', 'xl'],

  template(props) {
    const span = parseInt(props.span) || 1;
    const offset = parseInt(props.offset) || 0;
    
    // 生成基础样式
    let gridColumn = '';
    if (offset > 0) {
      gridColumn = `${offset + 1} / span ${span}`;
    } else {
      gridColumn = `span ${span}`;
    }
    
    // 处理响应式属性
    const responsiveStyles = this.generateResponsiveStyles(props);
    
    return `
      <style>
        :host {
          display: block;
          grid-column: ${gridColumn};
        }
        
        ${responsiveStyles}
        
        .grid-item-content {
          height: 100%;
          box-sizing: border-box;
        }
      </style>
      
      <div class="grid-item-content">
        <slot></slot>
      </div>
    `;
  },
  
  generateResponsiveStyles(props) {
    const breakpoints = {
      xs: '(max-width: 575.98px)',
      sm: '(min-width: 576px) and (max-width: 767.98px)',
      md: '(min-width: 768px) and (max-width: 991.98px)',
      lg: '(min-width: 992px) and (max-width: 1199.98px)',
      xl: '(min-width: 1200px)'
    };
    
    let styles = '';
    
    Object.entries(breakpoints).forEach(([bp, query]) => {
      if (props[bp]) {
        const value = props[bp].toString();
        let span = 1;
        let offset = 0;
        
        if (value.includes(',')) {
          const parts = value.split(',');
          span = parseInt(parts[0]) || 1;
          offset = parseInt(parts[1]) || 0;
        } else {
          span = parseInt(value) || 1;
        }
        
        let gridColumn = '';
        if (offset > 0) {
          gridColumn = `${offset + 1} / span ${span}`;
        } else {
          gridColumn = `span ${span}`;
        }
        
        styles += `
          @media ${query} {
            :host {
              grid-column: ${gridColumn};
            }
          }
        `;
      }
    });
    
    return styles;
  }
});

// ==========================================
// 替代方案：更简单的版本
// ==========================================
vemos.registerComponent('simple-grid-container', {
  props: ['columns', 'gap'],
  
  template(props) {
    const columns = props.columns || 12;
    const gap = props.gap || '16px';
    
    return `
      <style>
        .simple-grid {
          display: grid;
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
          gap: ${gap};
          width: 100%;
        }
        
        /* 确保网格项正确放置 */
        .simple-grid > * {
          grid-column: span 1;
          min-height: 50px;
        }
      </style>
      
      <div class="simple-grid">
        <slot></slot>
      </div>
    `;
  }
});

vemos.registerComponent('simple-grid-item', {
  props: ['span'],
  
  template(props) {
    const span = props.span || 1;
    
    return `
      <style>
        :host {
          display: block;
          grid-column: span ${span};
        }
        
        .item-content {
          height: 100%;
          background-color: rgba(0, 120, 255, 0.1);
          border: 1px solid rgba(0, 120, 255, 0.3);
          padding: 16px;
          box-sizing: border-box;
        }
      </style>
      
      <div class="item-content">
        <slot></slot>
      </div>
    `;
  }
});