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
- `fcCodePreview` 支持 `yaml` 语言模式和 YAML 格式化，可作为 YAML 源码视图的轻量代码编辑器。
- `fcYamlTreeEditor` 以 YAML 字符串作为 `modelValue`，为空时回退 `props.yaml`；支持 `viewMode: 'tree' | 'source' | 'split'`。
  树形编辑结果会规范化为单文档的 Map、List 和 Scalar YAML，不保留注释、锚点、别名和原始排版；源码模式可作为完整 YAML 语法的逃生通道，应用源码时仍会先校验再同步到树。
- `fcYamlTreeEditor` 的 `schema` 支持 JSON Schema 的常用子集：`type`、`properties`、`items`、`required`、`enum`、`const`、`additionalProperties`、长度/数值范围；不传 schema 时保持自由 Map/List/Scalar 编辑。
- 设计器规则支持静态、接口和全局数据源，动态数据会写入 `props.yaml`；组件能力清单声明了 `remoteData`。
- `fcDataTable` 在 `modelValue` 为数组时优先使用它，否则回退 `props.data`。
- 容器和布局组件使用 `children`，不伪装成数据字段。

## YAML 结构化编辑与源码编辑

`fcYamlTreeEditor` 和 `fcCodePreview` 面向同一份 YAML 时建议分工使用：树编辑器负责字段结构、类型和 Schema 约束，CodePreview 负责完整 YAML 语法、注释和暂未被树编辑器建模的内容。专用示例位于 `examples/YamlTreeEditorDemo.vue`，浏览器入口为 `/?yaml-tree-editor`。

`FcCodePreview` 和 `FcYamlTreeEditor` 已作为包的 named exports。下面是 Vue 3 `<script setup>` 的直用方式；如果通过 form-create 规则渲染，则只需配置对应的组件规则即可。

一个安全的同步方式是让源码和树各自持有草稿，点击按钮后再把源码应用到树：

```vue
<script setup>
import {ref} from 'vue';
import {FcCodePreview, FcYamlTreeEditor} from '@cg-devcenter/form-create.designer';

const yamlValue = ref('service:\n  name: pmt\n');
const sourceYaml = ref(yamlValue.value);
const error = ref('');
const schema = {type: 'object', required: ['service']};
</script>

<template>
    <FcYamlTreeEditor
        v-model="yamlValue"
        view-mode="split"
        :schema="schema"
        @parse-error="error = $event"
        @validation-error="error = $event"
    />
    <FcCodePreview
        v-model="sourceYaml"
        language="yaml"
        :editable="true"
        :formattable="true"
    />
    <button @click="yamlValue = sourceYaml">应用源码到树</button>
    <button @click="sourceYaml = yamlValue">同步树结果到源码</button>
</template>
```

`fcYamlTreeEditor` 的主要属性和事件：

| 属性/事件 | 说明 |
| --- | --- |
| `modelValue` | 优先级最高的 YAML 字符串；也接受对象或数组并转换为 YAML。 |
| `yaml` | 没有 `modelValue` 时使用的回退数据，设计器规则会写入这里。 |
| `viewMode` | `tree` 树形、`source` 源码、`split` 分栏。 |
| `schema` | JSON Schema 对象或 JSON 字符串，限制节点类型、字段和取值。 |
| `indent` / `readonly` / `disabled` | 控制输出缩进和编辑状态。 |
| `change` | 树编辑成功后返回规范化 YAML 字符串。 |
| `parse-error` | 源码不是单文档或包含暂不支持的 YAML 结构时触发。 |
| `validation-error` | 树内容不满足基础校验或 Schema 时触发。 |
| `node-change` | 返回 `{action, nodeId, yaml}`，可用于审计或联动。 |

组件实例还提供 `getYaml()`、`setYaml(value)`、`applySource()` 和 `validate()` 方法。

Schema 目前支持 JSON Schema 的常用子集：`type`（object、array、string、number、integer、boolean、null）、`properties`、`items`、`required`、`additionalProperties`、`enum`、`const`、`minLength`、`maxLength`、`pattern`、`minimum`、`maximum`、`minItems`、`maxItems`、`minProperties` 和 `maxProperties`。不传 Schema 时，组件保持自由的 Map/List/Scalar 编辑；不支持 `oneOf`、`allOf`、`$ref` 等完整 JSON Schema 组合能力。

树模式会将内容规范化为单文档 YAML，不保留注释、原始排版、锚点和别名。源码模式可以继续编辑完整 YAML，但应用回树时会再次执行单文档和树模型校验。

设计器中的数据来源配置如下：静态内容写入 `props.yaml`，接口数据通过 `formCreateEffect>fetch` 写入 `props.yaml`，全局数据通过 `formCreateEffect>globalData` 写入 `props.yaml`。因此同一组件既可以由低代码配置初始结构，也可以由运行时接口加载 YAML。

`fcCodePreview` 使用 `language="yaml"` 开启 YAML 高亮，`formattable` 开启 YAML 解析和格式化；它不执行 Schema 校验，适合作为 YAML 树编辑器的自由源码补充。

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
