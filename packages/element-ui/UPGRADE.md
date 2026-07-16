# 升级说明

## cg.6 → cg.8

### 新增能力（纯增量，无破坏性移除）

- 组件能力注册表与统一入口 `registerComponent()`：一次注册即被运行时、设计器、预览、值绑定共同识别。
- 公共运行时导出：`componentDefinitions`、`getComponentDefinition`、`listComponentDefinitions`、`readComponentValue` / `resolveComponentProps` / `bindRuleValue` / `bindRuleTreeValues` / `applyComponentValue`、`componentCodec`、`FcComponentPreview`，以及 `FcDesigner.componentRuntime`。
- 完整 TypeScript 类型与 [COMPONENT-RUNTIME.md](./COMPONENT-RUNTIME.md) 契约文档。
- `fcDataTable` 行操作增强：二次确认、异步 loading、去重提交、成功/失败提示，新增 `actionSuccess` / `actionError` / `actionFinally` 事件与 `executeAction` / `isActionLoading` / `getSelectedRows` 方法；`clickFn(row, index, action, context)` 可访问 `api` / `tableRef` / `selectedRows`。

### 需注意的行为变更（三处）

1. **HTML 组件设计态默认转义显示**：存量 `html` 规则无 `htmlPreview` 字段时，设计器画布改为显示转义源码（不再实时渲染，且内部 `<style>` 不再注入设计器页面）。需在画布实时渲染的规则，配置面板打开“在设计器中渲染 HTML”开关（`htmlPreview: true`）。运行态与表单预览始终渲染真实 HTML，不受影响。
2. **`fcChart` 空数据显示空态**：组件本体无数据时显示“暂无数据”，不再伪造演示数据。示例数据仅由设计器拖拽规则提供。
3. **`fcDataTable` 变为输入型组件（`input: true`）**：现通过 `field` + `value` / `modelValue` 进入表单模型；存量 `props.data` 仍作为公开 fallback 有效。

### 值绑定迁移建议

- `fcChart` / `fcCodePreview`：新配置优先用 `value` / `modelValue`，`props.chartData` 保留为兼容兜底。
- `fcDataTable`：新配置优先用 `value` / `modelValue`（数组），`props.data` 保留为兜底。
- 宿主历史业务 JSON（字符串、旧包装对象、自动推断列等）由宿主迁移层转换，组件库不解释。

### 无需改动

- 未使用上述组件的接入方无感知；所有旧导出保持不变。
- `fcDataTable` 行操作旧 `(row, index)` 回调继续有效。
