# CG 组件运行时契约

## 边界

- `@cg-devcenter/form-create.designer` 负责组件实现、设计器配置、运行时注册、值绑定、预览能力和组件 JSON codec。
- 宿主负责页面、权限、路由、业务接口和业务数据编排，不应按 `fcChart`、`fcDataTable` 等类型复制组件内部规则。
- `components.*` 只包含运行时组件和公共契约；设计器规则及设计态预览只进入 `index.*`。
- 组件继续使用 form-create 的标准注入能力，例如 `formCreateInject.api.fetch`，不依赖 PMT LowCode API。

## 公共能力

```js
import FcDesigner, {
    FcComponentPreview,
    applyComponentValue,
    bindRuleTreeValues,
    componentCodec,
    getComponentDefinition,
    listComponentDefinitions,
    registerComponent,
    resolveComponentProps,
} from '@cg-devcenter/form-create.designer';

const definition = getComponentDefinition(rule.type);
const previewable = definition?.capabilities.preview;
const props = resolveComponentProps(rule, row[rule.field]);

// 在渲染前将业务数据绑定到规则树；原规则不会被修改。
const renderedRules = bindRuleTreeValues(rules, formData);

// 已有 form-create api 时可直接更新组件值。
applyComponentValue(api, rule, value);

// 函数配置使用 form-create 原生格式往返，不需要宿主自建函数 codec。
const json = componentCodec.serialize(rules, 2);
const parsed = componentCodec.deserialize(json);
```

第三方 FC 组件需要进入能力发现、通用预览和值绑定时，启动阶段使用统一入口注册：

```js
registerComponent({
    type: 'fcMetric',
    category: 'display',
    component: FcMetric,
    designerComponent: FcMetricDesignerPreview,
    binding: {kind: 'modelValue'},
    capabilities: {input: true, preview: true, tableCell: true},
    dragRule: {
        name: 'fcMetric', label: '指标', icon: 'icon-number', menu: 'main',
        rule: () => ({type: 'fcMetric', field: 'metric', title: '指标'}),
        props: () => [],
    },
});
```

- 必须在应用挂载和设计器创建前注册。
- 完全相同的重复注册是幂等的；修改已有定义必须传 `{override: true}`。
- 拖拽规则必须提供与组件 type 一致的 `name`，以及 `label`、`icon`、`rule()`、`props()`；替换时省略第三方拖拽规则或设计态组件会移除对应旧注册。
- `FcDesigner.component()` 只保留“挂载渲染组件”的历史语义，不会让组件进入能力注册表。
- overlay 只允许 `dialog`、`drawer`，并继续遵守 form-create 的 `children` 容器语义；任意第三方弹层协议不由本库猜测。

如果宿主协议会把以 `function` 开头的内容当作普通脚本正文字符串，使用
marker-only 解析，避免被 form-create 的兼容逻辑误还原为函数：

```js
const parsed = componentCodec.deserialize(json, {parsePlainFunctions: false});
```

该模式仍会正常还原 form-create marker、`$FN` 和 `$FNX`。

`FcComponentPreview` 根据组件清单渲染真实组件。`mode="tableCell"` 时只渲染声明了
`tableCell` 能力的组件，其他类型通过 `fallback` 插槽交给宿主做普通文本兜底。
依赖 form-create 注入或子规则上下文的组件不会声明通用直渲预览能力，也同样进入 `fallback`；其设计态展示仍由 designer 自己的预览组件负责。

## 值绑定契约

- 常规输入组件使用 `modelValue`。
- `fcChart` 优先使用 `modelValue`，为空时回退 `props.chartData`。
- `fcCodePreview` 优先使用 `modelValue`，为空时回退 `props.chartData`。
- `fcDataTable` 在 `modelValue` 为数组时优先使用它，否则回退 `props.data`。
- 容器和布局组件使用 `children`，不伪装成数据字段。

`fcChart` 的示例数据只由设计器拖拽规则提供；组件本体没有数据时显示空态，不会在运行时伪造样例。

上述是组件公开输入兼容，不代表宿主历史业务 JSON（例如 JSON 字符串、旧包装对象、自动推断列）由组件库解释。
这类旧数据应由宿主在自身迁移层转换为当前契约；组件库不耦合任一 LowCode 存储协议。

## HTML 设计态隔离

原生 `html` 规则提供 `htmlPreview` 开关：

- `false` 或未配置：设计器画布显示转义后的源码，HTML 内的 `<style>` 不会注入设计器页面。
- `true`：设计器画布直接渲染 HTML。

该开关只控制可编辑的设计器画布。表单预览和最终运行态始终渲染真实 HTML，宿主不需要覆盖
form-create 的 HTML parser。

## fcDataTable 行操作

`actions` 的历史字段保持不变，并增加以下可选字段：

```js
{
    id: 'disable',
    label: '停用',
    confirm: true, // 也可以是确认文案或 ElMessageBox 配置对象
    successMessage: '操作成功',
    errorMessage: '操作失败',
    async clickFn(row, index, action, context) {
        await save(row);
        console.log(context.api, context.tableRef, context.selectedRows);
    },
}
```

- 旧回调 `(row, index)` 继续有效；新增参数是 `action` 和 `context`。
- `context` 提供 `table`、`tableRef`、`api`、`emit`、`selectedRows`。
- 同一行同一 action 异步执行时独立 loading 并阻止重复提交。
- `actionClick` 保持点击即触发；确认并执行后依次触发 `actionSuccess` 或 `actionError`，最后触发 `actionFinally`。
- 对外方法 `executeAction(actionOrId, row, index)` 与按钮点击共用流程；同时提供 `isActionLoading` 和 `getSelectedRows`。
- `index` 是当前表格展示数据中的索引。需要跨分页稳定识别记录时应配置 `rowKey`。
- 行操作和列配置弹窗都使用本地草稿，取消不写回；确定后才更新规则，并保留未知扩展字段（包括过滤器内的扩展配置）。行操作校验 ID、名称及 ID 唯一性，列配置校验标题必填。

独立示例位于 `examples/defaultShowcase.js`。浏览器回归入口为
`/?runtime-verification`，覆盖旧同步回调、异步 loading、二次确认、事件生命周期，以及行操作设计器的确定/取消。
