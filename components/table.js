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
          background-color: #fff;
          border-collapse: collapse;
          font-size: 14px;
          color: #606266;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .v-table__inner {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        .v-table--border {
          border: 1px solid #dcdfe6;
          border-radius: 4px;
        }
        
        .v-table--border th,
        .v-table--border td {
          border-right: 1px solid #dcdfe6;
        }
        
        .v-table--border th:last-child,
        .v-table--border td:last-child {
          border-right: none;
        }
        
        .v-table--border tr:not(:last-child) {
          border-bottom: 1px solid #dcdfe6;
        }
        
        .v-table--stripe .v-table__row:nth-child(even):not(.v-table__row--striped) {
          background-color: #fafafa;
        }
        
        .v-table__row--striped {
          background-color: #fafafa;
        }
        
        .v-table--small {
          font-size: 12px;
        }
        
        .v-table--large {
          font-size: 16px;
        }
        
        .v-table__header {
          background-color: #f5f7fa;
        }
        
        .v-table__row {
          transition: background-color 0.25s;
        }
        
        .v-table__row:hover {
          background-color: #ecf5ff;
        }
        
        .v-table__cell {
          padding: 12px 0;
          text-align: left;
          vertical-align: middle;
          min-width: 0;
          word-wrap: break-word;
        }
        
        .v-table__header .v-table__cell {
          padding: 10px 0;
          font-weight: 600;
          color: #909399;
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
          color: #606266;
        }
        
        .v-table--theme-default .v-table__header {
          background-color: #f5f7fa;
          color: #909399;
        }
        
        .v-table--theme-primary {
          color: #409EFF;
        }
        
        .v-table--theme-primary .v-table__header {
          background-color: #409EFF;
          color: #fff;
        }
        
        .v-table--theme-success {
          color: #67c23a;
        }
        
        .v-table--theme-success .v-table__header {
          background-color: #67c23a;
          color: #fff;
        }
        
        .v-table--theme-warning {
          color: #e6a23c;
        }
        
        .v-table--theme-warning .v-table__header {
          background-color: #e6a23c;
          color: #fff;
        }
        
        .v-table--theme-danger {
          color: #f56c6c;
        }
        
        .v-table--theme-danger .v-table__header {
          background-color: #f56c6c;
          color: #fff;
        }
        
        .v-table--theme-info {
          color: #909399;
        }
        
        .v-table--theme-info .v-table__header {
          background-color: #909399;
          color: #fff;
        }
        
        /* 主题背景色 */
        .v-table--theme-primary.v-table--background,
        .v-table--theme-primary.v-table--bg {
          background-color: #ecf5ff;
        }
        
        .v-table--theme-success.v-table--background,
        .v-table--theme-success.v-table--bg {
          background-color: #f0f9eb;
        }
        
        .v-table--theme-warning.v-table--background,
        .v-table--theme-warning.v-table--bg {
          background-color: #fdf6ec;
        }
        
        .v-table--theme-danger.v-table--background,
        .v-table--theme-danger.v-table--bg {
          background-color: #fef0f0;
        }
        
        .v-table--theme-info.v-table--background,
        .v-table--theme-info.v-table--bg {
          background-color: #f4f4f5;
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