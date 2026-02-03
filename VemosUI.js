// loader.js 修改版本
(function() {
  'use strict';
  
  // 确保 main.js 首先加载
  const components = [
    './main.js',  // 必须先加载
    './components/button.js',
    './components/card.js', 
    './components/table.js',
    './components/code-display.js',
    './components/navbar.js',
    './components/sidebar.js',
    './components/content-panel.js',
    './components/input.js',
    './components/switch.js',
    './components/grid.js',
    './components/new-grid.js',
    './components/alert.js'
  ];
  
  /**
   * 动态加载JS文件 - 串行加载确保顺序
   * @param {string} url - JS文件路径
   * @returns {Promise}
   */
  async function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = false;
      script.onload = () => {
        console.log(`✅ 已加载: ${url}`);
        resolve(url);
      };
      script.onerror = () => {
        console.error(`❌ 加载失败: ${url}`);
        reject(new Error(`Failed to load script: ${url}`));
      };
      document.head.appendChild(script);
    });
  }
  
  /**
   * 批量加载组件 - 串行加载确保依赖顺序
   */
  async function loadComponents() {
    const startTime = performance.now();
    console.log('开始加载组件...');
    
    try {
      // 串行加载，确保main.js先加载
      for (const component of components) {
        await loadScript(component);
      }
      
      const loadTime = (performance.now() - startTime).toFixed(2);
      console.log(`🎉 所有组件加载完成，耗时 ${loadTime}ms`);
      
      // 初始化VemosUI（如果还没有初始化）
      if (window.VemosUI) {
        console.log('VemosUI已初始化');
      } else {
        console.warn('VemosUI未找到，尝试手动初始化');
        // 如果main.js已经加载但VemosUI还没初始化，手动触发
        if (typeof VemosUI === 'function') {
          window.VemosUI = new VemosUI();
          console.log('VemosUI手动初始化完成');
        }
      }
      
      // 触发自定义事件
      document.dispatchEvent(new CustomEvent('components-loaded', {
        detail: {
          count: components.length,
          loadTime: loadTime,
          vemosUI: !!window.VemosUI
        }
      }));
      
    } catch (error) {
      console.error('组件加载失败:', error);
      
      document.dispatchEvent(new CustomEvent('components-load-error', {
        detail: { error }
      }));
    }
  }
  
  // 提供全局配置
  window.ComponentLoader = {
    load: loadComponents,
    addComponent: function(url) {
      if (!components.includes(url)) {
        components.push(url);
      }
    },
    getComponents: function() {
      return [...components];
    },
    reload: function() {
      components.forEach(url => {
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) {
          existing.remove();
        }
      });
      return loadComponents();
    }
  };
  
  // 自动加载
  if (window.autoLoadComponents !== false) {
    console.log('开始自动加载组件...');
    // 等DOM加载完成后开始加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
      loadComponents();
    }
  }
  
})();