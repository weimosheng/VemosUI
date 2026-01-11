# VemosUI

VemosUI 是一个轻量级的前端UI框架，基于Web Components技术构建，提供了一系列常用的UI组件。

## 特性

- **轻量级**: 体积小巧，无依赖
- **组件化**: 提供丰富的UI组件
- **易于使用**: 简单的API设计
- **可定制**: 支持主题定制
- **跨框架**: 可在任何框架中使用

## 安装

直接下载源码并在HTML中引用即可使用。

## 快速开始

```html
<!DOCTYPE html>
<html>
<head>
  <script src="VemosUI.js"></script>
  <script src="components/button.js"></script>
</head>
<body>
  <v-button type="primary">Hello VemosUI</v-button>
</body>
</html>
```

## 内置组件

### v-button 按钮组件

按钮组件用于触发相应的操作。

#### 基本用法

```html
<v-button type="primary">主要按钮</v-button>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 按钮类型 | String | default/primary/success/warning/danger | default |
| size | 按钮尺寸 | String | small/medium/large | medium |
| disabled | 是否禁用 | Boolean | true/false | false |
| theme | 按钮主题颜色 | String | default/primary/success/warning/danger/info/dark/light | default |

#### 动画效果

- 悬停时有轻微上移动画
- 点击时有波纹效果
- 初始渲染时有淡入动画

### v-table 表格组件

表格组件用于展示结构化的数据。

#### 基本用法

```html
<v-table 
  data='[{"id": 1, "name": "张三", "age": 28}]'
  columns='[{"prop": "id", "title": "ID"}, {"prop": "name", "title": "姓名"}, {"prop": "age", "title": "年龄"}]'
></v-table>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 表格数据 | Array | - | [] |
| columns | 表格列配置 | Array | - | [] |
| border | 是否带有边框 | Boolean | true/false | false |
| stripe | 是否为斑马纹表格 | Boolean | true/false | false |
| size | 表格尺寸 | String | small/medium/large | medium |
| theme | 表格主题 | String | default/primary/success/warning/danger/info | default |

#### 列配置属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| prop | 对应列内容的字段名 | String | - | - |
| title | 对应列的标题 | String | - | - |
| width | 对应列的宽度 | String | - | auto |
| formatter | 用来格式化显示内容的函数 | Function | - | - |

### v-card 卡片组件

卡片组件用于内容的展示和组织。

#### 基本用法

```html
<v-card title="卡片标题">
  这是卡片内容
</v-card>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| title | 卡片标题 | String | - | - |
| header | 卡片头部 | String | - | - |
| theme | 卡片主题颜色 | String | default/primary/success/warning/danger/info/dark/light | default |

#### 动画效果

- 悬停时有轻微上移和阴影加深动画
- 初始渲染时有淡入动画

### v-input 输入框组件

输入框组件用于接收用户的输入。

#### 基本用法

```html
<v-input placeholder="请输入内容" value=""></v-input>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 输入框类型 | String | text/password/number等 | text |
| value | 输入框的值 | String | - | '' |
| placeholder | 占位符 | String | - | '' |
| disabled | 是否禁用 | Boolean | true/false | false |
| readonly | 是否只读 | Boolean | true/false | false |
| name | 输入框名称 | String | - | - |

#### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| v-input-change | 值改变时触发 | 新值 |
| v-input-focus | 获得焦点时触发 | - |
| v-input-blur | 失去焦点时触发 | - |

#### 动画效果

- 聚焦时有颜色变化和阴影动画
- 初始渲染时有淡入动画

### v-switch 开关组件

开关组件用于在两种状态之间切换。

#### 基本用法

```html
<v-switch checked="false"></v-switch>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| checked | 是否选中 | Boolean | true/false | false |
| disabled | 是否禁用 | Boolean | true/false | false |
| active-value | 打开时的值 | Any | - | true |
| inactive-value | 关闭时的值 | Any | - | false |
| active-text | 激活时显示的文本 | String | - | - |
| inactive-text | 未激活时显示的文本 | String | - | - |
| active-color | 激活时的背景色 | String | - | #409eff |
| inactive-color | 未激活时的背景色 | String | - | #dcdfe6 |

#### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| v-switch-change | 状态改变时触发 | 新值 |

#### 动画效果

- 切换时滑块有平滑移动动画
- 悬停时有阴影效果
- 初始渲染时有淡入动画

### v-navbar 导航栏组件

导航栏组件通常用于页面顶部的导航。

#### 基本用法

```html
<v-navbar title="我的网站">
  <v-button slot="left" type="primary">菜单</v-button>
  <v-button slot="right" type="default">登录</v-button>
</v-navbar>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| title | 导航栏标题 | String | - | 'VemosUI' |
| fixed | 是否固定在顶部 | Boolean | true/false | false |
| theme | 主题颜色 | String | default/primary/success/warning/danger/info/dark/light | default |

#### 插槽

| 名称 | 说明 |
|------|------|
| left | 左侧内容插槽 |
| right | 右侧内容插槽 |

### v-sidebar 侧边栏组件

侧边栏组件用于提供页面导航。

#### 基本用法

```html
<v-sidebar 
  width="250px"
  items='[{"text": "首页", "icon": "🏠", "route": "/home"}, {"text": "关于", "icon": "ℹ️", "route": "/about"}]'
>
  <div slot="header">我的应用</div>
</v-sidebar>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| items | 菜单项数组 | Array | - | [] |
| width | 侧边栏宽度 | String | - | '240px' |
| collapsed | 是否收起 | Boolean | true/false | false |

#### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| v-sidebar-item-click | 点击菜单项时触发 | { index: 菜单项索引 } |
| v-sidebar-subitem-click | 点击子菜单项时触发 | { parentIndex: 父菜单索引, index: 子菜单索引 } |

#### 插槽

| 名称 | 说明 |
|------|------|
| header | 顶部内容插槽 |
| footer | 底部内容插槽 |

#### items 配置格式

```json
[
  {
    "text": "菜单项文本",
    "icon": "图标",
    "route": "链接地址",
    "children": [  // 可选，子菜单
      {
        "text": "子菜单项文本",
        "icon": "图标",
        "route": "链接地址"
      }
    ]
  }
]
```


### v-code-display 代码展示组件

代码展示组件用于展示代码片段，支持多种编程语言和代码高亮显示。

#### 基本用法

```html
<v-code-display>
function hello() {
  console.log("Hello, VemosUI!");
}
</v-code-display>
```

#### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| code | 要展示的代码内容 | String | - | slot内容 |
| lang | 代码的语言类型 | String | javascript/html/css/python/java等 | javascript |
| showLineNumbers | 是否显示行号 | Boolean | true/false | false |
| copyable | 是否显示复制按钮 | Boolean | true/false | true |

---

## 自定义组件

你可以轻松地创建自己的VemosUI组件：

```javascript
window.VemosUI.registerComponent('my-component', {
  props: ['title'],
  template(props) {
    const { title = '默认标题' } = props;
    return `<div class="my-component"><h3>${title}</h3><slot></slot></div>`;
  },
  styles: `
    .my-component {
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  `
});
```

## 动画效果

VemosUI 提供了一系列内置的动画效果，可以直接使用：

- `vemos-hover-lift`: 悬停时上浮效果
- `vemos-pulse`: 脉冲效果
- `vemos-fade`: 淡入效果
- `vemos-bounce`: 弹跳效果
- `vemos-loading`: 加载动画

## 浏览器支持

现代浏览器及IE11+（需要引入polyfill）

## License

MIT