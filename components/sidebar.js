// 侧边菜单栏组件示例

// 确保VemosUI已存在
function registerSidebarComponent() {
  if (window.VemosUI) {
    // 创建一个内部函数来 handle 事件绑定
    const bindEvents = function(self) {
      // 为菜单项添加点击事件
      const menuItems = self.shadowRoot.querySelectorAll('.v-sidebar-item__content');
      menuItems.forEach((item, index) => {
        // 清除之前的事件监听器
        item.replaceWith(item.cloneNode(true));
        const newItem = self.shadowRoot.querySelectorAll('.v-sidebar-item__content')[index];
        
        newItem.addEventListener('click', (e) => {
          const parentDiv = newItem.parentElement;
          const hasChildren = parentDiv.dataset.hasChildren === 'true';
          
          if (hasChildren) {
            // 如果有子菜单，则展开/收起
            const submenu = parentDiv.querySelector('.v-sidebar-submenu');
            if (submenu) {
              const isCurrentlyExpanded = submenu.style.display === 'block';
              submenu.style.display = isCurrentlyExpanded ? 'none' : 'block';
              
              // 更新箭头方向
              const arrow = newItem.querySelector('.v-sidebar-item__arrow');
              if (arrow) {
                arrow.style.transform = isCurrentlyExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
              }
              
              // 更新items属性中的expanded状态
              const currentItemsStr = self.getAttribute('items');
              if (currentItemsStr) {
                try {
                  const itemsArray = JSON.parse(currentItemsStr);
                  if (itemsArray[index]) {
                    itemsArray[index].expanded = !isCurrentlyExpanded;
                    self.setAttribute('items', JSON.stringify(itemsArray));
                  }
                } catch (e) {
                  console.error('解析items属性失败:', e);
                }
              }
            }
          } else {
            // 如果没有子菜单，则触发自定义事件
            const itemIndex = parseInt(parentDiv.dataset.index);
            self.dispatchEvent(new CustomEvent('v-sidebar-item-click', {
              detail: { index: itemIndex },
              bubbles: true
            }));
          }
        });
      });
      
      // 为子菜单项添加点击事件
      const subMenuItems = self.shadowRoot.querySelectorAll('.v-sidebar-subitem');
      subMenuItems.forEach((item, itemIndex) => {
        // 清除之前的事件监听器
        item.replaceWith(item.cloneNode(true));
        const newSubItem = self.shadowRoot.querySelectorAll('.v-sidebar-subitem')[itemIndex];
        
        newSubItem.addEventListener('click', (e) => {
          const parentIndex = parseInt(newSubItem.getAttribute('data-parent-index'));
          const index = parseInt(newSubItem.getAttribute('data-index'));
          
          self.dispatchEvent(new CustomEvent('v-sidebar-subitem-click', {
            detail: { parentIndex, index },
            bubbles: true
          }));
        });
      });
    };

    // 注册侧边菜单栏组件
    window.VemosUI.registerComponent('v-sidebar', {
      props: ['items', 'width', 'collapsed'],
      template(props) {
        const { 
          items = '[]', 
          width = '240px', 
          collapsed = false 
        } = props;
        
        let itemsArray = [];
        try {
          itemsArray = JSON.parse(items);
        } catch (e) {
          console.error('v-sidebar: items属性必须是有效的JSON字符串');
          itemsArray = [];
        }
        
        const isCollapsed = collapsed === '' || collapsed === 'true';
        
        let menuHtml = '';
        itemsArray.forEach((item, index) => {
          const activeClass = item.active ? ' v-sidebar-item--active' : '';
          const hasChildren = item.children && item.children.length > 0;
          
          menuHtml += `
            <div class="v-sidebar-item ${activeClass}" data-index="${index}" data-has-children="${!!hasChildren}">
              <div class="v-sidebar-item__content">
                ${item.icon ? `<i class="v-sidebar-item__icon">${item.icon}</i>` : ''}
                <span class="v-sidebar-item__text">${item.text}</span>
                ${hasChildren ? '<i class="v-sidebar-item__arrow">▼</i>' : ''}
              </div>
              ${hasChildren ? `
                <div class="v-sidebar-submenu" style="display: ${item.expanded ? 'block' : 'none'};">
                  ${item.children.map((subItem, subIndex) => `
                    <div class="v-sidebar-subitem" data-parent-index="${index}" data-index="${subIndex}">
                      ${subItem.icon ? `<i class="v-sidebar-subitem__icon">${subItem.icon}</i>` : ''}
                      <span class="v-sidebar-subitem__text">${subItem.text}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `;
        });
        
        return `
          <aside class="v-sidebar" style="width: ${isCollapsed ? '64px' : width};">
            <div class="v-sidebar__header">
              <slot name="header"></slot>
            </div>
            <div class="v-sidebar__menu">
              ${menuHtml}
            </div>
            <div class="v-sidebar__footer">
              <slot name="footer"></slot>
            </div>
          </aside>
        `;
      },
      styles: `
        .v-sidebar {
          height: 100%;
          min-height: 100vh;
          background-color: var(--vemos-bg-default, #fff);
          color: var(--vemos-text-default, #333);
          box-shadow: 2px 0 6px rgba(0,21,41,.1);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          overflow-x: hidden;
        }
        
        /* 暗黑模式下侧边栏的样式 */
        [data-theme="dark"] .v-sidebar {
          background-color: var(--vemos-bg-default, #2d3748);
          color: var(--vemos-text-default, #e2e8f0);
        }
        
        .v-sidebar__header {
          padding: 20px;
          border-bottom: 1px solid var(--vemos-border-default, #e6e6e6);
        }
        
        .v-sidebar__menu {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
        }
        
        .v-sidebar__footer {
          padding: 10px;
          border-top: 1px solid var(--vemos-border-default, #e6e6e6);
          font-size: 12px;
          color: var(--vemos-text-tertiary, #909399);
        }
        
        .v-sidebar-item {
          padding: 0;
        }
        
        .v-sidebar-item__content {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 20px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
        }
        
        .v-sidebar-item__content:hover {
          background-color: var(--vemos-bg-tertiary, #ecf5ff);
          color: var(--vemos-text-primary, #409eff);
        }
        
        .v-sidebar-item--active > .v-sidebar-item__content {
          background-color: var(--vemos-bg-primary, #409eff);
          color: var(--vemos-text-primary, #fff);
        }
        
        .v-sidebar-item__icon {
          width: 24px;
          margin-right: 8px;
          text-align: center;
          font-size: 16px;
        }
        
        .v-sidebar-item__text {
          flex: 1;
          font-size: 14px;
        }
        
        .v-sidebar-item__arrow {
          font-size: 12px;
          transition: transform 0.3s;
        }
        
        .v-sidebar-item--expanded > .v-sidebar-item__content > .v-sidebar-item__arrow {
          transform: rotate(180deg);
        }
        
        .v-sidebar-submenu {
          padding-left: 20px;
          overflow: hidden;
          transition: all 0.3s;
        }
        
        .v-sidebar-subitem {
          display: flex;
          align-items: center;
          height: 36px;
          padding: 0 20px 0 32px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }
        
        .v-sidebar-subitem:hover {
          background-color: var(--vemos-bg-tertiary, #ecf5ff);
          color: var(--vemos-text-primary, #409eff);
        }
        
        .v-sidebar-subitem__icon {
          width: 24px;
          margin-right: 8px;
          text-align: center;
          font-size: 12px;
        }
        
        .v-sidebar-subitem__text {
          flex: 1;
        }
      `,
      mounted() {
        bindEvents(this);
      },
      updated(attrName) {
        if (attrName === 'items') {
          // 重新绑定事件
          bindEvents(this);
        }
      }
    });
  } else {
    // 如果VemosUI未初始化，则等待其初始化完成
    setTimeout(registerSidebarComponent, 100);
  }
}

// 确保在DOM加载完成后再执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerSidebarComponent);
} else {
  registerSidebarComponent();
}