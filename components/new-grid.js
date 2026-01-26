// ==========================================
// GridContainer 组件 - 优化版本，增加更灵活的响应式功能
// ==========================================
vemos.registerComponent('v-grid', {
  props: ['columns', 'cols', 'gap', 'gutter', 'x-gap', 'y-gap', 'responsive', 'item-responsive'],

  template(props) {
    const columns = parseInt(props.columns) || parseInt(props.cols) || 12;
    const gap = props.gap || props.gutter || '16px'; // 兼容gap和gutter属性名
    let horizontalGap = '16px';
    let verticalGap = '16px';
    
    // 检查是否有单独的x-gap和y-gap属性
    if (props['x-gap'] !== undefined || props['y-gap'] !== undefined) {
      // 确保为x-gap和y-gap提供默认值
      let xGapValue = props['x-gap'];
      let yGapValue = props['y-gap'];
      
      // 为x-gap添加单位（如果缺少单位）
      if (xGapValue && !isNaN(xGapValue) && !xGapValue.includes('px') && !xGapValue.includes('%') && !xGapValue.includes('rem') && !xGapValue.includes('em')) {
        horizontalGap = xGapValue + 'px';
      } else if (xGapValue) {
        horizontalGap = xGapValue;
      }
      
      // 为y-gap添加单位（如果缺少单位）
      if (yGapValue && !isNaN(yGapValue) && !yGapValue.includes('px') && !yGapValue.includes('%') && !yGapValue.includes('rem') && !yGapValue.includes('em')) {
        verticalGap = yGapValue + 'px';
      } else if (yGapValue) {
        verticalGap = yGapValue;
      }
    } 
    // 保持原有的gap/gutter兼容性
    else if (gap.startsWith('[') && gap.endsWith(']')) {
      try {
        const gapArray = JSON.parse(gap);
        if (Array.isArray(gapArray) && gapArray.length >= 2) {
          horizontalGap = gapArray[0] + 'px';
          verticalGap = gapArray[1] + 'px';
        } else if (Array.isArray(gapArray) && gapArray.length === 1) {
          horizontalGap = verticalGap = gapArray[0] + 'px';
        }
      } catch(e) {
        console.warn('Invalid gap format, using default value');
        horizontalGap = verticalGap = '16px';
      }
    } else {
      // 如果是单个值，同时设置水平和垂直间距
      if (!isNaN(gap) && !gap.includes('px') && !gap.includes('%') && !gap.includes('rem') && !gap.includes('em')) {
        horizontalGap = verticalGap = gap + 'px';
      } else {
        horizontalGap = verticalGap = gap;
      }
    }
    
    // 解析响应式列数定义 (类似 Naive UI 的语法: "2 400:4 600:6")
    const isResponsive = props.responsive === 'true' || props.responsive === '';
    const isItemResponsive = props['item-responsive'] === 'true' || props['item-responsive'] === '';
    
    let responsiveStyle = '';
    if (isResponsive) {
      // 解析响应式定义
      const responsiveCols = parseResponsiveCols(props.cols || props.columns || '12');
      
      // 使用解析后的响应式列数定义
      const xsCols = responsiveCols.xs || 1;
      const smCols = responsiveCols.sm || Math.min(2, responsiveCols.xs || 1);
      const mdCols = responsiveCols.md || Math.min(3, responsiveCols.sm || 2);
      const lgCols = responsiveCols.lg || Math.min(4, responsiveCols.md || 3);
      const xlCols = responsiveCols.xl || responsiveCols.default || columns;
      const xxlCols = responsiveCols.xxl || xlCols;
      
      responsiveStyle = `
        @media (max-width: 575px) {
          .v-grid {
            grid-template-columns: repeat(${xsCols}, 1fr);
          }
        }
        
        @media (min-width: 576px) and (max-width: 767px) {
          .v-grid {
            grid-template-columns: repeat(${smCols}, 1fr);
          }
        }
        
        @media (min-width: 768px) and (max-width: 991px) {
          .v-grid {
            grid-template-columns: repeat(${mdCols}, 1fr);
          }
        }
        
        @media (min-width: 992px) and (max-width: 1199px) {
          .v-grid {
            grid-template-columns: repeat(${lgCols}, 1fr);
          }
        }
        
        @media (min-width: 1200px) and (max-width: 1599px) {
          .v-grid {
            grid-template-columns: repeat(${xlCols}, 1fr);
          }
        }
        
        @media (min-width: 1600px) {
          .v-grid {
            grid-template-columns: repeat(${xxlCols}, 1fr);
          }
        }
      `;
    }
    
    // 如果指定了响应式列数定义（如 "2 400:4 600:6"），则不管是否设置了 responsive 属性，都要应用响应式样式
    if(typeof props.cols === 'string' && props.cols.match(/\d+\s*\d+:\d+/)) {
      const responsiveCols = parseResponsiveCols(props.cols);
      
      const xsCols = responsiveCols.xs || 1;
      const smCols = responsiveCols.sm || Math.min(2, responsiveCols.xs || 1);
      const mdCols = responsiveCols.md || Math.min(3, responsiveCols.sm || 2);
      const lgCols = responsiveCols.lg || Math.min(4, responsiveCols.md || 3);
      const xlCols = responsiveCols.xl || responsiveCols.default || columns;
      const xxlCols = responsiveCols.xxl || xlCols;
      
      responsiveStyle = `
        @media (max-width: 575px) {
          .v-grid {
            grid-template-columns: repeat(${xsCols}, 1fr);
          }
        }
        
        @media (min-width: 576px) and (max-width: 767px) {
          .v-grid {
            grid-template-columns: repeat(${smCols}, 1fr);
          }
        }
        
        @media (min-width: 768px) and (max-width: 991px) {
          .v-grid {
            grid-template-columns: repeat(${mdCols}, 1fr);
          }
        }
        
        @media (min-width: 992px) and (max-width: 1199px) {
          .v-grid {
            grid-template-columns: repeat(${lgCols}, 1fr);
          }
        }
        
        @media (min-width: 1200px) and (max-width: 1599px) {
          .v-grid {
            grid-template-columns: repeat(${xlCols}, 1fr);
          }
        }
        
        @media (min-width: 1600px) {
          .v-grid {
            grid-template-columns: repeat(${xxlCols}, 1fr);
          }
        }
      `;
    }
    
    return `
      <style>
        /* 网格容器样式 */
        .v-grid {
          display: grid;
          grid-template-columns: repeat(${columns}, 1fr);
          gap: ${verticalGap} ${horizontalGap};
          width: 100%;
          box-sizing: border-box;
        }
        
        ${responsiveStyle}
        
        /* 网格项基础样式 - 通过容器控制 */
        .v-grid ::slotted(*) {
          min-height: 50px;
          box-sizing: border-box;
        }
      </style>
      
      <div class="v-grid">
        <slot></slot>
      </div>
    `;
  }
});

// 解析响应式列数定义 (类似 Naive UI 的语法: "2 400:4 600:6")
function parseResponsiveCols(colsDef) {
  const result = {};
  
  // 如果是简单的数字，则不是响应式定义
  if (!isNaN(colsDef)) {
    result.default = parseInt(colsDef);
    return result;
  }
  
  // 解析响应式定义，如 "2 400:4 600:6"
  const parts = colsDef.split(/\s+/);
  
  for (const part of parts) {
    if (part.includes(':')) {
      // 这是一个断点定义，如 "400:4"
      const [breakpoint, cols] = part.split(':');
      const bpNum = parseInt(breakpoint);
      const colsNum = parseInt(cols);
      
      if (!isNaN(bpNum) && !isNaN(colsNum)) {
        if (bpNum < 576) result.xs = colsNum;
        else if (bpNum >= 576 && bpNum < 768) result.sm = colsNum;
        else if (bpNum >= 768 && bpNum < 992) result.md = colsNum;
        else if (bpNum >= 992 && bpNum < 1200) result.lg = colsNum;
        else if (bpNum >= 1200 && bpNum < 1600) result.xl = colsNum;
        else if (bpNum >= 1600) result.xxl = colsNum;
      }
    } else {
      // 这是默认列数
      const colsNum = parseInt(part);
      if (!isNaN(colsNum)) {
        result.default = colsNum;
      }
    }
  }
  
  return result;
}

// ==========================================
// GridItem 组件 - 优化版本，支持更灵活的响应式语法
// ==========================================
vemos.registerComponent('v-grid-item', {
  props: ['span', 'offset', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],

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
      xs: '(max-width: 575px)',
      sm: '(min-width: 576px) and (max-width: 767px)',
      md: '(min-width: 768px) and (max-width: 991px)',
      lg: '(min-width: 992px) and (max-width: 1199px)',
      xl: '(min-width: 1200px) and (max-width: 1599px)',
      xxl: '(min-width: 1600px)'
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
  props: ['span', 'offset', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],

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
      xs: '(max-width: 575px)',
      sm: '(min-width: 576px) and (max-width: 767px)',
      md: '(min-width: 768px) and (max-width: 991px)',
      lg: '(min-width: 992px) and (max-width: 1199px)',
      xl: '(min-width: 1200px) and (max-width: 1599px)',
      xxl: '(min-width: 1600px)'
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