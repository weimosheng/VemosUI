// 获取 VemosUI 实例（确保在主文件执行后运行）
const vemos = window.VemosUI || new VemosUI();

// ==========================================
// 1. 注册 Row 组件 (行容器)
// ==========================================
vemos.registerComponent('v-row', {
  props: ['gutter', 'justify', 'align'],
  
  styles: `
    :host {
      display: block;
      /* 默认间距为0，防止未设置gutter时计算错误 */
    }
    .v-row-container {
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      /* 通过负 Margin 抵消 Column 的 Padding */
      margin-left: calc(var(--row-gutter) / -2);
      margin-right: calc(var(--row-gutter) / -2);
    }
  `,

  template(props) {
    const gutter = props.gutter ? parseInt(props.gutter, 10) : 0;
    
    // 映射 flex 属性
    const justifyMap = {
      'start': 'flex-start',
      'end': 'flex-end',
      'center': 'center',
      'space-around': 'space-around',
      'space-between': 'space-between',
      'space-evenly': 'space-evenly'
    };
    
    const alignMap = {
      'top': 'flex-start',
      'middle': 'center',
      'bottom': 'flex-end'
    };

    const justifyContent = justifyMap[props.justify] || 'flex-start';
    const alignItems = alignMap[props.align] || 'stretch';

    // 动态注入 CSS 变量和 Flex 样式
    return `
      <style>
        :host {
          --row-gutter: ${gutter}px;
        }
        .v-row-container {
          justify-content: ${justifyContent};
          align-items: ${alignItems};
        }
      </style>
      <div class="v-row-container">
        <slot></slot>
      </div>
    `;
  }
});

// ==========================================
// 2. 注册 Col 组件 (列元素)
// ==========================================
vemos.registerComponent('v-col', {
  // 监听基础属性 + 响应式断点属性
  props: ['span', 'offset', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],

  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      /* 读取父级 Row 设置的变量 */
      padding-left: calc(var(--row-gutter) / 2);
      padding-right: calc(var(--row-gutter) / 2);
      /* 默认占满一行 */
      width: 100%;
      flex: 0 0 100%;
    }
  `,

  template(props) {
    // 辅助函数：计算百分比宽度
    const getWidth = (span) => {
      if (!span) return '100%';
      const width = (parseInt(span, 10) / 24) * 100;
      return `${width}%`;
    };

    // 辅助函数：计算 Offset margin
    const getOffset = (offset) => {
      if (!offset) return '0';
      const marginLeft = (parseInt(offset, 10) / 24) * 100;
      return `${marginLeft}%`;
    };

    let dynamicStyles = '';

    // 1. 处理默认 span 和 offset
    if (props.span || props.offset) {
      dynamicStyles += `
        :host {
          flex: 0 0 ${getWidth(props.span)};
          max-width: ${getWidth(props.span)};
          margin-left: ${getOffset(props.offset)};
        }
      `;
    }

    // 2. 处理响应式断点 (xs, sm, md, lg, xl, xxl)
    // 直接复用你主类中定义的断点数据
    const breakpoints = vemos.breakpoints || { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 };
    
    Object.keys(breakpoints).forEach(bp => {
      if (props[bp]) {
        // 如果属性值类似 '6' (span) 或者 '{"span": 6, "offset": 2}' (复杂对象暂不支持，这里假设只传span数字)
        // 为了方便 HTML 属性书写，我们假设 props[bp] 的值就是 span 的值
        const spanVal = props[bp];
        const width = (parseInt(spanVal, 10) / 24) * 100;
        
        dynamicStyles += `
          @media (min-width: ${breakpoints[bp]}px) {
            :host {
              flex: 0 0 ${width}%;
              max-width: ${width}%;
            }
          }
        `;
      }
    });

    return `
      <style>${dynamicStyles}</style>
      <slot></slot>
    `;
  }
});