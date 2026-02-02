// ==========================================
// GridContainer 组件 - 优化版本，增加更灵活的响应式功能
// ==========================================
vemos.registerComponent('v-grid', {
  props: ['columns', 'cols', 'gap', 'gutter', 'x-gap', 'y-gap', 'responsive', 'item-responsive'],

  template(props) {
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
    
    // 检查是否为响应式语法（包含冒号）
    if(typeof props.cols === 'string' && props.cols.includes(':')) {
      // 是响应式语法，解析并应用
      const responsiveDefinition = parseCustomResponsiveDefinition(props.cols);
      const responsiveStyle = generateCustomResponsiveStyle(responsiveDefinition);
      
      // 返回带有响应式样式的模板
      return `
        <style>
          /* 网格容器样式 - 使用响应式语法解析出的默认列数 */
          .v-grid {
            display: grid;
            grid-template-columns: repeat(${responsiveDefinition.default}, 1fr);
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
    
    // 非响应式情况，直接解析列数
    let baseColumns = 6;  // 改为6作为默认值，避免总是显示12
    if (props.cols !== undefined) {
      const colsValue = parseInt(props.cols);
      if (!isNaN(colsValue)) {
        baseColumns = colsValue;
      }
    } else if (props.columns !== undefined) {
      const columnsValue = parseInt(props.columns);
      if (!isNaN(columnsValue)) {
        baseColumns = columnsValue;
      }
    }

    // 非响应式情况，使用普通列数
    return `
      <style>
        /* 网格容器样式 */
        .v-grid {
          display: grid;
          grid-template-columns: repeat(${baseColumns}, 1fr);
          gap: ${verticalGap} ${horizontalGap};
          width: 100%;
          box-sizing: border-box;
        }
        
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

// 解析自定义响应式定义 (如 "4 400:2 600:1")
function parseCustomResponsiveDefinition(colsDef) {
  // 确保输入是字符串
  if (typeof colsDef !== 'string') {
    return { default: 6, breakpoints: [] };  // 改为6作为默认值
  }
  
  const parts = colsDef.trim().split(/\s+/);
  const breakpoints = [];
  let defaultCols = null; // 改为null，稍后处理
  
  for (const part of parts) {
    if (part.includes(':')) {
      // 这是一个断点定义，如 "400:2"
      const [breakpoint, cols] = part.split(':');
      const bpNum = parseInt(breakpoint);
      const colsNum = parseInt(cols);
      
      if (!isNaN(bpNum) && !isNaN(colsNum)) {
        breakpoints.push({ breakpoint: bpNum, cols: colsNum });
      }
    } else {
      // 这是默认列数
      const colsNum = parseInt(part);
      if (!isNaN(colsNum)) {
        defaultCols = colsNum; // 设置为解析到的值
      }
    }
  }
  
  // 如果没有找到默认列数，设置为6
  if (defaultCols === null) {
    defaultCols = 6;
  }
  
  return {
    default: defaultCols,
    breakpoints: breakpoints
  };
}

// 生成自定义响应式样式
function generateCustomResponsiveStyle(definition) {
  let style = '';
  
  // 默认样式（最大屏幕，也可能是最小屏幕，取决于断点设置）
  style += `
    .v-grid {
      grid-template-columns: repeat(${definition.default}, 1fr) !important;
    }
  `;
  
  // 为每个断点生成媒体查询，按从小到大的顺序排列
  // 使用 min-width，屏幕宽度大于等于断点时应用更大列数
  const sortedBreakpoints = [...definition.breakpoints].sort((a, b) => a.breakpoint - b.breakpoint);
  
  for (const bp of sortedBreakpoints) {
    style += `
      @media (min-width: ${bp.breakpoint}px) {
        .v-grid {
          grid-template-columns: repeat(${bp.cols}, 1fr) !important;
        }
      }
    `;
  }
  
  return style;
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
