// 表格组件

// 确保VemosUI已存在
function registerTableComponent() {
  if (window.VemosUI) {
    // 注册表格组件
    window.VemosUI.registerComponent('v-table', {
      props: ['data', 'columns', 'border', 'stripe', 'size', 'theme'],
      template(props) {
        const { 
          data = '[]', 
          columns = '[]', 
          border = false, 
          stripe = false, 
          size = 'medium',
          theme = 'default'
        } = props;
        
        let tableData = [];
        let tableColumns = [];
        
        try {
          tableData = JSON.parse(data);
        } catch (e) {
          console.error('v-table: data属性必须是有效的JSON字符串');
        }
        
        try {
          tableColumns = JSON.parse(columns);
        } catch (e) {
          console.error('v-table: columns属性必须是有效的JSON字符串');
        }
        
        const borderClass = border === '' || border === 'true' ? 'v-table--border' : '';
        const stripeClass = stripe === '' || stripe === 'true' ? 'v-table--stripe' : '';
        const sizeClass = `v-table--${size}`;
        const themeClass = `v-table--theme-${theme}`;
        
        // 构建表头
        let headerHtml = '';
        tableColumns.forEach(col => {
          headerHtml += `<th class="v-table__cell" style="width: ${col.width || 'auto'}">${col.title || col.prop}</th>`;
        });
        
        // 构建表格主体
        let bodyHtml = '';
        tableData.forEach((row, rowIndex) => {
          const rowClass = stripeClass && rowIndex % 2 === 1 ? 'v-table__row--striped' : '';
          let rowHtml = '';
          
          tableColumns.forEach(col => {
            const cellValue = getNestedValue(row, col.prop);
            const formatter = col.formatter;
            let displayValue = cellValue;
            
            if (formatter && typeof(formatter) === 'function') {
              displayValue = formatter(row, col, cellValue, rowIndex);
            }
            
            rowHtml += `<td class="v-table__cell">${displayValue}</td>`;
          });
          
          bodyHtml += `<tr class="v-table__row ${rowClass}">${rowHtml}</tr>`;
        });
        
        return `
          <div class="v-table ${borderClass} ${stripeClass} ${sizeClass} ${themeClass}">
            <table class="v-table__inner">
              <thead class="v-table__header">
                <tr class="v-table__row">
                  ${headerHtml}
                </tr>
              </thead>
              <tbody class="v-table__body">
                ${bodyHtml}
              </tbody>
            </table>
          </div>
        `;
      },
      styles: `
        .v-table {
          width: 100%;
          max-width: 100%;
          background-color: var(--vemos-bg-default, #fff);
          border-collapse: collapse;
          font-size: 14px;
          color: var(--vemos-text-default, #606266);
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .v-table__inner {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        .v-table--border {
          border: 1px solid var(--vemos-border-default, #dcdfe6);
          border-radius: 4px;
        }
        
        .v-table--border th,
        .v-table--border td {
          border-right: 1px solid var(--vemos-border-default, #dcdfe6);
        }
        
        .v-table--border th:last-child,
        .v-table--border td:last-child {
          border-right: none;
        }
        
        .v-table--border tr:not(:last-child) {
          border-bottom: 1px solid var(--vemos-border-default, #dcdfe6);
        }
        
        .v-table--stripe .v-table__row:nth-child(even):not(.v-table__row--striped) {
          background-color: var(--vemos-bg-tertiary, #f5f7fa);
        }
        
        .v-table__row--striped {
          background-color: var(--vemos-bg-tertiary, #fafafa);
        }
        
        .v-table--small {
          font-size: 12px;
        }
        
        .v-table--large {
          font-size: 16px;
        }
        
        .v-table__header {
          background-color: var(--vemos-bg-tertiary, #f5f7fa);
        }
        
        .v-table__row {
          transition: background-color 0.25s;
        }
        
        .v-table__row:hover {
          background-color: var(--vemos-bg-tertiary, #ecf5ff);
        }
        
        .v-table__cell {
          padding: 12px 0;
          text-align: left;
          vertical-align: middle;
          min-width: 0;
          word-wrap: break-word;
          color: var(--vemos-text-default, #606266);
        }
        
        .v-table__header .v-table__cell {
          padding: 10px 0;
          font-weight: 600;
          color: var(--vemos-text-default, #909399);
          background-color: var(--vemos-bg-tertiary, #f5f7fa);
        }
        
        .v-table--small .v-table__cell {
          padding: 8px 0;
        }
        
        .v-table--small .v-table__header .v-table__cell {
          padding: 6px 0;
        }
        
        .v-table--large .v-table__cell {
          padding: 16px 0;
        }
        
        .v-table--large .v-table__header .v-table__cell {
          padding: 14px 0;
        }
        
        .v-table__cell:first-child {
          padding-left: 16px;
        }
        
        .v-table__cell:last-child {
          padding-right: 16px;
        }
        
        /* 主题颜色 */
        .v-table--theme-default {
          color: var(--vemos-text-default, #606266);
        }
        
        .v-table--theme-default .v-table__header {
          background-color: var(--vemos-bg-tertiary, #f5f7fa);
          color: var(--vemos-text-default, #909399);
        }
        
        .v-table--theme-primary {
          color: var(--vemos-text-primary, #409EFF);
        }
        
        .v-table--theme-primary .v-table__header {
          background-color: var(--vemos-bg-primary, #409EFF);
          color: var(--vemos-text-primary, #fff);
        }
        
        .v-table--theme-success {
          color: var(--vemos-text-success, #67c23a);
        }
        
        .v-table--theme-success .v-table__header {
          background-color: var(--vemos-bg-success, #67c23a);
          color: var(--vemos-text-success, #fff);
        }
        
        .v-table--theme-warning {
          color: var(--vemos-text-warning, #e6a23c);
        }
        
        .v-table--theme-warning .v-table__header {
          background-color: var(--vemos-bg-warning, #e6a23c);
          color: var(--vemos-text-warning, #fff);
        }
        
        .v-table--theme-error {
          color: var(--vemos-text-error, #f56c6c);
        }
        
        .v-table--theme-error .v-table__header {
          background-color: var(--vemos-bg-error, #f56c6c);
          color: var(--vemos-text-error, #fff);
        }
        
        .v-table--theme-info {
          color: var(--vemos-text-tertiary, #909399);
        }
        
        .v-table--theme-info .v-table__header {
          background-color: var(--vemos-bg-tertiary, #909399);
          color: var(--vemos-text-tertiary, #fff);
        }
        
        /* 主题背景色 - 适配明亮/暗黑模式 */
        .v-table--theme-primary.v-table--background,
        .v-table--theme-primary.v-table--bg {
          background-color: var(--vemos-bg-primary, #409EFF);
          color: var(--vemos-text-primary, #fff);
        }
        
        .v-table--theme-success.v-table--background,
        .v-table--theme-success.v-table--bg {
          background-color: var(--vemos-bg-success, #67C23A);
          color: var(--vemos-text-success, #fff);
        }
        
        .v-table--theme-warning.v-table--background,
        .v-table--theme-warning.v-table--bg {
          background-color: var(--vemos-bg-warning, #E6A23C);
          color: var(--vemos-text-warning, #fff);
        }
        
        .v-table--theme-error.v-table--background,
        .v-table--theme-error.v-table--bg {
          background-color: var(--vemos-bg-error, #F56C6C);
          color: var(--vemos-text-error, #fff);
        }
        
        .v-table--theme-info.v-table--background,
        .v-table--theme-info.v-table--bg {
          background-color: var(--vemos-bg-tertiary, #909399);
          color: var(--vemos-text-tertiary, #fff);
        }
        
        /* 为表格内容行也应用主题颜色 */
        .v-table--theme-primary tbody tr {
          background-color: transparent;
        }
        
        /* 为表格内容行也应用主题颜色 - 使用淡色背景实现条纹效果 */
        .v-table--theme-primary tbody tr:nth-child(even):not(.v-table__row--striped),
        .v-table--theme-primary .v-table__row--striped {
          background-color: var(--vemos-bg-primary, #ecf5ff);
        }
        
        .v-table--theme-success tbody tr:nth-child(even):not(.v-table__row--striped),
        .v-table--theme-success .v-table__row--striped {
          background-color: var(--vemos-bg-success, #f0f9eb);
        }
        
        .v-table--theme-warning tbody tr:nth-child(even):not(.v-table__row--striped),
        .v-table--theme-warning .v-table__row--striped {
          background-color: var(--vemos-bg-warning, #fdf6ec);
        }
        
        .v-table--theme-error tbody tr:nth-child(even):not(.v-table__row--striped),
        .v-table--theme-error .v-table__row--striped {
          background-color: var(--vemos-bg-error, #fef0f0);
        }
        
        .v-table--theme-info tbody tr:nth-child(even):not(.v-table__row--striped),
        .v-table--theme-info .v-table__row--striped {
          background-color: var(--vemos-bg-tertiary, #f4f4f5);
        }
      `
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerTableComponent, 100);
  }
}

// 辅助函数：获取嵌套对象的值
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null) {
      return '';
    }
    result = result[key];
  }
  
  return result != null ? result : '';
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerTableComponent);
} else {
  registerTableComponent();
}