// 侧边菜单栏组件示例 - 支持折叠和FontAwesome图标，折叠按钮在右侧

// 确保VemosUI已存在
function registerSidebarComponent() {
  if (window.VemosUI) {
    // 创建一个内部函数来 handle 事件绑定
    const bindEvents = function(self) {
      // 为菜单项添加点击事件
      const menuItems = self.shadowRoot.querySelectorAll('.v-sidebar-item__content');
      menuItems.forEach((item, index) => {
        item.replaceWith(item.cloneNode(true));
        const newItem = self.shadowRoot.querySelectorAll('.v-sidebar-item__content')[index];
        
        newItem.addEventListener('click', (e) => {
          const parentDiv = newItem.parentElement;
          const hasChildren = parentDiv.dataset.hasChildren === 'true';
          
          if (hasChildren) {
            const submenu = parentDiv.querySelector('.v-sidebar-submenu');
            if (submenu) {
              const isCurrentlyExpanded = submenu.classList.contains('expanded');
              
              // 先停止所有正在进行的动画
              submenu.style.transition = 'none';
              submenu.style.maxHeight = '';
              submenu.style.opacity = '';
              submenu.style.transform = '';
              
              if (isCurrentlyExpanded) {
                // 收起子菜单
                submenu.classList.remove('expanded');
                
                // 获取当前高度
                const currentHeight = submenu.scrollHeight;
                
                // 强制重排
                void submenu.offsetWidth;
                
                // 设置动画
                submenu.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, transform 0.4s ease';
                submenu.style.maxHeight = currentHeight + 'px';
                submenu.style.opacity = '1';
                submenu.style.transform = 'translateY(0)';
                
                // 强制重排，确保动画开始
                void submenu.offsetWidth;
                
                // 开始动画
                setTimeout(() => {
                  submenu.style.maxHeight = '0';
                  submenu.style.opacity = '0';
                  submenu.style.transform = 'translateY(-10px)';
                }, 10);
                
                // 动画完成后隐藏
                setTimeout(() => {
                  submenu.style.display = 'none';
                  submenu.style.transition = '';
                  submenu.style.maxHeight = '';
                  submenu.style.opacity = '';
                  submenu.style.transform = '';
                }, 410);
                
              } else {
                // 展开子菜单
                submenu.style.display = 'block';
                submenu.classList.add('expanded');
                
                // 强制重排
                void submenu.offsetWidth;
                
                // 设置初始状态
                submenu.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, transform 0.4s ease';
                submenu.style.maxHeight = '0';
                submenu.style.opacity = '0';
                submenu.style.transform = 'translateY(-10px)';
                
                // 强制重排，确保动画开始
                void submenu.offsetWidth;
                
                // 获取目标高度
                const targetHeight = submenu.scrollHeight;
                
                // 开始动画
                setTimeout(() => {
                  submenu.style.maxHeight = targetHeight + 'px';
                  submenu.style.opacity = '1';
                  submenu.style.transform = 'translateY(0)';
                }, 10);
                
                // 动画完成后清理
                setTimeout(() => {
                  submenu.style.transition = '';
                  submenu.style.maxHeight = '';
                  submenu.style.opacity = '';
                  submenu.style.transform = '';
                }, 410);
              }
              
              // 更新箭头方向动画
              const arrow = newItem.querySelector('.v-sidebar-item__arrow');
              if (arrow) {
                arrow.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                if (isCurrentlyExpanded) {
                  arrow.classList.remove('expanded');
                } else {
                  arrow.classList.add('expanded');
                }
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
      
      // 绑定右侧折叠/展开按钮事件
      const toggleBtn = self.shadowRoot.querySelector('.v-sidebar__toggle-right');
      if (toggleBtn) {
        toggleBtn.replaceWith(toggleBtn.cloneNode(true));
        const newToggleBtn = self.shadowRoot.querySelector('.v-sidebar__toggle-right');
        
        newToggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const currentCollapsed = self.getAttribute('collapsed');
          const newCollapsed = currentCollapsed === 'true' || currentCollapsed === '' ? 'false' : 'true';
          
          // 执行动画
          const sidebar = self.shadowRoot.querySelector('.v-sidebar');
          const isCollapsing = newCollapsed === 'true';
          
          if (isCollapsing) {
            // 折叠动画
            sidebar.classList.add('collapsing');
            
            // 先收起所有已展开的子菜单
            const expandedSubmenus = self.shadowRoot.querySelectorAll('.v-sidebar-submenu.expanded');
            expandedSubmenus.forEach((submenu, i) => {
              setTimeout(() => {
                submenu.classList.remove('expanded');
                submenu.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
                void submenu.offsetHeight;
                submenu.style.maxHeight = '0';
                submenu.style.opacity = '0';
                
                setTimeout(() => {
                  submenu.style.display = 'none';
                }, 300);
              }, i * 60);
            });
            
            // 然后改变宽度和隐藏其他元素
            setTimeout(() => {
              sidebar.style.width = '64px';
              
              setTimeout(() => {
                sidebar.classList.remove('collapsing');
                sidebar.classList.add('collapsed');
                self.setAttribute('collapsed', 'true');
                
                // 更新按钮图标
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                  icon.className = 'fa fa-angle-double-right';
                  toggleBtn.title = '展开菜单';
                }
              }, 200);
            }, expandedSubmenus.length * 60 + 120);
          } else {
            // 展开动画
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('expanding');
            
            // 先改变宽度
            const width = self.getAttribute('width') || '240px';
            sidebar.style.width = width;
            
            // 然后显示内容
            setTimeout(() => {
              const texts = self.shadowRoot.querySelectorAll('.v-sidebar-item__text');
              const arrows = self.shadowRoot.querySelectorAll('.v-sidebar-item__arrow');
              
              // 逐个显示文本和箭头
              texts.forEach((text, i) => {
                setTimeout(() => {
                  text.classList.add('visible');
                }, i * 40);
              });
              
              arrows.forEach((arrow, i) => {
                setTimeout(() => {
                  arrow.classList.add('visible');
                }, i * 40 + 60);
              });
              
              // 显示之前已展开的子菜单
              setTimeout(() => {
                const expandedSubmenus = self.shadowRoot.querySelectorAll('.v-sidebar-submenu[data-was-expanded="true"]');
                expandedSubmenus.forEach((menu, i) => {
                  setTimeout(() => {
                    menu.style.display = 'block';
                    menu.classList.add('expanded');
                    menu.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
                    menu.style.maxHeight = '0';
                    void menu.offsetHeight;
                    menu.style.maxHeight = menu.scrollHeight + 'px';
                    menu.style.opacity = '1';
                    
                    // 逐个显示子菜单项
                    const items = menu.querySelectorAll('.v-sidebar-subitem');
                    items.forEach((item, j) => {
                      setTimeout(() => {
                        item.classList.remove('hiding');
                        item.classList.add('visible');
                      }, j * 40);
                    });
                    
                    setTimeout(() => {
                      menu.style.maxHeight = '';
                    }, 350);
                  }, i * 120);
                });
                
                setTimeout(() => {
                  sidebar.classList.remove('expanding');
                  self.setAttribute('collapsed', 'false');
                  
                  // 更新按钮图标
                  const icon = toggleBtn.querySelector('i');
                  if (icon) {
                    icon.className = 'fa fa-angle-double-left';
                    toggleBtn.title = '收起菜单';
                  }
                }, expandedSubmenus.length * 120 + 250);
              }, 150);
            }, 200);
          }
          
          // 触发自定义事件
          setTimeout(() => {
            self.dispatchEvent(new CustomEvent('v-sidebar-toggle', {
              detail: { collapsed: isCollapsing },
              bubbles: true
            }));
          }, 350);
        });
      }
    };

    // 注册侧边菜单栏组件
    window.VemosUI.registerComponent('v-sidebar', {
      props: ['items', 'width', 'collapsed', 'toggleable'],
      template(props) {
        const { 
          items = '[]', 
          width = '240px', 
          collapsed = false,
          toggleable = true
        } = props;
        
        let itemsArray = [];
        try {
          itemsArray = JSON.parse(items);
        } catch (e) {
          console.error('v-sidebar: items属性必须是有效的JSON字符串');
          itemsArray = [];
        }
        
        const isCollapsed = collapsed === '' || collapsed === 'true';
        const isToggleable = toggleable === '' || toggleable === 'true';
        
        // 处理图标
        const renderIcon = (icon, isSubItem = false) => {
          if (!icon) return '';
          
          if (icon.includes('fa-')) {
            const iconClass = isSubItem ? 'v-sidebar-subitem__icon fa' : 'v-sidebar-item__icon fa';
            return '<i class="' + iconClass + ' ' + icon + '"></i>';
          } else {
            const iconClass = isSubItem ? 'v-sidebar-subitem__icon' : 'v-sidebar-item__icon';
            return '<i class="' + iconClass + '">' + icon + '</i>';
          }
        };
        
        let menuHtml = '';
        itemsArray.forEach((item, index) => {
          const activeClass = item.active ? ' v-sidebar-item--active' : '';
          const hasChildren = item.children && item.children.length > 0;
          
          // 构建菜单项HTML
          let itemHtml = '<div class="v-sidebar-item' + activeClass + '" data-index="' + index + '" data-has-children="' + !!hasChildren + '">';
          itemHtml += '<div class="v-sidebar-item__content" title="' + (isCollapsed ? item.text : '') + '">';
          itemHtml += renderIcon(item.icon);
          
          // 文本
          const textVisibleClass = isCollapsed ? '' : ' visible';
          itemHtml += '<span class="v-sidebar-item__text' + textVisibleClass + '">' + item.text + '</span>';
          
          // 箭头
          if (hasChildren && !isCollapsed) {
            const arrowVisibleClass = isCollapsed ? '' : ' visible';
            const arrowExpandedClass = item.expanded ? ' expanded' : '';
            itemHtml += '<i class="v-sidebar-item__arrow fa fa-angle-down' + arrowVisibleClass + arrowExpandedClass + '"></i>';
          }
          
          itemHtml += '</div>';
          
          // 子菜单
          if (hasChildren) {
            const displayStyle = (!isCollapsed && item.expanded) ? 'block' : 'none';
            const expandedClass = item.expanded ? ' expanded' : '';
            const wasExpandedAttr = item.expanded ? ' data-was-expanded="true"' : '';
            
            itemHtml += '<div class="v-sidebar-submenu' + expandedClass + '" style="display: ' + displayStyle + ';"' + wasExpandedAttr + '>';
            
            item.children.forEach((subItem, subIndex) => {
              const subItemVisibleClass = isCollapsed ? ' hiding' : (item.expanded ? ' visible' : ' hiding');
              itemHtml += '<div class="v-sidebar-subitem' + subItemVisibleClass + '" data-parent-index="' + index + '" data-index="' + subIndex + '" title="' + subItem.text + '">';
              itemHtml += renderIcon(subItem.icon, true);
              itemHtml += '<span class="v-sidebar-subitem__text">' + subItem.text + '</span>';
              itemHtml += '</div>';
            });
            
            itemHtml += '</div>';
          }
          
          itemHtml += '</div>';
          menuHtml += itemHtml;
        });
        
        // 生成右侧折叠按钮
        let toggleButtonHtml = '';
        if (isToggleable) {
          const iconClass = isCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left';
          const titleText = isCollapsed ? '展开菜单' : '收起菜单';
          toggleButtonHtml = '<div class="v-sidebar__toggle-right" title="' + titleText + '"><i class="fa ' + iconClass + '"></i></div>';
        }
        
        const sidebarClass = isCollapsed ? 'v-sidebar collapsed' : 'v-sidebar';
        const sidebarWidth = isCollapsed ? '64px' : width;
        
        return '<div class="v-sidebar-wrapper"><aside class="' + sidebarClass + '" style="width: ' + sidebarWidth + ';"><div class="v-sidebar__menu">' + menuHtml + '</div></aside>' + toggleButtonHtml + '</div>';
      },
      styles: `/* 引入FontAwesome图标字体 */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.v-sidebar-wrapper {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 100vh;
}

.v-sidebar {
  height: 100%;
  min-height: 100vh;
  background-color: var(--vemos-bg-default, #fff);
  color: var(--vemos-text-default, #333);
  box-shadow: 2px 0 6px rgba(0,21,41,.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  overflow-x: hidden;
  position: relative;
  z-index: 1;
}

.v-sidebar.collapsed {
  width: 64px !important;
}

.v-sidebar.collapsing {
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.v-sidebar.expanding {
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* 暗黑模式下侧边栏的样式 */
[data-theme="dark"] .v-sidebar {
  background-color: var(--vemos-bg-default, #2d3748);
  color: var(--vemos-text-default, #e2e8f0);
}

.v-sidebar__menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 0;
}

.v-sidebar__toggle-right {
  position: absolute;
  right: -15px;
  top: 20px;
  width: 30px;
  height: 30px;
  background-color: var(--vemos-bg-default, #fff);
  color: var(--vemos-text-secondary, #606266);
  border: 1px solid var(--vemos-border-default, #e6e6e6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 2;
}

.v-sidebar__toggle-right:hover {
  background-color: var(--vemos-bg-primary, #409eff);
  color: var(--vemos-text-primary, #fff);
  border-color: var(--vemos-border-primary, #409eff);
  transform: scale(1.1);
}

.v-sidebar__toggle-right i {
  font-size: 14px;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.v-sidebar.collapsed .v-sidebar__toggle-right i {
  transform: rotate(180deg);
}

/* 暗黑模式下的按钮样式 */
[data-theme="dark"] .v-sidebar__toggle-right {
  background-color: var(--vemos-bg-default, #2d3748);
  color: var(--vemos-text-default, #e2e8f0);
  border-color: var(--vemos-border-default, #4b5563);
}

[data-theme="dark"] .v-sidebar__toggle-right:hover {
  background-color: var(--vemos-bg-primary, #3b82f6);
  color: var(--vemos-text-primary, #ffffff);
  border-color: var(--vemos-border-primary, #3b82f6);
}

.v-sidebar-item {
  padding: 0;
  overflow: hidden;
  margin-bottom: 4px;
}

.v-sidebar-item__content {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  white-space: nowrap;
  border-radius: 6px;
  margin: 0 8px;
}

.v-sidebar.collapsed .v-sidebar-item__content {
  padding: 0;
  justify-content: center;
  margin: 0 8px;
}

// 添加专门针对折叠状态下箭头图标的样式
.v-sidebar.collapsed .v-sidebar-item__arrow {
  display: none !important;
  opacity: 0 !important;
  transform: translateX(10px) !important;
  width: 0 !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

// 确保在折叠状态下，即使有子菜单的项目也不会显示箭头
.v-sidebar.collapsed .v-sidebar-item[data-has-children="true"] .v-sidebar-item__arrow {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

// 修复折叠状态下内容的居中对齐
.v-sidebar.collapsed .v-sidebar-item__content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0 8px;
}

// 确保图标在折叠状态下居中显示
.v-sidebar.collapsed .v-sidebar-item__icon {
  margin-right: 0;
  width: 100%;
  justify-content: center;
  flex-shrink: 0;
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
  margin-right: 12px;
  text-align: center;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  flex-shrink: 0;
  transition: margin 0.3s ease;
}

.v-sidebar.collapsed .v-sidebar-item__icon {
  margin-right: 0;
  width: 100%;
  justify-content: center;
}

.v-sidebar-item__icon.fa {
  font-size: 18px;
}

.v-sidebar-item__text {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
}

.v-sidebar-item__text.visible {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.1s;
}

.v-sidebar.collapsed .v-sidebar-item__text {
  opacity: 0;
  transform: translateX(-10px);
}

.v-sidebar-item__arrow {
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(10px);
}

.v-sidebar-item__arrow.visible {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.15s;
}

.v-sidebar-item__arrow.fa {
  font-size: 14px;
}

.v-sidebar-item__arrow.expanded {
  transform: rotate(180deg) !important;
}

.v-sidebar.collapsed .v-sidebar-item__arrow {
  opacity: 0;
  transform: translateX(10px);
}

/* 子菜单基础样式 */
.v-sidebar-submenu {
  padding-left: 12px;
  overflow: hidden;
  transform-origin: top center;
  /* 移除固定的transition，让JS控制 */
}

/* 重要：确保折叠状态下子菜单隐藏 */
.v-sidebar.collapsed .v-sidebar-submenu {
  max-height: 0 !important;
  opacity: 0 !important;
}

.v-sidebar-subitem {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 16px 0 44px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;
  border-radius: 6px;
  margin: 2px 8px;
  opacity: 1;
  transform: none;
}

.v-sidebar-subitem.visible {
  opacity: 1;
  transform: none;
}

.v-sidebar-subitem.hiding {
  opacity: 0;
  transform: translateY(-8px);
}

.v-sidebar-subitem:hover {
  background-color: var(--vemos-bg-tertiary, #ecf5ff);
  color: var(--vemos-text-primary, #409eff);
  transform: translateX(6px) scale(1.03);
  transition: all 0.25s ease;
}

/* 修复：折叠状态下子菜单项图标居中 */
.v-sidebar.collapsed .v-sidebar-subitem {
  opacity: 0;
  height: 0;
  padding: 0;
  margin: 0;
  justify-content: center;
  max-height: 0;
}

.v-sidebar.collapsed .v-sidebar-subitem__icon {
  margin-right: 0;
  width: 100%;
  justify-content: center;
}

.v-sidebar-subitem__icon {
  width: 20px;
  margin-right: 8px;
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: margin 0.3s ease;
}

.v-sidebar-subitem__icon.fa {
  font-size: 14px;
}

.v-sidebar-subitem__text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s ease;
}

.v-sidebar.collapsed .v-sidebar-subitem__text {
  opacity: 0;
}

/* 折叠状态下的工具提示效果 */
.v-sidebar.collapsed .v-sidebar-item__content:hover::after,
.v-sidebar.collapsed .v-sidebar-item__content:hover::before {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--vemos-bg-default, #fff);
  color: var(--vemos-text-default, #333);
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,.1);
  white-space: nowrap;
  z-index: 1000;
  font-size: 14px;
  margin-left: 8px;
  font-weight: 500;
}

.v-sidebar.collapsed .v-sidebar-item__content:hover::before {
  content: '';
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid var(--vemos-bg-default, #fff);
  background: transparent;
  box-shadow: none;
  left: 100%;
  margin-left: 2px;
}

[data-theme="dark"] .v-sidebar.collapsed .v-sidebar-item__content:hover::after {
  background-color: var(--vemos-bg-default, #2d3748);
  color: var(--vemos-text-default, #e2e8f0);
}

[data-theme="dark"] .v-sidebar.collapsed .v-sidebar-item__content:hover::before {
  border-right-color: var(--vemos-bg-default, #2d3748);
}`,
      mounted() {
        bindEvents(this);
      },
      updated(attrName) {
        // 当collapsed属性变化时，需要重新绑定事件
        if (attrName === 'items' || attrName === 'collapsed') {
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