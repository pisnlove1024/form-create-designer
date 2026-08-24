import {listComponentDefinitions} from '../src/runtime/componentRegistry';

const FN_PREFIX = '[[FORM-CREATE-PREFIX-';
const FN_SUFFIX = '-FORM-CREATE-SUFFIX]]';
const JSONPLACEHOLDER_USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const JSONPLACEHOLDER_TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';

const SHOWCASE_LANGUAGE = {
    'zh-cn': {
        demoTitle: '标题',
        demoTitleText: '员工信息登记表',
        basicTabLabel: '基础输入',
        dataSourceTabLabel: '数据源',
        codeChartTabLabel: '代码图表',
        layoutTabLabel: '展示布局',
        advancedTabLabel: '复杂结构',
        basicAlert: '基础字段统一通过 field + value 进入 formData；校验、联动和 change 事件仍使用 form-create 标准能力。',
        userName: '姓名',
        userNamePlaceholder: '请输入姓名',
        accessCode: '访问口令',
        accessCodePlaceholder: '请输入访问口令',
        age: '年龄',
        completion: '完成度',
        joinDate: '入职日期',
        joinDatePlaceholder: '选择日期',
        projectCycle: '项目周期',
        startDate: '开始',
        endDate: '结束',
        dailyStandup: '每日站会',
        timePlaceholder: '选择时间',
        officeHours: '办公时间',
        startTime: '开始时间',
        endTime: '结束时间',
        themeColor: '主题色',
        isActive: '在职状态',
        performance: '绩效评分',
        notes: '备注',
        notesPlaceholder: '请输入备注信息',
        globalDataAlert: '城市、职业、穿梭框、树、树选择和第二个图表都使用全局数据源，可在表单配置中统一维护；chartChannel 开启了自动更新。',
        remoteDataAlert: '远程用户和远程待办使用公开 REST API，请在网络可用时查看请求结果；失败时组件会保留空数据。',
        city: '城市',
        cityPlaceholder: '请选择城市',
        occupation: '职业',
        skills: '技能标签',
        remoteUser: '远程用户',
        remoteUserPlaceholder: '从远程接口加载用户',
        remoteTodos: '远程待办',
        area: '地区',
        areaPlaceholder: '请选择地区',
        reviewers: '评审人',
        available: '可选',
        selected: '已选',
        permissionTree: '权限树',
        department: '部门',
        departmentPlaceholder: '请选择部门',
        lineChart: '月度业绩趋势',
        lineChartName: '月度业绩趋势',
        lineChartDesc: '静态数据源，开启平滑曲线和自定义命名的平均线。',
        lineChartAverage: '月度均值',
        emptyChart: '图表空态',
        emptyChartDesc: '组件本体没有数据时显示空态，不会伪造设计器示例数据。',
        channelChart: '线索来源占比',
        channelChartName: '线索来源占比',
        channelChartDesc: '全局数据源驱动的饼图。',
        fullOptionChart: '完整 ECharts 配置',
        fullOptionChartName: '收入与成本对比',
        fullOptionChartDesc: '直接传入完整 ECharts option（dataset、坐标轴、tooltip 与混合 bar/line 系列），组件原样透传渲染。',
        codePreview: '配置示例',
        codePreviewName: 'JSON 配置片段',
        codePreviewDesc: '展示全局数据、全局方法和语言配置的组合方式。',
        remoteUserCode: '远程用户 JSON',
        remoteUserCodeName: '远程接口响应',
        remoteUserCodeDesc: '组件级 fetch 请求远程用户详情，并把响应写入代码展示。',
        liveScript: '可编辑脚本',
        liveScriptName: 'JavaScript 在线编辑',
        liveScriptDesc: '绑定 modelValue，编辑时触发 change 并更新展示内容。',
        yamlTreeEditor: 'YAML 树编辑器',
        yamlTreeEditorName: 'YAML 服务配置',
        yamlTreeEditorDesc: '树形编辑器适合受 Schema 约束的结构化修改，源码面板保留完整 YAML 编辑能力。',
        codeBestPractice: '数据、事件、文案都放在可配置入口',
        summaryCard: '展示组件组合',
        summaryText: '文字组件用于静态说明；HTML 组件用于富文本片段；按钮可绑定全局方法。',
        htmlSourceTitle: 'HTML 设计态源码隔离',
        htmlRenderTitle: 'HTML 设计态真实渲染',
        statusDivider: '状态',
        bestPracticeTag: '最佳实践',
        logButton: '记录表单日志',
        refreshButton: '触发刷新事件',
        collapseProfile: '档案信息',
        profileAlias: '档案别名',
        profileAliasPlaceholder: '请输入档案别名',
        collapseAudit: '审核信息',
        auditNotes: '审核备注',
        projects: '项目经历',
        projectName: '项目名称',
        projectRole: '角色',
        duration: '时间',
        members: '成员列表',
        memberIndex: '第{index}位成员',
        memberName: '成员姓名',
        memberNamePlaceholder: '请输入成员姓名',
        memberRole: '成员角色',
        approval: '审批信息',
        approvalOwner: '审批人',
        approvalOwnerPlaceholder: '请输入审批人',
        needAudit: '需要审核',
        richText: '富文本',
        attachments: '附件上传',
        signature: '电子签名',
        dialogDrawerTab: '弹窗抽屉',
        dialogTitle: '弹窗容器示例',
        dialogAlert: '弹窗和抽屉支持静态开关和全局数据绑定两种控制方式。点击按钮可打开对应的弹窗或抽屉。',
        openDialogBtn: '打开弹窗',
        openDrawerBtn: '打开抽屉',
        closeDialogBtn: '关闭弹窗',
        closeDrawerBtn: '收起抽屉',
        dialogContent: '这是弹窗内的表单内容',
        dialogField: '弹窗输入',
        dialogFieldPlaceholder: '在弹窗中输入内容',
        drawerContent: '这是抽屉内的表单内容',
        drawerField: '抽屉输入',
        drawerFieldPlaceholder: '在抽屉中输入内容',
        practiceTab: '最佳实践',
        practiceTitle: '新增能力使用说明',
        practiceIntro: '这个示例只依赖 designer/form-create 公开产物，串联统一值绑定、能力注册、代码展示、图表、数据表格、全局数据、远程请求和组件事件。',
        practiceRegistryTitle: '组件能力注册表',
        practiceRegistryA: '内置和第三方 FC 组件通过同一份 definition 声明 binding、preview、tableCell、overlay、methods 等能力。',
        practiceRegistryB: '第三方组件使用 registerComponent() 统一注册运行组件、设计态组件、拖拽规则和能力定义。',
        practiceRegistryC: 'FcDesigner.component() 只保留渲染注册语义，不会隐式进入能力注册表。当前已注册：',
        practiceCodeTitle: 'Code 代码展示',
        practiceCodeA: '静态内容直接写入 props.chartData，配置面板中的代码内容 textarea 绑定 formCreateProps>chartData。',
        practiceCodeB: '远程内容通过 effect.fetch 写入 props.chartData，parse 返回字符串或对象；对象会在组件内格式化为 JSON。',
        practiceCodeC: '可编辑代码使用 modelValue / update:modelValue / change，用户输入会立即同步展示并触发全局事件。',
        practiceChartTitle: '图表组件',
        practiceChartA: '静态图表优先通过 field + value/modelValue 进入表单模型，历史 props.chartData 继续作为兼容兜底。',
        practiceChartB: '全局数据图表使用 effect.globalData，把 chartChannel 写入 props.chartData。',
        practiceChartC: '远程图表可复用 effect.fetch + parse，只要 parse 输出图表组件需要的数据结构。',
        practiceGlobalDataTitle: '全局变量',
        practiceGlobalDataA: '城市、职业、穿梭框、树、树选择和饼图都从表单配置里的全局数据读取。',
        practiceGlobalDataB: '全局数据源支持静态数据和 fetch 数据，组件只关心 to 写到 options、props.options 或 props.chartData。',
        practiceGlobalDataC: '导出时会自动扫描 effect.globalData 绑定关系，并在 onMounted 中回填到对应组件；数据源开启自动更新后，api.setGlobalData / api.updateGlobalData / api.globalData.xxx = value 会发布到绑定组件。',
        practiceGlobalEventTitle: '全局方法 / 自定义事件',
        practiceGlobalEventA: '按钮、选择器、树、TableForm、Group、SubForm、Code 都绑定了自定义事件。',
        practiceGlobalEventB: '事件统一注册到 api.globalEvent，组件事件只负责传递 field、value、source 等上下文。',
        practiceGlobalEventC: '这种方式避免把业务逻辑散落在每个组件配置里，导出后也更容易维护。',
        practiceRemoteTitle: '远程请求',
        practiceRemoteA: '远程用户和远程待办使用公开 REST API，请求成功后 parse 转为 {label, value} 再写入 options。',
        practiceRemoteB: '远程用户 JSON 直接写入 props.chartData，用 Code 组件展示接口响应。',
        practiceRemoteC: 'GET 请求不带空 data，避免浏览器或代理把空请求体处理成异常请求。',
        practiceLanguageTitle: '语言变量',
        practiceLanguageA: '示例规则生成时使用 t(key) 写入明文，切换语言时重新生成对应语言的默认模板。',
        practiceLanguageB: '配置项里的 language 保存 zh-cn / en 两套文案，导出表单时可以继续作为运行时语言包。',
        practiceLanguageC: '不要在默认模板里直接写 {{$t.xxx}}，否则设计器中会把它当普通文本展示。',
        practiceBindingTitle: '组件绑定闭环',
        practiceBindingA: '选择类组件：value 保存字段值，options 保存展示项，change 触发自定义事件。',
        practiceBindingB: '混合绑定组件：fcChart、fcCodePreview、fcDataTable 优先消费 modelValue，并保留 chartData/data 公开属性 fallback；宿主历史 JSON 字符串由宿主迁移层处理。',
        practiceBindingC: '输入类组件：field + value 进入 formData，必要时通过 on.change 同步到全局方法。',
        practiceFlowTitle: '推荐数据流',
        practiceFlowA: '数据源：静态结构、全局变量或远程 fetch。',
        practiceFlowB: '数据处理：parse 把接口响应转换为组件消费的结构。',
        practiceFlowC: '组件更新：to 明确写入 options、props.options 或 props.chartData。',
        practiceFlowD: '行为扩展：on.change / click 调用 api.globalEvent 中的自定义方法。',
        practiceDialogTitle: '弹窗 / 抽屉容器',
        practiceDialogA: '弹窗和抽屉需要设置 field 字段（如 showDialog）并设置 value 为 false，通过表单数据模型控制显隐。',
        practiceDialogB: '打开：在按钮 click 事件中调用 api.setValue("showDialog", true)；或在全局自定义事件中定义 onOpenDialog 方法，通过 data.api.setValue() 控制。',
        practiceDialogC: '关闭：监听弹窗/抽屉的 close 事件，在事件处理中调用 api.setValue("showDialog", false)，实现点击遮罩或关闭按钮自动关闭。',
        practiceDialogD: '注意：不要直接修改 rule.props.modelValue，因为有 field 的组件其 modelValue 由表单数据模型驱动，直接修改会被覆盖。',
        dataTableTab: '数据表格',
        dtTitle: '员工数据表',
        dtCursorTitle: '远程游标分页表格',
        dtGlobalDataTitle: '线上全局数据表格',
        dtGlobalDataSelect: '线上待办选择',
        dtGlobalDataSelectPlaceholder: '请选择线上待办',
        dtGlobalDataRefresh: '刷新线上全局数据源',
        dtGlobalDataAlert: '下面的表格和选择器都绑定 fetch 型全局数据源。点击按钮会重新请求线上接口并更新全局数据源，绑定组件会自动刷新。',
        dtAlert: '数据表格已按最新能力闭环：value/modelValue 是新配置主入口，props.data 是公开 fallback；行操作、筛选排序、本地/游标分页和生命周期事件均由组件自身管理。',
        dtColId: '编号',
        dtColAvatar: '头像',
        dtColName: '姓名',
        dtColCity: '城市',
        dtColStatus: '状态',
        dtColGrade: '评级',
        dtColTaskTitle: '任务标题',
        dtColUser: '用户',
        dtColCompleted: '完成状态',
        dtCityBJ: '北京',
        dtCitySH: '上海',
        dtCityGZ: '广州',
        dtStatusActive: '在职',
        dtStatusLeft: '离职',
        dtStatusTodo: '待处理',
        dtStatusDone: '已完成',
        dtActionView: '查看',
        dtActionEdit: '编辑',
        dtActionDelete: '删除',
        dtActionFail: '模拟失败',
        dtActionSaved: '保存成功',
        dtActionDeleted: '删除操作已完成',
        dtActionFailed: '这是预期的失败示例',
        dtActionDeleteConfirm: '确认执行删除操作吗？',
        dtEmpty: '暂无数据',
        practiceDataTableTitle: '数据表格',
        practiceDataTableA: '数据绑定：带 field 的新配置通过 value/modelValue 进入表单模型；props.data 是公开 fallback，不负责解析宿主历史 JSON 字符串。',
        practiceDataTableB: '列渲染：render 支持 normal / tag / link / image；列筛选 filter 支持 static / global / fetch 三种数据源，选项结构统一为 {label, value}。',
        practiceDataTableC: '排序：normal 在组件内对全量数据排序；custom 仅抛出 sortChange 事件，由外部接口重新取数（与分页/筛选互不影响）。',
        practiceDataTableD: '游标分页：cursorPagination 按 preset / request / response / labels 分组，常见接口先选预设，再按需覆盖路径。',
        practiceDataTableE: '行操作：支持确认、异步 loading、防重复提交、成功/失败提示；clickFn(row, index, action, context) 可读取 api、tableRef 和 selectedRows，并触发 actionClick/actionSuccess/actionError/actionFinally。',
    },
    en: {
        demoTitle: 'Title',
        demoTitleText: 'Employee Profile Form',
        basicTabLabel: 'Basic Inputs',
        dataSourceTabLabel: 'Data Sources',
        codeChartTabLabel: 'Code & Charts',
        layoutTabLabel: 'Display & Layout',
        advancedTabLabel: 'Complex Structures',
        basicAlert: 'Basic fields use field + value as the formData contract; validation, controls, and change events stay on standard form-create APIs.',
        userName: 'Name',
        userNamePlaceholder: 'Enter name',
        accessCode: 'Access Code',
        accessCodePlaceholder: 'Enter access code',
        age: 'Age',
        completion: 'Completion',
        joinDate: 'Join Date',
        joinDatePlaceholder: 'Pick a date',
        projectCycle: 'Project Cycle',
        startDate: 'Start',
        endDate: 'End',
        dailyStandup: 'Daily Standup',
        timePlaceholder: 'Pick time',
        officeHours: 'Office Hours',
        startTime: 'Start Time',
        endTime: 'End Time',
        themeColor: 'Theme Color',
        isActive: 'Status',
        performance: 'Performance',
        notes: 'Notes',
        notesPlaceholder: 'Enter notes',
        globalDataAlert: 'City, occupation, transfer, tree, tree select, and the second chart are all driven by global data sources; chartChannel enables auto update.',
        remoteDataAlert: 'Remote users and remote todos use a public REST API. Data appears when the network is available.',
        city: 'City',
        cityPlaceholder: 'Select city',
        occupation: 'Occupation',
        skills: 'Skills',
        remoteUser: 'Remote User',
        remoteUserPlaceholder: 'Load users remotely',
        remoteTodos: 'Remote Todos',
        area: 'Area',
        areaPlaceholder: 'Select area',
        reviewers: 'Reviewers',
        available: 'Available',
        selected: 'Selected',
        permissionTree: 'Permission Tree',
        department: 'Department',
        departmentPlaceholder: 'Select department',
        lineChart: 'Monthly Trend',
        lineChartName: 'Monthly Trend',
        lineChartDesc: 'Static data source with smooth line and a custom-named average mark line.',
        lineChartAverage: 'Monthly average',
        emptyChart: 'Chart Empty State',
        emptyChartDesc: 'The runtime component shows an empty state and never invents designer sample data.',
        channelChart: 'Lead Source Share',
        channelChartName: 'Lead Source Share',
        channelChartDesc: 'Pie chart driven by a global data source.',
        fullOptionChart: 'Full ECharts Option',
        fullOptionChartName: 'Revenue vs Cost',
        fullOptionChartDesc: 'Pass a full ECharts option (dataset, axes, tooltip, and mixed bar/line series) rendered by the component as-is.',
        codePreview: 'Config Example',
        codePreviewName: 'JSON Config Snippet',
        codePreviewDesc: 'Shows global data, global methods, and language config together.',
        remoteUserCode: 'Remote User JSON',
        remoteUserCodeName: 'Remote API Response',
        remoteUserCodeDesc: 'Component-level fetch loads a remote user detail into the code preview.',
        liveScript: 'Editable Script',
        liveScriptName: 'JavaScript Live Editor',
        liveScriptDesc: 'Bound to modelValue; edits emit change and update the preview immediately.',
        yamlTreeEditor: 'YAML Tree Editor',
        yamlTreeEditorName: 'YAML Service Config',
        yamlTreeEditorDesc: 'Use the tree for schema-constrained edits while keeping the full YAML source available beside it.',
        codeBestPractice: 'Keep data, events, and copy in configurable entries',
        summaryCard: 'Display Component Set',
        summaryText: 'Text is for static copy; HTML is for rich snippets; buttons can bind global methods.',
        htmlSourceTitle: 'Escaped HTML in Designer',
        htmlRenderTitle: 'Rendered HTML in Designer',
        statusDivider: 'Status',
        bestPracticeTag: 'Best Practice',
        logButton: 'Log Form Data',
        refreshButton: 'Trigger Refresh Event',
        collapseProfile: 'Profile',
        profileAlias: 'Profile Alias',
        profileAliasPlaceholder: 'Enter alias',
        collapseAudit: 'Audit',
        auditNotes: 'Audit Notes',
        projects: 'Projects',
        projectName: 'Project Name',
        projectRole: 'Role',
        duration: 'Duration',
        members: 'Members',
        memberIndex: 'Member {index}',
        memberName: 'Member Name',
        memberNamePlaceholder: 'Enter member name',
        memberRole: 'Member Role',
        approval: 'Approval',
        approvalOwner: 'Owner',
        approvalOwnerPlaceholder: 'Enter owner',
        needAudit: 'Need Audit',
        richText: 'Rich Text',
        attachments: 'Attachments',
        signature: 'Signature',
        dialogDrawerTab: 'Dialog & Drawer',
        dialogTitle: 'Dialog & Drawer Example',
        dialogAlert: 'Dialog and Drawer support static toggle and global data binding. Click buttons to open them.',
        openDialogBtn: 'Open Dialog',
        openDrawerBtn: 'Open Drawer',
        closeDialogBtn: 'Close Dialog',
        closeDrawerBtn: 'Collapse Drawer',
        dialogContent: 'Form content inside the dialog',
        dialogField: 'Dialog Input',
        dialogFieldPlaceholder: 'Enter content in dialog',
        drawerContent: 'Form content inside the drawer',
        drawerField: 'Drawer Input',
        drawerFieldPlaceholder: 'Enter content in drawer',
        practiceTab: 'Best Practices',
        practiceTitle: 'New Capability Guide',
        practiceIntro: 'This example only depends on public designer/form-create outputs and connects unified binding, capability registration, code, charts, data tables, global data, remote fetch, and events.',
        practiceRegistryTitle: 'Component capability registry',
        practiceRegistryA: 'Built-in and third-party FC components declare binding, preview, tableCell, overlay, and methods in the same definition contract.',
        practiceRegistryB: 'Third-party components use registerComponent() to register runtime, designer preview, drag rule, and capabilities through one public entry.',
        practiceRegistryC: 'FcDesigner.component() keeps render-only semantics and does not implicitly add capabilities. Registered now:',
        practiceCodeTitle: 'Code Preview',
        practiceCodeA: 'Static code is written to props.chartData; the textarea in the config panel binds to formCreateProps>chartData.',
        practiceCodeB: 'Remote code uses effect.fetch and writes to props.chartData. parse can return a string or object; objects are formatted as JSON in the component.',
        practiceCodeC: 'Editable code uses modelValue / update:modelValue / change, so user edits update the preview immediately and trigger global events.',
        practiceChartTitle: 'Charts',
        practiceChartA: 'Static charts prefer field + value/modelValue in the form model, while legacy props.chartData remains a compatible fallback.',
        practiceChartB: 'Global-data charts use effect.globalData to write chartChannel into props.chartData.',
        practiceChartC: 'Remote charts can reuse effect.fetch + parse as long as parse returns the chart data shape.',
        practiceGlobalDataTitle: 'Global Data',
        practiceGlobalDataA: 'City, occupation, transfer, tree, tree select, and the pie chart all read from global data in form options.',
        practiceGlobalDataB: 'Global data supports static and fetch sources; components only care whether to writes to options, props.options, or props.chartData.',
        practiceGlobalDataC: 'Export scans effect.globalData bindings and hydrates each target component in onMounted. When a data source enables auto update, api.setGlobalData / api.updateGlobalData / api.globalData.xxx = value publishes to bound components.',
        practiceGlobalEventTitle: 'Global Methods / Custom Events',
        practiceGlobalEventA: 'Buttons, selects, tree, TableForm, Group, SubForm, and Code all bind custom events.',
        practiceGlobalEventB: 'Events are registered on api.globalEvent; component handlers only pass context like field, value, and source.',
        practiceGlobalEventC: 'This keeps business logic out of individual component configs and makes exported forms easier to maintain.',
        practiceRemoteTitle: 'Remote Fetch',
        practiceRemoteA: 'Remote users and todos use public REST APIs; parse converts responses to {label, value} and writes them to options.',
        practiceRemoteB: 'Remote user JSON writes directly to props.chartData and is rendered by the Code component.',
        practiceRemoteC: 'GET requests do not include empty data, avoiding odd handling of empty request bodies by browsers or proxies.',
        practiceLanguageTitle: 'Language Variables',
        practiceLanguageA: 'The default rules use t(key) to write plain text; switching language regenerates the default template for that language.',
        practiceLanguageB: 'The language option keeps zh-cn / en copy and can continue to work as runtime language config after export.',
        practiceLanguageC: 'Do not write {{$t.xxx}} directly in the default template, because the designer will display it as plain text.',
        practiceBindingTitle: 'Component Binding Loop',
        practiceBindingA: 'Choice components: value stores the field value, options stores display items, and change triggers a custom event.',
        practiceBindingB: 'Hybrid components prefer modelValue and retain public chartData/data fallbacks; host-specific historical JSON strings belong in the host migration layer.',
        practiceBindingC: 'Input components: field + value enter formData; on.change can forward updates to global methods when needed.',
        practiceFlowTitle: 'Recommended Data Flow',
        practiceFlowA: 'Data source: static structure, global data, or remote fetch.',
        practiceFlowB: 'Data transform: parse converts API responses into the shape consumed by the component.',
        practiceFlowC: 'Component update: to explicitly writes into options, props.options, or props.chartData.',
        practiceFlowD: 'Behavior extension: on.change / click calls custom methods from api.globalEvent.',
        practiceDialogTitle: 'Dialog / Drawer Container',
        practiceDialogA: 'Dialog and Drawer require a field (e.g. showDialog) with value set to false, controlling visibility through the form data model.',
        practiceDialogB: 'Open: call api.setValue("showDialog", true) in a button click event; or define an onOpenDialog method in global custom events and use data.api.setValue() to control it.',
        practiceDialogC: 'Close: listen to the close event on the dialog/drawer, call api.setValue("showDialog", false) in the handler, so clicking the overlay or close button auto-hides it.',
        practiceDialogD: 'Note: do not modify rule.props.modelValue directly — for components with a field, modelValue is driven by the form data model and direct changes will be overridden.',
        dataTableTab: 'Data Table',
        dtTitle: 'Employee Data Table',
        dtCursorTitle: 'Remote Cursor Pagination Table',
        dtGlobalDataTitle: 'Online Global Data Table',
        dtGlobalDataSelect: 'Online Todo Select',
        dtGlobalDataSelectPlaceholder: 'Select online todo',
        dtGlobalDataRefresh: 'Refresh Online Global Data',
        dtGlobalDataAlert: 'The table and select below both bind fetch-based global data sources. Click the button to request the online API again and update global data; bound components refresh automatically.',
        dtAlert: 'The latest table contract uses value/modelValue as the primary input and props.data as a public fallback; row actions, filtering, sorting, local/cursor pagination, and lifecycle events are component-owned.',
        dtColId: 'ID',
        dtColAvatar: 'Avatar',
        dtColName: 'Name',
        dtColCity: 'City',
        dtColStatus: 'Status',
        dtColGrade: 'Grade',
        dtColTaskTitle: 'Task title',
        dtColUser: 'User',
        dtColCompleted: 'Completed',
        dtCityBJ: 'Beijing',
        dtCitySH: 'Shanghai',
        dtCityGZ: 'Guangzhou',
        dtStatusActive: 'Active',
        dtStatusLeft: 'Left',
        dtStatusTodo: 'Todo',
        dtStatusDone: 'Done',
        dtActionView: 'View',
        dtActionEdit: 'Edit',
        dtActionDelete: 'Delete',
        dtActionFail: 'Simulate failure',
        dtActionSaved: 'Saved successfully',
        dtActionDeleted: 'Delete action completed',
        dtActionFailed: 'This is the expected failure example',
        dtActionDeleteConfirm: 'Run the delete action?',
        dtEmpty: 'No data',
        practiceDataTableTitle: 'Data Table',
        practiceDataTableA: 'Data binding: rules with a field use value/modelValue; props.data is a public fallback and does not parse host-specific historical JSON strings.',
        practiceDataTableB: 'Column render: render supports normal/tag/link/image; column filter supports static/global/fetch sources with unified {label, value} options.',
        practiceDataTableC: 'Sorting: normal sorts the full dataset inside the component; custom only emits sortChange so the backend can refetch (independent from paging/filtering).',
        practiceDataTableD: 'Cursor pagination: cursorPagination is grouped by preset / request / response / labels. Choose a preset first, then override paths as needed.',
        practiceDataTableE: 'Row actions support confirmation, async loading, duplicate prevention, and result messages. clickFn(row, index, action, context) can access api, tableRef, and selectedRows, with actionClick/actionSuccess/actionError/actionFinally lifecycle events.',
    },
};

const TREND_DATA = {
    category: ['1月', '2月', '3月', '4月', '5月', '6月'],
    series: [
        {name: '销售额', data: [120, 142, 168, 156, 188, 215]},
        {name: '目标', data: [110, 135, 150, 165, 180, 200]},
    ],
};

const FULL_OPTION_CHART = {
    title: {
        text: '2024 经营概览',
        subtext: '收入 / 成本 / 毛利率',
        left: 'center',
        textStyle: {fontSize: 14},
        subtextStyle: {fontSize: 11},
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {type: 'cross'},
    },
    legend: {
        top: 56,
        data: ['收入', '成本', '毛利率'],
    },
    grid: {left: 48, right: 56, top: 96, bottom: 56},
    dataZoom: [
        {type: 'inside', start: 0, end: 100},
        {type: 'slider', height: 16, bottom: 12},
    ],
    xAxis: [
        {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
            axisTick: {alignWithLabel: true},
        },
    ],
    yAxis: [
        {
            type: 'value',
            name: '金额 (万)',
            axisLabel: {formatter: '{value}'},
            splitLine: {lineStyle: {type: 'dashed'}},
        },
        {
            type: 'value',
            name: '毛利率',
            min: 0,
            max: 100,
            axisLabel: {formatter: '{value}%'},
            splitLine: {show: false},
        },
    ],
    series: [
        {
            name: '收入',
            type: 'bar',
            stack: 'amount',
            emphasis: {focus: 'series'},
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        {offset: 0, color: '#4facfe'},
                        {offset: 1, color: '#00f2fe'},
                    ],
                },
            },
            data: [120, 200, 150, 180, 240, 210, 260, 300],
            markPoint: {data: [{type: 'max', name: '峰值'}]},
        },
        {
            name: '成本',
            type: 'bar',
            stack: 'amount',
            emphasis: {focus: 'series'},
            itemStyle: {color: '#f6a192'},
            data: [80, 110, 90, 120, 150, 130, 160, 190],
        },
        {
            name: '毛利率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {width: 3},
            itemStyle: {color: '#67c23a'},
            data: [33, 45, 40, 33, 38, 38, 38, 37],
            markLine: {
                data: [{type: 'average', name: '平均毛利率'}],
                label: {formatter: '均值 {c}%'},
            },
        },
    ],
};

const GLOBAL_DATA = {
    cities: [
        {label: '北京', value: 'beijing'},
        {label: '上海', value: 'shanghai'},
        {label: '广州', value: 'guangzhou'},
        {label: '深圳', value: 'shenzhen'},
        {label: '杭州', value: 'hangzhou'},
        {label: '成都', value: 'chengdu'},
        {label: '武汉', value: 'wuhan'},
        {label: '南京', value: 'nanjing'},
    ],
    occupations: [
        {label: '前端工程师', value: 'frontend'},
        {label: '后端工程师', value: 'backend'},
        {label: '全栈工程师', value: 'fullstack'},
        {label: '产品经理', value: 'pm'},
        {label: 'UI设计师', value: 'designer'},
        {label: '测试工程师', value: 'qa'},
        {label: '运维工程师', value: 'devops'},
    ],
    reviewers: [
        {label: 'Alice', key: 'alice'},
        {label: 'Bob', key: 'bob'},
        {label: 'Cindy', key: 'cindy'},
        {label: 'David', key: 'david'},
    ],
    departments: [
        {
            label: '产品研发中心',
            value: 'product-rd',
            children: [
                {label: '前端组', value: 'frontend'},
                {label: '后端组', value: 'backend'},
                {label: '测试组', value: 'qa'},
            ],
        },
        {
            label: '业务增长中心',
            value: 'growth',
            children: [
                {label: '运营组', value: 'operation'},
                {label: '市场组', value: 'marketing'},
            ],
        },
    ],
    permissionTree: [
        {
            label: '工作台',
            id: 'dashboard',
            children: [
                {label: '查看指标', id: 'dashboard:view'},
                {label: '导出报表', id: 'dashboard:export'},
            ],
        },
        {
            label: '系统配置',
            id: 'setting',
            children: [
                {label: '成员管理', id: 'setting:user'},
                {label: '角色管理', id: 'setting:role'},
            ],
        },
    ],
    chartChannel: {
        category: ['官网', '活动', '推荐', '广告'],
        series: [
            {
                name: '线索来源',
                data: [
                    {name: '官网', value: 42},
                    {name: '活动', value: 28},
                    {name: '推荐', value: 18},
                    {name: '广告', value: 12},
                ],
            },
        ],
    },
    tableGrades: [
        {label: 'A', value: 'A'},
        {label: 'B', value: 'B'},
        {label: 'C', value: 'C'},
    ],
};

const AREA_OPTIONS = [
    {label: '华北', value: 'north', children: [{label: '北京', value: 'beijing'}, {label: '天津', value: 'tianjin'}]},
    {label: '华东', value: 'east', children: [{label: '上海', value: 'shanghai'}, {label: '杭州', value: 'hangzhou'}]},
    {label: '华南', value: 'south', children: [{label: '广州', value: 'guangzhou'}, {label: '深圳', value: 'shenzhen'}]},
];

const TABLE_AVATAR = 'https://static.form-create.com/example.png';
const TABLE_NAMES = ['Avery', 'Blake', 'Casey', 'Dana', 'Eden', 'Frankie', 'Gray', 'Harper'];

const clone = (data) => JSON.parse(JSON.stringify(data));
const wrapFn = (body) => FN_PREFIX + body + FN_SUFFIX;

const getLocaleName = (lang) => lang === 'en' ? 'en' : 'zh-cn';

const createTranslator = (lang) => {
    const language = SHOWCASE_LANGUAGE[getLocaleName(lang)];
    return (key) => language[key] || key;
};

const col = (id, span, children) => ({
    type: 'col',
    _fc_drag_tag: 'col',
    _fc_id: id,
    props: {span},
    children: Array.isArray(children) ? children : [children],
});

const row = (id, children) => ({
    type: 'fcRow',
    _fc_drag_tag: 'fcRow',
    _fc_id: id,
    props: {gutter: 15},
    children,
});

const optionGlobalData = (name, to) => ({globalData: {name, to}});

const globalEventCall = (name, payload = '{value: $inject.args[0]}') => {
    return '$FNX:const api = $inject.$f;\n' +
        `const handler = api && api.globalEvent && api.globalEvent[${JSON.stringify(name)}];\n` +
        `handler && handler(${payload});`;
};

const dialogDrawerEventCall = (name, field, visible, source) => {
    return '$FNX:var api = $inject.$f;\n' +
        `var payload = {source: ${JSON.stringify(source)}, api: api};\n` +
        `var handler = api && api.globalEvent && api.globalEvent[${JSON.stringify(name)}];\n` +
        'if (handler) {\n' +
        '  handler(payload);\n' +
        '} else if (api) {\n' +
        `  api.setValue(${JSON.stringify(field)}, ${visible});\n` +
        '}';
};

const fetchConfig = (action, parse, extra = {}) => ({
    action,
    method: 'GET',
    dataType: 'json',
    headers: {},
    query: {},
    parse,
    ...extra,
});

const remoteUsersFetchConfig = () => fetchConfig(
    JSONPLACEHOLDER_USERS_URL,
    wrapFn('function parseRemoteUsers(res){\n' +
        '  var list = Array.isArray(res) ? res : (Array.isArray(res && res.data) ? res.data : []);\n' +
        '  return list.slice(0, 8).map(function(item){\n' +
        '    return {label: item.name + " / " + item.email, value: item.id};\n' +
        '  });\n' +
        '}'),
    {to: 'options'}
);

const remoteTodosFetchConfig = () => fetchConfig(
    JSONPLACEHOLDER_TODOS_URL,
    wrapFn('function parseRemoteTodos(res){\n' +
        '  var list = Array.isArray(res) ? res : (Array.isArray(res && res.data) ? res.data : []);\n' +
        '  return list.slice(0, 6).map(function(item){\n' +
        '    return {label: item.title, value: item.id};\n' +
        '  });\n' +
        '}'),
    {query: {userId: 1}, to: 'options'}
);

const remoteUserCodeFetchConfig = () => fetchConfig(
    JSONPLACEHOLDER_USERS_URL + '/1',
    wrapFn('function parseRemoteUserCode(res){\n' +
        '  var data = res && res.data ? res.data : res;\n' +
        '  return JSON.stringify(data || {}, null, 2);\n' +
        '}'),
    {to: 'props.chartData'}
);

const cursorTodosFetchConfig = (t) => fetchConfig(
    JSONPLACEHOLDER_TODOS_URL,
    wrapFn('function parseCursorTodos(res){\n' +
        '  var list = Array.isArray(res) ? res : (Array.isArray(res && res.data) ? res.data : []);\n' +
        '  var rows = list.map(function(item){\n' +
        '    return {\n' +
        '      id: item.id,\n' +
        '      title: item.title,\n' +
        '      userId: item.userId,\n' +
        '      completed: item.completed ? ' + JSON.stringify(t('dtStatusDone')) + ' : ' + JSON.stringify(t('dtStatusTodo')) + '\n' +
        '    };\n' +
        '  });\n' +
        '  var nextCursor = list.length ? list[list.length - 1].id : "";\n' +
        '  return {rows: rows, next_cursor: nextCursor, has_more: rows.length > 0 && Number(nextCursor) < 20};\n' +
        '}'),
    {}
);

const onlineTodoRowsFetchConfig = (t) => fetchConfig(
    JSONPLACEHOLDER_TODOS_URL,
    wrapFn('function parseOnlineTodoRows(res){\n' +
        '  var list = Array.isArray(res) ? res : (Array.isArray(res && res.data) ? res.data : []);\n' +
        '  return list.map(function(item){\n' +
        '    return {\n' +
        '      id: item.id,\n' +
        '      title: item.title,\n' +
        '      userId: item.userId,\n' +
        '      completed: item.completed ? ' + JSON.stringify(t('dtStatusDone')) + ' : ' + JSON.stringify(t('dtStatusTodo')) + '\n' +
        '    };\n' +
        '  });\n' +
        '}'),
    {query: {_start: 0, _limit: 5}}
);

const onlineTodoOptionsFetchConfig = () => fetchConfig(
    JSONPLACEHOLDER_TODOS_URL,
    wrapFn('function parseOnlineTodoOptions(res){\n' +
        '  var list = Array.isArray(res) ? res : (Array.isArray(res && res.data) ? res.data : []);\n' +
        '  return list.map(function(item){\n' +
        '    return {label: item.title, value: item.id};\n' +
        '  });\n' +
        '}'),
    {query: {_start: 0, _limit: 5}}
);

const getGlobalDataItems = (t = createTranslator('zh-cn')) => {
    const staticItems = Object.keys(GLOBAL_DATA).map(name => ({
        name,
        type: 'static',
        autoSync: name === 'chartChannel',
        data: JSON.stringify(GLOBAL_DATA[name]),
    }));

    return [
        ...staticItems,
        {
            name: 'remoteUsers',
            type: 'fetch',
            fetch: remoteUsersFetchConfig(),
        },
        {
            name: 'onlineTodoRows',
            type: 'fetch',
            autoSync: true,
            fetch: onlineTodoRowsFetchConfig(t),
        },
        {
            name: 'onlineTodoOptions',
            type: 'fetch',
            autoSync: true,
            fetch: onlineTodoOptionsFetchConfig(),
        },
    ];
};

const getCustomEvents = (t = createTranslator('zh-cn')) => {
    const eventNames = [
        'onFormLog',
        'onDataRefresh',
        'onRefreshGlobalTodos',
        'onCodeChange',
        'onCityChange',
        'onRemoteUserChange',
        'onRemoteTodosChange',
        'onYamlChange',
        'onPermissionCheck',
        'onProjectAdd',
        'onProjectDelete',
        'onProjectChange',
        'onMemberChange',
        'onApprovalChange',
        'onOpenDialog',
        'onCloseDialog',
        'onOpenDrawer',
        'onCloseDrawer',
        'onTableSelection',
        'onTablePage',
        'onTableRowClick',
        'onTableLinkClick',
        'onTableActionClick',
        'onTableActionSuccess',
        'onTableActionError',
        'onTableActionFinally',
    ];
    const events = {
        _customEventNames: eventNames,
        onFormLog: wrapFn('function onFormLog(data){ console.log("[表单日志]", data); }'),
        onDataRefresh: wrapFn('function onDataRefresh(data){\n' +
            '  console.log("[数据刷新]", data);\n' +
            '  if (!api || typeof api.updateGlobalData !== "function") return;\n' +
            '  api.updateGlobalData("chartChannel", function(current){\n' +
            '    if (!current || !current.series || !current.series[0] || !Array.isArray(current.series[0].data)) return current;\n' +
            '    var seed = data && data.time ? data.time : Date.now();\n' +
            '    var next = JSON.parse(JSON.stringify(current));\n' +
            '    next.series[0].data = next.series[0].data.map(function(item, index){\n' +
            '      var value = Number(item.value) || 0;\n' +
            '      item.value = value + ((seed + index) % 5) + 1;\n' +
            '      return item;\n' +
            '    });\n' +
            '    return next;\n' +
            '  });\n' +
            '}'),
        onRefreshGlobalTodos: wrapFn('function onRefreshGlobalTodos(data){\n' +
            '  console.log("[刷新线上全局数据源]", data);\n' +
            '  if (!api || typeof api.fetch !== "function" || typeof api.setGlobalData !== "function") return;\n' +
            '  var current = Number(api.globalData && api.globalData.onlineTodoOffset) || 0;\n' +
            '  var nextStart = current >= 15 ? 0 : current + 5;\n' +
            '  api.setGlobalData("onlineTodoOffset", nextStart, {silent: true});\n' +
            '  api.fetch({\n' +
            '    action: ' + JSON.stringify(JSONPLACEHOLDER_TODOS_URL) + ',\n' +
            '    method: "GET",\n' +
            '    dataType: "json",\n' +
            '    headers: {},\n' +
            '    query: {_start: nextStart, _limit: 5}\n' +
            '  }).then(function(res){\n' +
            '    var list = Array.isArray(res) ? res : (Array.isArray(res && res.data) ? res.data : []);\n' +
            '    var rows = list.map(function(item){\n' +
            '      return {\n' +
            '        id: item.id,\n' +
            '        title: item.title,\n' +
            '        userId: item.userId,\n' +
            '        completed: item.completed ? ' + JSON.stringify(t('dtStatusDone')) + ' : ' + JSON.stringify(t('dtStatusTodo')) + '\n' +
            '      };\n' +
            '    });\n' +
            '    var options = list.map(function(item){\n' +
            '      return {label: item.title, value: item.id};\n' +
            '    });\n' +
            '    api.setGlobalData("onlineTodoRows", rows);\n' +
            '    api.setGlobalData("onlineTodoOptions", options);\n' +
            '  }).catch(function(e){ console.error(e); });\n' +
            '}'),
        onCodeChange: wrapFn('function onCodeChange(data){ console.log("[代码内容变化]", data); }'),
        onCityChange: wrapFn('function onCityChange(data){ console.log("[城市变化]", data); }'),
        onRemoteUserChange: wrapFn('function onRemoteUserChange(data){ console.log("[远程用户变化]", data); }'),
        onRemoteTodosChange: wrapFn('function onRemoteTodosChange(data){ console.log("[远程待办变化]", data); }'),
        onYamlChange: wrapFn('function onYamlChange(data){ console.log("[YAML变化]", data); }'),
        onPermissionCheck: wrapFn('function onPermissionCheck(data){ console.log("[权限树勾选]", data); }'),
        onProjectAdd: wrapFn('function onProjectAdd(data){ console.log("[项目新增]", data); }'),
        onProjectDelete: wrapFn('function onProjectDelete(data){ console.log("[项目删除]", data); }'),
        onProjectChange: wrapFn('function onProjectChange(data){ console.log("[项目变化]", data); }'),
        onMemberChange: wrapFn('function onMemberChange(data){ console.log("[成员变化]", data); }'),
        onApprovalChange: wrapFn('function onApprovalChange(data){ console.log("[审批信息变化]", data); }'),
        onOpenDialog: wrapFn('function onOpenDialog(data){\n  var api = data && data.api;\n  if(api) {\n    api.setValue("showDialog", true);\n  }\n  console.log("[打开弹窗]", data);\n}'),
        onCloseDialog: wrapFn('function onCloseDialog(data){\n  var api = data && data.api;\n  if(api) {\n    api.setValue("showDialog", false);\n  }\n  console.log("[关闭弹窗]", data);\n}'),
        onOpenDrawer: wrapFn('function onOpenDrawer(data){\n  var api = data && data.api;\n  if(api) {\n    api.setValue("showDrawer", true);\n  }\n  console.log("[打开抽屉]", data);\n}'),
        onCloseDrawer: wrapFn('function onCloseDrawer(data){\n  var api = data && data.api;\n  if(api) {\n    api.setValue("showDrawer", false);\n  }\n  console.log("[关闭抽屉]", data);\n}'),
        onTableSelection: wrapFn('function onTableSelection(data){ console.log("[表格多选]", data); }'),
        onTablePage: wrapFn('function onTablePage(data){ console.log("[表格分页]", data); }'),
        onTableRowClick: wrapFn('function onTableRowClick(data){ console.log("[表格行点击]", data); }'),
        onTableLinkClick: wrapFn('function onTableLinkClick(data){ console.log("[表格链接点击]", data); }'),
        onTableActionClick: wrapFn('function onTableActionClick(data){ console.log("[行操作点击]", data); }'),
        onTableActionSuccess: wrapFn('function onTableActionSuccess(data){ console.log("[行操作成功]", data); }'),
        onTableActionError: wrapFn('function onTableActionError(data){ console.log("[行操作失败]", data); }'),
        onTableActionFinally: wrapFn('function onTableActionFinally(data){ console.log("[行操作结束]", data); }'),
    };
    return events;
};

const titleRule = (t) => ({
    type: 'fcTitle',
    _fc_drag_tag: 'fcTitle',
    _fc_id: 'show_title',
    field: 'demoTitle',
    title: t('demoTitle'),
    props: {title: t('demoTitleText'), size: 'h2', align: 'center'},
});

const alertRule = (id, title, type = 'info') => ({
    type: 'elAlert',
    _fc_drag_tag: 'elAlert',
    _fc_id: id,
    props: {title, type, showIcon: true, closable: false},
    style: {marginBottom: '15px'},
});

const makeCodeSnippet = (t) => JSON.stringify({
    componentRuntime: ['registerComponent', 'componentDefinitions', 'FcComponentPreview', 'componentCodec'],
    valueBinding: 'modelValue -> public prop fallback',
    globalData: ['cities', 'occupations', 'chartChannel'],
    globalEvent: ['onFormLog', 'onCodeChange'],
    languageKey: 'userName',
    languageText: t('userName'),
    bestPractice: t('codeBestPractice'),
}, null, 2);

const liveScript = 'function handlePreviewChange(code) {\n  console.log("Code changed:", code);\n  return code.length;\n}';

const YAML_TREE_EXAMPLE = `service:
  name: demo-service
  replicas: 3
  enabled: true
  env:
    - name: LOG_LEVEL
      value: info
`;

const YAML_TREE_SCHEMA = {
    type: 'object',
    required: ['service'],
    properties: {
        service: {
            type: 'object',
            required: ['name', 'replicas', 'enabled', 'env'],
            properties: {
                name: {type: 'string', minLength: 1},
                replicas: {type: 'integer', minimum: 1},
                enabled: {type: 'boolean'},
                env: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['name', 'value'],
                        properties: {
                            name: {type: 'string', minLength: 1},
                            value: {type: ['string', 'object']},
                        },
                    },
                },
            },
        },
    },
};

const makePracticeCard = (title, items) => {
    return '<section style="border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;background:#fff;">' +
        '<h3 style="margin:0 0 10px;font-size:15px;line-height:22px;color:#111827;">' + title + '</h3>' +
        '<ul style="margin:0;padding-left:18px;color:#4b5563;font-size:13px;line-height:22px;">' +
        items.map(item => '<li>' + item + '</li>').join('') +
        '</ul>' +
        '</section>';
};

const makeCapabilityGuideHtml = (t) => {
    const registeredTypes = listComponentDefinitions().map(item => item.type).join(', ');
    const cards = [
        makePracticeCard(t('practiceRegistryTitle'), [t('practiceRegistryA'), t('practiceRegistryB'), t('practiceRegistryC') + ' ' + registeredTypes]),
        makePracticeCard(t('practiceCodeTitle'), [t('practiceCodeA'), t('practiceCodeB'), t('practiceCodeC')]),
        makePracticeCard(t('practiceChartTitle'), [t('practiceChartA'), t('practiceChartB'), t('practiceChartC')]),
        makePracticeCard(t('practiceDataTableTitle'), [t('practiceDataTableA'), t('practiceDataTableB'), t('practiceDataTableC'), t('practiceDataTableD'), t('practiceDataTableE')]),
        makePracticeCard(t('practiceGlobalDataTitle'), [t('practiceGlobalDataA'), t('practiceGlobalDataB'), t('practiceGlobalDataC')]),
        makePracticeCard(t('practiceGlobalEventTitle'), [t('practiceGlobalEventA'), t('practiceGlobalEventB'), t('practiceGlobalEventC')]),
        makePracticeCard(t('practiceRemoteTitle'), [t('practiceRemoteA'), t('practiceRemoteB'), t('practiceRemoteC')]),
        makePracticeCard(t('practiceLanguageTitle'), [t('practiceLanguageA'), t('practiceLanguageB'), t('practiceLanguageC')]),
        makePracticeCard(t('practiceDialogTitle'), [t('practiceDialogA'), t('practiceDialogB'), t('practiceDialogC'), t('practiceDialogD')]),
        makePracticeCard(t('practiceBindingTitle'), [t('practiceBindingA'), t('practiceBindingB'), t('practiceBindingC')]),
        makePracticeCard(t('practiceFlowTitle'), [t('practiceFlowA'), t('practiceFlowB'), t('practiceFlowC'), t('practiceFlowD')]),
    ];

    return '<div style="width:100%;box-sizing:border-box;padding:18px;background:#f9fafb;border:1px solid #ebeef5;border-radius:8px;">' +
        '<div style="margin-bottom:16px;">' +
        '<h2 style="margin:0 0 8px;font-size:20px;line-height:28px;color:#111827;">' + t('practiceTitle') + '</h2>' +
        '<p style="margin:0;color:#6b7280;font-size:14px;line-height:22px;">' + t('practiceIntro') + '</p>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">' +
        cards.join('') +
        '</div>' +
        '</div>';
};

function basicTab(t) {
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_basic',
        props: {label: t('basicTabLabel')},
        children: [
            titleRule(t),
            alertRule('show_alert_basic', t('basicAlert')),
            row('show_row_1', [
                col('show_col_1', 12, {
                    type: 'input',
                    _fc_drag_tag: 'input',
                    _fc_id: 'show_user_name',
                    field: 'userName',
                    title: t('userName'),
                    props: {placeholder: t('userNamePlaceholder'), clearable: true},
                    $required: true,
                    on: {
                        change: globalEventCall('onDataRefresh', '{field: "userName", value: $inject.args[0]}'),
                    },
                }),
                col('show_col_2', 12, {
                    type: 'input',
                    _fc_drag_tag: 'password',
                    _fc_id: 'show_access_code',
                    field: 'accessCode',
                    title: t('accessCode'),
                    props: {type: 'password', placeholder: t('accessCodePlaceholder'), clearable: true},
                }),
            ]),
            row('show_row_2', [
                col('show_col_3', 12, {
                    type: 'inputNumber',
                    _fc_drag_tag: 'inputNumber',
                    _fc_id: 'show_age',
                    field: 'age',
                    title: t('age'),
                    props: {min: 18, max: 65},
                }),
                col('show_col_4', 12, {
                    type: 'slider',
                    _fc_drag_tag: 'slider',
                    _fc_id: 'show_completion',
                    field: 'completion',
                    title: t('completion'),
                    value: 70,
                    props: {min: 0, max: 100, step: 5, showInput: true},
                }),
            ]),
            row('show_row_3', [
                col('show_col_5', 12, {
                    type: 'datePicker',
                    _fc_drag_tag: 'datePicker',
                    _fc_id: 'show_join_date',
                    field: 'joinDate',
                    title: t('joinDate'),
                    props: {type: 'date', placeholder: t('joinDatePlaceholder')},
                }),
                col('show_col_6', 12, {
                    type: 'datePicker',
                    _fc_drag_tag: 'dateRange',
                    _fc_id: 'show_project_cycle',
                    field: 'projectCycle',
                    title: t('projectCycle'),
                    props: {type: 'daterange', startPlaceholder: t('startDate'), endPlaceholder: t('endDate')},
                }),
            ]),
            row('show_row_4', [
                col('show_col_7', 12, {
                    type: 'timePicker',
                    _fc_drag_tag: 'timePicker',
                    _fc_id: 'show_daily_standup',
                    field: 'dailyStandup',
                    title: t('dailyStandup'),
                    props: {placeholder: t('timePlaceholder')},
                }),
                col('show_col_8', 12, {
                    type: 'timePicker',
                    _fc_drag_tag: 'timeRange',
                    _fc_id: 'show_office_hours',
                    field: 'officeHours',
                    title: t('officeHours'),
                    props: {isRange: true, startPlaceholder: t('startTime'), endPlaceholder: t('endTime')},
                }),
            ]),
            row('show_row_5', [
                col('show_col_9', 8, {
                    type: 'colorPicker',
                    _fc_drag_tag: 'colorPicker',
                    _fc_id: 'show_theme_color',
                    field: 'themeColor',
                    title: t('themeColor'),
                    value: '#2f73ff',
                    props: {showAlpha: true, predefine: ['#2f73ff', '#67c23a', '#e6a23c', '#f56c6c']},
                }),
                col('show_col_10', 8, {
                    type: 'switch',
                    _fc_drag_tag: 'switch',
                    _fc_id: 'show_is_active',
                    field: 'isActive',
                    title: t('isActive'),
                    value: true,
                }),
                col('show_col_11', 8, {
                    type: 'rate',
                    _fc_drag_tag: 'rate',
                    _fc_id: 'show_performance',
                    field: 'performance',
                    title: t('performance'),
                    props: {max: 5, allowHalf: true},
                    value: 3.5,
                }),
            ]),
            {
                type: 'input',
                _fc_drag_tag: 'textarea',
                _fc_id: 'show_notes',
                field: 'notes',
                title: t('notes'),
                props: {type: 'textarea', rows: 3, placeholder: t('notesPlaceholder')},
            },
        ],
    };
}

function dataTab(t) {
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_data',
        props: {label: t('dataSourceTabLabel')},
        children: [
            alertRule('show_alert_global_data', t('globalDataAlert')),
            alertRule('show_alert_remote_data', t('remoteDataAlert'), 'warning'),
            {
                type: 'select',
                _fc_drag_tag: 'select',
                _fc_id: 'show_city',
                field: 'city',
                title: t('city'),
                effect: optionGlobalData('cities', 'options'),
                options: [],
                on: {
                    change: globalEventCall('onCityChange', '{field: "city", value: $inject.args[0]}'),
                },
                props: {placeholder: t('cityPlaceholder'), clearable: true},
            },
            {
                type: 'radio',
                _fc_drag_tag: 'radio',
                _fc_id: 'show_occupation',
                field: 'occupation',
                title: t('occupation'),
                effect: optionGlobalData('occupations', 'options'),
                options: [],
                props: {type: 'button'},
            },
            {
                type: 'select',
                _fc_drag_tag: 'select',
                _fc_id: 'show_remote_user',
                field: 'remoteUser',
                title: t('remoteUser'),
                value: 1,
                effect: {
                    fetch: remoteUsersFetchConfig(),
                },
                options: [],
                props: {placeholder: t('remoteUserPlaceholder'), clearable: true, filterable: true},
                on: {
                    change: globalEventCall('onRemoteUserChange', '{field: "remoteUser", value: $inject.args[0]}'),
                },
            },
            {
                type: 'checkbox',
                _fc_drag_tag: 'checkbox',
                _fc_id: 'show_skills',
                field: 'skills',
                title: t('skills'),
                options: [
                    {label: 'Vue', value: 'vue'},
                    {label: 'React', value: 'react'},
                    {label: 'Node.js', value: 'nodejs'},
                    {label: 'Python', value: 'python'},
                ],
            },
            {
                type: 'checkbox',
                _fc_drag_tag: 'checkbox',
                _fc_id: 'show_remote_todos',
                field: 'remoteTodos',
                title: t('remoteTodos'),
                value: [1, 2],
                effect: {
                    fetch: remoteTodosFetchConfig(),
                },
                options: [],
                on: {
                    change: globalEventCall('onRemoteTodosChange', '{field: "remoteTodos", value: $inject.args[0]}'),
                },
            },
            {
                type: 'cascader',
                _fc_drag_tag: 'cascader',
                _fc_id: 'show_area',
                field: 'area',
                title: t('area'),
                props: {options: clone(AREA_OPTIONS), placeholder: t('areaPlaceholder'), clearable: true},
            },
            {
                type: 'elTransfer',
                _fc_drag_tag: 'elTransfer',
                _fc_id: 'show_reviewers',
                field: 'reviewers',
                title: t('reviewers'),
                effect: optionGlobalData('reviewers', 'props.data'),
                on: {
                    change: globalEventCall('onDataRefresh', '{field: "reviewers", value: $inject.args[0]}'),
                },
                props: {data: [], filterable: true, titles: [t('available'), t('selected')]},
            },
            {
                type: 'tree',
                _fc_drag_tag: 'tree',
                _fc_id: 'show_permission_tree',
                field: 'permissionTree',
                title: t('permissionTree'),
                effect: optionGlobalData('permissionTree', 'props.data'),
                on: {
                    check: globalEventCall('onPermissionCheck', '{field: "permissionTree", args: $inject.args}'),
                },
                props: {data: [], props: {label: 'label'}, nodeKey: 'id', showCheckbox: true, defaultExpandAll: true},
            },
            {
                type: 'elTreeSelect',
                _fc_drag_tag: 'elTreeSelect',
                _fc_id: 'show_department',
                field: 'department',
                title: t('department'),
                effect: optionGlobalData('departments', 'props.data'),
                props: {data: [], nodeKey: 'value', checkStrictly: true, clearable: true, placeholder: t('departmentPlaceholder')},
            },
        ],
    };
}

function codeChartTab(t) {
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_code_chart',
        props: {label: t('codeChartTabLabel')},
        children: [
            {
                type: 'fcChart',
                _fc_drag_tag: 'fcChart',
                _fc_id: 'show_line_chart',
                field: 'lineChart',
                title: t('lineChart'),
                value: clone(TREND_DATA),
                props: {
                    chartType: 'line',
                    chartName: t('lineChartName'),
                    chartDescription: t('lineChartDesc'),
                    showAverageLine: true,
                    averageLineName: t('lineChartAverage'),
                    smooth: true,
                    showSymbol: true,
                    showLabel: false,
                    valueFormat: '{value} 万',
                },
                effect: {fetch: ''},
                style: {width: '100%', height: '350px'},
            },
            {
                type: 'fcChart',
                _fc_drag_tag: 'fcChart',
                _fc_id: 'show_empty_chart',
                field: 'emptyChart',
                title: t('emptyChart'),
                props: {
                    chartType: 'bar',
                    chartName: t('emptyChart'),
                    chartDescription: t('emptyChartDesc'),
                },
                style: {width: '100%', height: '180px'},
            },
            {
                type: 'fcChart',
                _fc_drag_tag: 'fcChart',
                _fc_id: 'show_channel_chart',
                field: 'channelChart',
                title: t('channelChart'),
                effect: optionGlobalData('chartChannel', 'props.chartData'),
                props: {
                    chartType: 'pie',
                    chartName: t('channelChartName'),
                    chartDescription: t('channelChartDesc'),
                    showLabel: true,
                    // Designer does not run the exported onMounted global-data hydrator.
                    // Keep a preview snapshot while effect.globalData remains the runtime source of truth.
                    chartData: clone(GLOBAL_DATA.chartChannel),
                },
                style: {width: '100%', height: '320px'},
            },
            {
                type: 'fcChart',
                _fc_drag_tag: 'fcChart',
                _fc_id: 'show_full_option_chart',
                field: 'fullOptionChart',
                title: t('fullOptionChart'),
                value: clone(FULL_OPTION_CHART),
                props: {
                    chartName: t('fullOptionChartName'),
                    chartDescription: t('fullOptionChartDesc'),
                },
                effect: {fetch: ''},
                style: {width: '100%', height: '400px'},
            },
            {
                type: 'fcYamlTreeEditor',
                _fc_drag_tag: 'fcYamlTreeEditor',
                _fc_id: 'show_yaml_tree_editor',
                field: 'yamlTreeConfig',
                title: t('yamlTreeEditor'),
                info: t('yamlTreeEditorDesc'),
                value: YAML_TREE_EXAMPLE,
                props: {
                    yaml: YAML_TREE_EXAMPLE,
                    schema: clone(YAML_TREE_SCHEMA),
                    title: t('yamlTreeEditorName'),
                    height: '420px',
                    indent: 2,
                    readonly: false,
                    disabled: false,
                    defaultExpandAll: true,
                    showHeader: true,
                    showFormatHint: true,
                    viewMode: 'split',
                },
                effect: {fetch: ''},
                on: {
                    change: globalEventCall('onYamlChange', '{field: "yamlTreeConfig", value: $inject.args[0]}'),
                },
                style: {width: '100%', height: '420px'},
            },
            {
                type: 'fcCodePreview',
                _fc_drag_tag: 'fcCodePreview',
                _fc_id: 'show_code_json',
                field: 'codePreview',
                title: t('codePreview'),
                value: makeCodeSnippet(t),
                props: {
                    language: 'json',
                    chartName: t('codePreviewName'),
                    chartDescription: t('codePreviewDesc'),
                    editable: false,
                    copyable: true,
                    formattable: true,
                },
                effect: {fetch: ''},
                style: {width: '100%', height: '200px'},
            },
            {
                type: 'fcCodePreview',
                _fc_drag_tag: 'fcCodePreview',
                _fc_id: 'show_code_remote_user',
                field: 'remoteUserCode',
                title: t('remoteUserCode'),
                props: {
                    language: 'json',
                    chartName: t('remoteUserCodeName'),
                    chartDescription: t('remoteUserCodeDesc'),
                    chartData: '{}',
                    editable: false,
                    copyable: true,
                    formattable: true,
                },
                effect: {
                    fetch: remoteUserCodeFetchConfig(),
                },
                style: {width: '100%', height: '240px'},
            },
            {
                type: 'fcCodePreview',
                _fc_drag_tag: 'fcCodePreview',
                _fc_id: 'show_code_js',
                field: 'liveScript',
                title: t('liveScript'),
                value: liveScript,
                props: {
                    language: 'javascript',
                    chartName: t('liveScriptName'),
                    chartDescription: t('liveScriptDesc'),
                    chartData: '',
                    editable: true,
                    copyable: true,
                    formattable: true,
                },
                on: {
                    change: globalEventCall('onCodeChange', '{field: "liveScript", code: $inject.args[0]}'),
                },
                style: {width: '100%', height: '260px'},
            },
        ],
    };
}

function layoutTab(t) {
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_layout',
        props: {label: t('layoutTabLabel')},
        children: [
            {
                type: 'elCard',
                _fc_drag_tag: 'elCard',
                _fc_id: 'show_card',
                props: {header: t('summaryCard'), shadow: 'hover'},
                style: {width: '100%'},
                children: [
                    {
                        type: 'div',
                        _fc_drag_tag: 'text',
                        _fc_id: 'show_text',
                        title: '',
                        native: true,
                        style: {whiteSpace: 'pre-line', width: '100%'},
                        children: [t('summaryText')],
                    },
                    {
                        type: 'elDivider',
                        _fc_drag_tag: 'elDivider',
                        _fc_id: 'show_divider',
                        props: {contentPosition: 'left'},
                        children: [t('statusDivider')],
                    },
                    {
                        type: 'elTag',
                        _fc_drag_tag: 'elTag',
                        _fc_id: 'show_tag',
                        title: '',
                        native: true,
                        props: {type: 'success', effect: 'light', round: true},
                        children: [t('bestPracticeTag')],
                    },
                    {
                        type: 'div',
                        _fc_drag_tag: 'space',
                        _fc_id: 'show_space',
                        wrap: {show: false},
                        native: true,
                        style: {width: '100%', height: '16px'},
                        children: [],
                    },
                    {
                        type: 'fcTitle',
                        _fc_drag_tag: 'fcTitle',
                        _fc_id: 'show_html_source_title',
                        props: {title: t('htmlSourceTitle'), size: 'h4', align: 'left'},
                    },
                    {
                        type: 'html',
                        _fc_drag_tag: 'html',
                        _fc_id: 'show_html',
                        title: '',
                        native: true,
                        htmlPreview: false,
                        attrs: {innerHTML: ''},
                        style: {display: 'block', width: '100%'},
                        children: ['<style>.fc-html-preview-example{color:#2f73ff;font-weight:600;}</style><div class="fc-html-preview-example">HTML content block</div>'],
                    },
                    {
                        type: 'fcTitle',
                        _fc_drag_tag: 'fcTitle',
                        _fc_id: 'show_html_render_title',
                        props: {title: t('htmlRenderTitle'), size: 'h4', align: 'left'},
                    },
                    {
                        type: 'html',
                        _fc_drag_tag: 'html',
                        _fc_id: 'show_html_rendered',
                        title: '',
                        native: true,
                        htmlPreview: true,
                        attrs: {innerHTML: ''},
                        style: {display: 'block', width: '100%'},
                        children: ['<div style="padding:10px 12px;border-radius:6px;background:#ecf5ff;color:#2f73ff;font-weight:600;">HTML content rendered in designer</div>'],
                    },
                    {
                        type: 'elImage',
                        _fc_drag_tag: 'elImage',
                        _fc_id: 'show_image',
                        title: '',
                        style: {width: '120px', height: '80px', marginTop: '12px'},
                        props: {src: 'https://static.form-create.com/example.png', fit: 'cover'},
                    },
                    {
                        type: 'elButton',
                        _fc_drag_tag: 'elButton',
                        _fc_id: 'show_log_button',
                        props: {type: 'primary', size: 'default'},
                        on: {
                            click: globalEventCall('onFormLog', '{source: "layoutButton", formData: api.formData()}'),
                        },
                        children: [t('logButton')],
                    },
                    {
                        type: 'elButton',
                        _fc_drag_tag: 'elButton',
                        _fc_id: 'show_refresh_button',
                        props: {type: 'success', size: 'default'},
                        on: {
                            click: globalEventCall('onDataRefresh', '{source: "refreshButton", time: Date.now()}'),
                        },
                        children: [t('refreshButton')],
                    },
                ],
            },
            {
                type: 'elCollapse',
                _fc_drag_tag: 'elCollapse',
                _fc_id: 'show_collapse',
                props: {accordion: false},
                style: {width: '100%', marginTop: '15px'},
                children: [
                    {
                        type: 'elCollapseItem',
                        _fc_drag_tag: 'elCollapseItem',
                        _fc_id: 'show_collapse_profile',
                        props: {title: t('collapseProfile'), name: 'profile'},
                        children: [{
                            type: 'input',
                            _fc_drag_tag: 'input',
                            _fc_id: 'show_profile_alias',
                            field: 'profileAlias',
                            title: t('profileAlias'),
                            props: {placeholder: t('profileAliasPlaceholder')},
                        }],
                    },
                    {
                        type: 'elCollapseItem',
                        _fc_drag_tag: 'elCollapseItem',
                        _fc_id: 'show_collapse_audit',
                        props: {title: t('collapseAudit'), name: 'audit'},
                        children: [{
                            type: 'input',
                            _fc_drag_tag: 'textarea',
                            _fc_id: 'show_audit_notes',
                            field: 'auditNotes',
                            title: t('auditNotes'),
                            props: {type: 'textarea', rows: 2},
                        }],
                    },
                ],
            },
            {
                type: 'fcTable',
                _fc_drag_tag: 'fcTable',
                _fc_id: 'show_table_layout',
                props: {
                    border: true,
                    borderColor: '#dcdfe6',
                    rule: {row: 2, col: 2, style: {}, class: {}, layout: []},
                },
                style: {width: '100%', marginTop: '15px'},
                children: [],
            },
        ],
    };
}

function advancedTab(t) {
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_advanced',
        props: {label: t('advancedTabLabel')},
        children: [
            {
                type: 'tableForm',
                _fc_drag_tag: 'tableForm',
                _fc_id: 'show_projects',
                field: 'projects',
                title: t('projects'),
                props: {max: 5, min: 1, addable: true, deletable: true},
                on: {
                    add: globalEventCall('onProjectAdd', '{field: "projects", index: $inject.args[0]}'),
                    delete: globalEventCall('onProjectDelete', '{field: "projects", index: $inject.args[0]}'),
                    change: globalEventCall('onProjectChange', '{field: "projects", value: $inject.args[0]}'),
                },
                children: [
                    {
                        type: 'tableFormColumn',
                        _fc_drag_tag: 'tableFormColumn',
                        _fc_id: 'show_project_name_col',
                        props: {label: t('projectName'), width: '200', required: true},
                        children: [{
                            type: 'input',
                            _fc_drag_tag: 'input',
                            _fc_id: 'show_project_name',
                            field: 'projectName',
                            title: t('projectName'),
                            props: {placeholder: t('projectName')},
                        }],
                    },
                    {
                        type: 'tableFormColumn',
                        _fc_drag_tag: 'tableFormColumn',
                        _fc_id: 'show_project_role_col',
                        props: {label: t('projectRole'), width: '150'},
                        children: [{
                            type: 'select',
                            _fc_drag_tag: 'select',
                            _fc_id: 'show_project_role',
                            field: 'role',
                            title: t('projectRole'),
                            options: [
                                {label: '负责人', value: 'leader'},
                                {label: '核心成员', value: 'core'},
                                {label: '参与者', value: 'member'},
                            ],
                        }],
                    },
                    {
                        type: 'tableFormColumn',
                        _fc_drag_tag: 'tableFormColumn',
                        _fc_id: 'show_project_duration_col',
                        props: {label: t('duration'), width: '220'},
                        children: [{
                            type: 'datePicker',
                            _fc_drag_tag: 'dateRange',
                            _fc_id: 'show_project_duration',
                            field: 'duration',
                            title: t('duration'),
                            props: {type: 'daterange', startPlaceholder: t('startDate'), endPlaceholder: t('endDate')},
                        }],
                    },
                ],
            },
            {
                type: 'group',
                _fc_drag_tag: 'group',
                _fc_id: 'show_members',
                field: 'members',
                title: t('members'),
                props: {title: t('memberIndex'), min: 1, max: 3, button: true, sortBtn: true},
                on: {
                    change: globalEventCall('onMemberChange', '{field: "members", value: $inject.args[0]}'),
                },
                children: [
                    {
                        type: 'input',
                        _fc_drag_tag: 'input',
                        _fc_id: 'show_member_name',
                        field: 'memberName',
                        title: t('memberName'),
                        props: {placeholder: t('memberNamePlaceholder')},
                    },
                    {
                        type: 'select',
                        _fc_drag_tag: 'select',
                        _fc_id: 'show_member_role',
                        field: 'memberRole',
                        title: t('memberRole'),
                        effect: optionGlobalData('occupations', 'options'),
                        options: [],
                    },
                ],
            },
            {
                type: 'subForm',
                _fc_drag_tag: 'subForm',
                _fc_id: 'show_approval',
                field: 'approval',
                title: t('approval'),
                props: {syncDisabled: true},
                on: {
                    change: globalEventCall('onApprovalChange', '{field: "approval", value: $inject.args[0]}'),
                },
                children: [
                    {
                        type: 'input',
                        _fc_drag_tag: 'input',
                        _fc_id: 'show_approval_owner',
                        field: 'owner',
                        title: t('approvalOwner'),
                        props: {placeholder: t('approvalOwnerPlaceholder')},
                    },
                    {
                        type: 'switch',
                        _fc_drag_tag: 'switch',
                        _fc_id: 'show_need_audit',
                        field: 'needAudit',
                        title: t('needAudit'),
                        value: true,
                    },
                ],
            },
            {
                type: 'fcEditor',
                _fc_drag_tag: 'fcEditor',
                _fc_id: 'show_rich_text',
                field: 'richText',
                title: t('richText'),
                value: '<p>Use <strong>fcEditor</strong> for rich content.</p>',
            },
            {
                type: 'upload',
                _fc_drag_tag: 'upload',
                _fc_id: 'show_attachments',
                field: 'attachments',
                title: t('attachments'),
                props: {action: '#', listType: 'text', multiple: true, limit: 3},
            },
            {
                type: 'signaturePad',
                _fc_drag_tag: 'signaturePad',
                _fc_id: 'show_signature',
                field: 'signature',
                title: t('signature'),
                props: {penColor: '#000000'},
            },
        ],
    };
}

function dialogDrawerTab(t) {
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_dialog_drawer',
        props: {label: t('dialogDrawerTab')},
        children: [
            alertRule('show_alert_dialog', t('dialogAlert')),
            row('show_row_dialog_btns', [
                col('show_col_dialog_btn', 12, {
                    type: 'elButton',
                    _fc_drag_tag: 'elButton',
                    _fc_id: 'show_open_dialog_btn',
                    props: {type: 'primary', size: 'default'},
                    on: {
                        click: dialogDrawerEventCall('onOpenDialog', 'showDialog', true, 'dialogBtn'),
                    },
                    children: [t('openDialogBtn')],
                }),
                col('show_col_drawer_btn', 12, {
                    type: 'elButton',
                    _fc_drag_tag: 'elButton',
                    _fc_id: 'show_open_drawer_btn',
                    props: {type: 'success', size: 'default'},
                    on: {
                        click: dialogDrawerEventCall('onOpenDrawer', 'showDrawer', true, 'drawerBtn'),
                    },
                    children: [t('openDrawerBtn')],
                }),
            ]),
            {
                type: 'fcDialog',
                _fc_drag_tag: 'fcDialog',
                _fc_id: 'show_dialog',
                field: 'showDialog',
                name: 'showDialog',
                value: false,
                props: {
                    title: t('dialogTitle'),
                    width: '50%',
                    closeOnClickModal: true,
                    showClose: true,
                    draggable: true,
                    appendToBody: true,
                },
                effect: {
                    fetch: '',
                },
                on: {
                    close: dialogDrawerEventCall('onCloseDialog', 'showDialog', false, 'dialogClose'),
                },
                style: {width: '100%'},
                children: [
                    {
                        type: 'input',
                        _fc_drag_tag: 'input',
                        _fc_id: 'show_dialog_field',
                        field: 'dialogInput',
                        title: t('dialogField'),
                        props: {placeholder: t('dialogFieldPlaceholder')},
                    },
                    {
                        type: 'elButton',
                        _fc_drag_tag: 'elButton',
                        _fc_id: 'show_close_dialog_btn',
                        props: {type: 'primary', plain: true, size: 'default'},
                        on: {
                            click: dialogDrawerEventCall('onCloseDialog', 'showDialog', false, 'dialogInnerBtn'),
                        },
                        children: [t('closeDialogBtn')],
                    },
                ],
            },
            {
                type: 'fcDrawer',
                _fc_drag_tag: 'fcDrawer',
                _fc_id: 'show_drawer',
                field: 'showDrawer',
                name: 'showDrawer',
                value: false,
                props: {
                    title: t('drawerContent'),
                    size: '30%',
                    direction: 'rtl',
                    showClose: true,
                    appendToBody: true,
                },
                effect: {
                    fetch: '',
                },
                on: {
                    close: dialogDrawerEventCall('onCloseDrawer', 'showDrawer', false, 'drawerClose'),
                },
                style: {width: '100%'},
                children: [
                    {
                        type: 'input',
                        _fc_drag_tag: 'input',
                        _fc_id: 'show_drawer_field',
                        field: 'drawerInput',
                        title: t('drawerField'),
                        props: {placeholder: t('drawerFieldPlaceholder')},
                    },
                    {
                        type: 'elButton',
                        _fc_drag_tag: 'elButton',
                        _fc_id: 'show_close_drawer_btn',
                        props: {type: 'success', plain: true, size: 'default'},
                        on: {
                            click: dialogDrawerEventCall('onCloseDrawer', 'showDrawer', false, 'drawerInnerBtn'),
                        },
                        children: [t('closeDrawerBtn')],
                    },
                ],
            },
        ],
    };
}

function makeTableData(t) {
    const cities = [t('dtCityBJ'), t('dtCitySH'), t('dtCityGZ')];
    const statuses = [t('dtStatusActive'), t('dtStatusLeft')];
    const grades = ['A', 'B', 'C'];
    return TABLE_NAMES.map((name, i) => ({
        id: i + 1,
        avatar: i === 2 ? '' : TABLE_AVATAR,
        name,
        city: cities[i % cities.length],
        status: statuses[i % 2],
        grade: grades[i % grades.length],
    }));
}

function dataTableTab(t) {
    const cityOptions = [t('dtCityBJ'), t('dtCitySH'), t('dtCityGZ')].map(c => ({label: c, value: c}));
    const statusOptions = [t('dtStatusActive'), t('dtStatusLeft')].map(s => ({label: s, value: s}));
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_data_table',
        props: {label: t('dataTableTab')},
        children: [
            alertRule('show_alert_data_table', t('dtAlert')),
            {
                type: 'fcDataTable',
                _fc_drag_tag: 'fcDataTable',
                _fc_id: 'show_data_table',
                field: 'employeeTable',
                title: t('dtTitle'),
                value: makeTableData(t),
                props: {
                    columns: [
                        {prop: 'id', label: t('dtColId'), width: '70', filter: '', className: '', sort: 'normal', overflow: '', fixed: '', align: 'center', render: 'normal', hide: false},
                        {prop: 'avatar', label: t('dtColAvatar'), width: '90', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'image', hide: false},
                        {prop: 'name', label: t('dtColName'), width: '', filter: '', className: '', sort: 'normal', overflow: '', fixed: '', align: 'left', render: 'link', hide: false},
                        {prop: 'city', label: t('dtColCity'), width: '120', filter: {type: 'static', options: cityOptions, fetch: {}, global: ''}, className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'normal', hide: false},
                        {prop: 'status', label: t('dtColStatus'), width: '110', filter: {type: 'static', options: statusOptions, fetch: {}, global: ''}, className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'tag', hide: false},
                        {prop: 'grade', label: t('dtColGrade'), width: '110', filter: {type: 'global', options: [], fetch: {}, global: 'tableGrades'}, className: '', sort: 'normal', overflow: '', fixed: '', align: 'center', render: 'normal', hide: false},
                    ],
                    actions: [
                        {id: 'view', label: t('dtActionView'), type: 'primary', size: 'small', decorate: ['text'], hide: false, disabledFn: '', hiddenFn: '', clickFn: wrapFn('function(row, index, action, context){ console.log("[view]", row, context.api, context.tableRef); return row; }')},
                        {id: 'edit', label: t('dtActionEdit'), type: 'warning', size: 'small', decorate: ['text'], hide: false, disabledFn: wrapFn('function(row){ return row.status === ' + JSON.stringify(t('dtStatusLeft')) + '; }'), hiddenFn: '', successMessage: t('dtActionSaved'), clickFn: wrapFn('function(row, index, action, context){ return new Promise(function(resolve){ setTimeout(function(){ console.log("[edit]", row, context.selectedRows); resolve(row); }, 900); }); }')},
                        {id: 'del', label: t('dtActionDelete'), type: 'danger', size: 'small', decorate: ['text'], hide: false, confirm: t('dtActionDeleteConfirm'), successMessage: t('dtActionDeleted'), disabledFn: '', hiddenFn: '', clickFn: wrapFn('function(row, index, action, context){ console.log("[delete]", row, context.selectedRows); return row.id; }')},
                        {id: 'fail', label: t('dtActionFail'), type: 'danger', size: 'small', decorate: ['text'], hide: false, errorMessage: t('dtActionFailed'), disabledFn: '', hiddenFn: '', clickFn: wrapFn('function(){ return Promise.reject(new Error("expected example failure")); }')},
                    ],
                    actionLabel: '',
                    actionWidth: '300',
                    actionFixed: 'right',
                    border: true,
                    stripe: true,
                    size: 'default',
                    showIndex: true,
                    selection: true,
                    highlightCurrentRow: true,
                    pagination: true,
                    pageSize: 5,
                    height: '',
                    maxHeight: '',
                    emptyText: t('dtEmpty'),
                    rowKey: 'id',
                },
                effect: {fetch: ''},
                on: {
                    selectionChange: globalEventCall('onTableSelection', '{rows: $inject.args[0]}'),
                    sortChange: globalEventCall('onDataRefresh', '{source: "tableSort", sort: $inject.args[0]}'),
                    filterChange: globalEventCall('onDataRefresh', '{source: "tableFilter", filter: $inject.args[0]}'),
                    pageChange: globalEventCall('onTablePage', '{page: $inject.args[0]}'),
                    rowClick: globalEventCall('onTableRowClick', '{row: $inject.args[0]}'),
                    linkClick: globalEventCall('onTableLinkClick', '{row: $inject.args[0], prop: $inject.args[1]}'),
                    actionClick: globalEventCall('onTableActionClick', '{payload: $inject.args[0]}'),
                    actionSuccess: globalEventCall('onTableActionSuccess', '{payload: $inject.args[0]}'),
                    actionError: globalEventCall('onTableActionError', '{payload: $inject.args[0]}'),
                    actionFinally: globalEventCall('onTableActionFinally', '{payload: $inject.args[0]}'),
                },
                style: {width: '100%'},
            },
            alertRule('show_alert_online_global_data_table', t('dtGlobalDataAlert'), 'success'),
            row('show_online_global_controls', [
                col('show_online_global_select_col', 16, {
                    type: 'select',
                    _fc_drag_tag: 'select',
                    _fc_id: 'show_online_todo_select',
                    field: 'onlineTodoSelect',
                    title: t('dtGlobalDataSelect'),
                    effect: optionGlobalData('onlineTodoOptions', 'options'),
                    options: [],
                    props: {placeholder: t('dtGlobalDataSelectPlaceholder'), clearable: true, filterable: true},
                }),
                col('show_online_global_button_col', 8, {
                    type: 'elButton',
                    _fc_drag_tag: 'elButton',
                    _fc_id: 'show_online_global_refresh',
                    props: {type: 'primary', size: 'default'},
                    on: {
                        click: globalEventCall('onRefreshGlobalTodos', '{source: "onlineGlobalTodoButton", time: Date.now()}'),
                    },
                    children: [t('dtGlobalDataRefresh')],
                }),
            ]),
            {
                type: 'fcDataTable',
                _fc_drag_tag: 'fcDataTable',
                _fc_id: 'show_online_global_data_table',
                field: 'onlineTodoTable',
                title: t('dtGlobalDataTitle'),
                effect: optionGlobalData('onlineTodoRows', 'props.data'),
                props: {
                    data: [],
                    columns: [
                        {prop: 'id', label: t('dtColId'), width: '80', filter: '', className: '', sort: 'normal', overflow: '', fixed: '', align: 'center', render: 'normal', hide: false},
                        {prop: 'title', label: t('dtColTaskTitle'), width: '', filter: '', className: '', sort: '', overflow: 'tooltip', fixed: '', align: 'left', render: 'normal', hide: false},
                        {prop: 'userId', label: t('dtColUser'), width: '100', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'normal', hide: false},
                        {prop: 'completed', label: t('dtColCompleted'), width: '120', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'tag', hide: false},
                    ],
                    actions: [],
                    actionLabel: '',
                    actionWidth: '',
                    actionFixed: '',
                    border: true,
                    stripe: true,
                    size: 'default',
                    showIndex: false,
                    selection: false,
                    highlightCurrentRow: true,
                    pagination: false,
                    remotePagination: false,
                    pageSize: 5,
                    total: 0,
                    height: '',
                    maxHeight: '',
                    emptyText: t('dtEmpty'),
                    rowKey: 'id',
                },
                on: {
                    rowClick: globalEventCall('onTableRowClick', '{row: $inject.args[0], source: "onlineTodoTable"}'),
                },
                style: {width: '100%', marginBottom: '20px'},
            },
            {
                type: 'fcDataTable',
                _fc_drag_tag: 'fcDataTable',
                _fc_id: 'show_cursor_data_table',
                field: 'cursorTodoTable',
                title: t('dtCursorTitle'),
                props: {
                    data: [],
                    columns: [
                        {prop: 'id', label: t('dtColId'), width: '80', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'normal', hide: false},
                        {prop: 'title', label: t('dtColTaskTitle'), width: '', filter: '', className: '', sort: '', overflow: 'tooltip', fixed: '', align: 'left', render: 'normal', hide: false},
                        {prop: 'userId', label: t('dtColUser'), width: '100', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'normal', hide: false},
                        {prop: 'completed', label: t('dtColCompleted'), width: '120', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'tag', hide: false},
                    ],
                    actions: [
                        {id: 'view', label: t('dtActionView'), type: 'primary', size: 'small', decorate: ['text'], hide: false, disabledFn: '', hiddenFn: '', clickFn: wrapFn('function(row){ console.log("[cursor-view]", row); }')},
                    ],
                    actionLabel: '',
                    actionWidth: '100',
                    actionFixed: 'right',
                    border: true,
                    stripe: true,
                    size: 'default',
                    showIndex: false,
                    selection: false,
                    highlightCurrentRow: true,
                    pagination: false,
                    remotePagination: false,
                    pageSize: 5,
                    total: 0,
                    cursorPagination: {
                        enabled: true,
                        preset: 'offsetLimit',
                        autoLoad: true,
                        fetch: cursorTodosFetchConfig(t),
                        request: {
                            cursorPath: 'query._start',
                            pageSizePath: 'query._limit',
                            pageSize: 5,
                            initialCursor: '',
                            emptyCursorBehavior: 'omit',
                        },
                        response: {
                            rowsPath: 'rows',
                            nextCursorPath: 'next_cursor',
                            hasMorePath: 'has_more',
                            prevCursorPath: '',
                            totalPath: '',
                        },
                        labels: {
                            prev: '',
                            next: '',
                        },
                    },
                    height: '',
                    maxHeight: '',
                    emptyText: t('dtEmpty'),
                    rowKey: 'id',
                },
                effect: {fetch: ''},
                on: {
                    cursorPageChange: globalEventCall('onTablePage', '{cursor: $inject.args[0]}'),
                    rowClick: globalEventCall('onTableRowClick', '{row: $inject.args[0]}'),
                },
                style: {width: '100%', marginTop: '20px'},
            },
        ],
    };
}

function practiceTab(t) {
    return {
        type: 'elTabPane',
        _fc_drag_tag: 'elTabPane',
        _fc_id: 'show_tab_practice',
        props: {label: t('practiceTab')},
        children: [
            {
                type: 'html',
                _fc_drag_tag: 'html',
                _fc_id: 'show_capability_guide',
                title: '',
                native: true,
                htmlPreview: true,
                attrs: {innerHTML: ''},
                style: {display: 'block', width: '100%'},
                children: [makeCapabilityGuideHtml(t)],
            },
        ],
    };
}

export function getShowcaseRule(lang = 'zh-cn') {
    const t = createTranslator(lang);

    return [{
        type: 'elTabs',
        _fc_drag_tag: 'elTabs',
        _fc_id: 'show_tabs',
        props: {type: 'border-card'},
        style: {width: '100%'},
        children: [
            basicTab(t),
            dataTab(t),
            codeChartTab(t),
            layoutTab(t),
            advancedTab(t),
            dialogDrawerTab(t),
            dataTableTab(t),
            practiceTab(t),
        ],
    }];
}

export function getShowcaseLanguage() {
    return clone(SHOWCASE_LANGUAGE);
}

export function getShowcaseOption(lang = 'zh-cn') {
    const t = createTranslator(lang);

    return {
        form: {
            labelWidth: '125px',
        },
        _globalData: {
            _items: getGlobalDataItems(t),
        },
        _event: {
            ...getCustomEvents(t),
            onSubmit: '',
            onReset: '',
            beforeSubmit: '',
            onCreated: '',
            onMounted: '',
            onReload: '',
            onChange: wrapFn('function onChange(field, value){ console.log("[表单字段变化]", field, value); }'),
            beforeFetch: wrapFn('function beforeFetch(config){ console.log("[请求前]", config && config.action); return config; }'),
        },
        language: getShowcaseLanguage(),
    };
}
