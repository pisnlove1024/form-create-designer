<template>
    <main class="runtime-verification">
        <h1>FC Runtime Verification</h1>
        <p class="runtime-verification__intro">
            This page verifies the component registry, value binding, real component preview,
            JSON codec, and the complete fcDataTable action lifecycle without a LowCode host.
        </p>

        <section data-testid="component-registry">
            <h2>Component capability registry</h2>
            <div class="capability-grid">
                <article v-for="definition in definitions" :key="definition.type" class="capability-card">
                    <strong>{{ definition.type }}</strong>
                    <span>{{ definition.category }}</span>
                    <small>binding: {{ definition.binding.kind }}</small>
                    <small>capabilities: {{ capabilityNames(definition).join(', ') || 'none' }}</small>
                </article>
            </div>
        </section>

        <section data-testid="component-preview">
            <h2>Registry-driven real component previews</h2>
            <div class="preview-grid">
                <article class="preview-card">
                    <h3>none binding: fcTitle</h3>
                    <FcComponentPreview :rule="titlePreviewRule" :form-data="previewFormData"/>
                </article>
                <article class="preview-card">
                    <h3>hybrid binding: fcCodePreview</h3>
                    <FcComponentPreview :rule="previewRule" :form-data="previewFormData">
                        <template #fallback="{rule}">No preview for {{ rule.type }}</template>
                    </FcComponentPreview>
                </article>
                <article class="preview-card">
                    <h3>hybrid binding: fcChart</h3>
                    <FcComponentPreview
                        :rule="chartPreviewRule"
                        :form-data="previewFormData"
                        :component-props="{height: '260px'}"/>
                </article>
                <article class="preview-card">
                    <h3>hybrid binding: fcChart full ECharts option</h3>
                    <FcComponentPreview
                        :rule="fullOptionChartPreviewRule"
                        :form-data="previewFormData"
                        :component-props="{height: '260px'}"/>
                </article>
                <article class="preview-card">
                    <h3>third-party registration: fcExampleMetric</h3>
                    <FcComponentPreview :rule="metricPreviewRule" :form-data="previewFormData"/>
                </article>
            </div>
            <el-button size="small" @click="updatePreviewValue">Update bound model values</el-button>
            <pre data-testid="codec-state">round-trip type: {{ codecRoundTripType }}\n{{ codecJson }}</pre>
        </section>

        <section data-testid="runtime-table">
            <h2>fcDataTable action lifecycle</h2>
            <div class="verification-controls">
                <el-button size="small" @click="useModelRows = !useModelRows">
                    {{ useModelRows ? 'Use legacy props.data' : 'Use modelValue' }}
                </el-button>
                <el-button size="small" @click="executeViewAction">Call executeAction('view')</el-button>
                <el-button size="small" @click="showSelectedRows">Call getSelectedRows()</el-button>
                <el-button size="small" @click="probeAsyncLoading">Probe isActionLoading('async')</el-button>
                <el-button size="small" @click="events = []">Clear events</el-button>
            </div>
            <pre data-testid="runtime-method-result">{{ methodResult }}</pre>
            <FcDataTable
                ref="table"
                :model-value="useModelRows ? rows : undefined"
                :data="legacyRows"
                :columns="columns"
                :actions="runtimeActions"
                row-key="id"
                selection
                @actionClick="record('click', $event)"
                @actionSuccess="record('success', $event)"
                @actionError="record('error', $event)"
                @actionFinally="record('finally', $event)"/>
        </section>
        <pre data-testid="runtime-events">{{ events.join('\n') }}</pre>

        <section data-testid="action-designer">
            <h2>Transactional data table settings</h2>
            <h3>Columns</h3>
            <DataTableColumns v-model="designerColumns"/>
            <pre data-testid="designer-columns-state">{{ JSON.stringify(designerColumns) }}</pre>
            <h3>Actions</h3>
            <DataTableActions v-model="designerActions"/>
            <pre data-testid="designer-actions-state">{{ JSON.stringify(designerActions) }}</pre>
        </section>
    </main>
</template>

<script>
import {defineComponent} from 'vue';
import FcDataTable from '../src/components/FcDataTable.vue';
import DataTableActions from '../src/components/DataTableActions.vue';
import DataTableColumns from '../src/components/DataTableColumns.vue';
import FcComponentPreview from '../src/components/FcComponentPreview.vue';
import {componentDefinitions} from '../src/runtime/componentRegistry';
import {componentCodec} from '../src/runtime/codec';

const messages = {
    'dataTableActions.title': 'Configure actions',
    'dataTableActions.preview': 'Preview',
    'dataTableActions.id': 'ID',
    'dataTableActions.label': 'Label',
    'dataTableActions.type': 'Type',
    'dataTableActions.size': 'Size',
    'dataTableActions.decorate': 'Decorate',
    'dataTableActions.hide': 'Hide',
    'dataTableActions.confirm': 'Confirm',
    'dataTableActions.message': 'Messages',
    'dataTableActions.callback': 'Callbacks',
    'dataTableActions.operation': 'Operation',
    'dataTableActions.add': 'Add',
    'dataTableActions.placeholder': 'Select',
    'dataTableActions.successMessage': 'Success message',
    'dataTableActions.errorMessage': 'Error message',
    'dataTableActions.requiredError': 'ID and label are required',
    'dataTableActions.duplicateError': 'ID must be unique',
    'dataTableActions.callbackType.disabled': 'Disabled',
    'dataTableActions.callbackType.hidden': 'Hidden',
    'dataTableActions.callbackType.click': 'Click',
    'dataTableColumns.title': 'Configure columns',
    'dataTableColumns.prop': 'Field',
    'dataTableColumns.label': 'Label',
    'dataTableColumns.width': 'Width',
    'dataTableColumns.filter': 'Filter',
    'dataTableColumns.className': 'Class',
    'dataTableColumns.sort': 'Sort',
    'dataTableColumns.overflow': 'Overflow',
    'dataTableColumns.fixed': 'Fixed',
    'dataTableColumns.align': 'Align',
    'dataTableColumns.render': 'Render',
    'dataTableColumns.hide': 'Hide',
    'dataTableColumns.operation': 'Operation',
    'dataTableColumns.add': 'Add',
    'dataTableColumns.placeholder': 'Select',
    'dataTableColumns.requiredError': 'Column label is required',
    'props.cancel': 'Cancel',
    'props.ok': 'OK',
};

export default defineComponent({
    name: 'RuntimeVerification',
    components: {
        FcDataTable,
        DataTableActions,
        DataTableColumns,
        FcComponentPreview,
    },
    provide() {
        return {
            designer: {
                setupState: {
                    t: key => messages[key] || key.split('.').pop(),
                },
            },
        };
    },
    data() {
        return {
            definitions: componentDefinitions,
            previewRule: {
                type: 'fcCodePreview',
                field: 'previewCode',
                props: {
                    language: 'json',
                    chartName: 'Runtime-bound code preview',
                    chartDescription: 'Rendered through FcComponentPreview and resolved from formData.',
                    chartData: 'legacy fallback',
                    editable: false,
                    copyable: true,
                    formattable: true,
                },
            },
            previewFormData: {
                previewCode: JSON.stringify({source: 'modelValue', updated: 0}, null, 2),
                previewChart: {
                    category: ['A', 'B', 'C'],
                    series: [{name: 'modelValue', data: [3, 6, 9]}],
                },
                previewFullOptionChart: {
                    tooltip: {trigger: 'axis'},
                    dataset: {
                        source: [
                            ['month', 'Revenue', 'Cost'],
                            ['Jan', 120, 80],
                            ['Feb', 200, 110],
                            ['Mar', 150, 90],
                        ],
                    },
                    xAxis: {type: 'category'},
                    yAxis: {type: 'value'},
                    series: [{type: 'bar'}, {type: 'line', smooth: true}],
                },
                metric: 88,
            },
            titlePreviewRule: {
                type: 'fcTitle',
                props: {title: 'Registered FC title preview', size: 'h3'},
            },
            chartPreviewRule: {
                type: 'fcChart',
                field: 'previewChart',
                props: {
                    chartType: 'bar',
                    chartName: 'Model-bound chart',
                    chartDescription: 'formData wins over legacy props.chartData',
                    chartData: {
                        category: ['legacy'],
                        series: [{name: 'legacy fallback', data: [1]}],
                    },
                },
            },
            fullOptionChartPreviewRule: {
                type: 'fcChart',
                field: 'previewFullOptionChart',
                props: {
                    chartName: 'Full ECharts option',
                    chartDescription: 'dataset, axes, tooltip and mixed series are passed through unchanged.',
                },
            },
            metricPreviewRule: {
                type: 'fcExampleMetric',
                field: 'metric',
                props: {suffix: '%'},
            },
            rows: [{id: 1, name: 'Alpha'}, {id: 2, name: 'Beta'}],
            legacyRows: [{id: 99, name: 'Legacy fallback (hidden while modelValue exists)'}],
            useModelRows: true,
            columns: [{prop: 'id', label: 'ID'}, {prop: 'name', label: 'Name'}],
            events: [],
            methodResult: 'No method called yet.',
            designerActions: [{id: 'original', label: 'Original', custom: {keep: true}}],
            designerColumns: [{prop: 'name', label: 'Name', extension: {keep: true}}],
            runtimeActions: [
                {id: 'view', label: 'View', clickFn: row => row.id},
                {
                    id: 'async',
                    label: 'Async',
                    successMessage: 'Async complete',
                    clickFn: row => new Promise(resolve => setTimeout(() => resolve(row.id), 1200)),
                },
                {
                    id: 'fail',
                    label: 'Fail',
                    errorMessage: 'Expected failure',
                    clickFn: () => Promise.reject(new Error('expected verification failure')),
                },
                {id: 'delete', label: 'Delete', type: 'danger', confirm: true, clickFn: row => row.id},
            ],
        };
    },
    computed: {
        codecJson() {
            return componentCodec.serialize([this.previewRule], 2);
        },
        codecRoundTripType() {
            const rules = componentCodec.deserialize(this.codecJson);
            return rules[0] && rules[0].type;
        },
    },
    methods: {
        capabilityNames(definition) {
            return Object.keys(definition.capabilities).filter(name => definition.capabilities[name] === true);
        },
        updatePreviewValue() {
            const current = JSON.parse(this.previewFormData.previewCode);
            this.previewFormData = {
                ...this.previewFormData,
                previewCode: JSON.stringify({source: 'modelValue', updated: current.updated + 1}, null, 2),
                previewChart: {
                    category: ['A', 'B', 'C'],
                    series: [{name: 'modelValue', data: [3, 6, 9 + current.updated + 1]}],
                },
                metric: current.updated + 89,
            };
        },
        executeViewAction() {
            return this.$refs.table.executeAction('view', this.rows[0], 0);
        },
        showSelectedRows() {
            const selected = this.$refs.table.getSelectedRows();
            this.methodResult = `getSelectedRows() -> ${JSON.stringify(selected)}`;
        },
        probeAsyncLoading() {
            const table = this.$refs.table;
            const row = this.rows[0];
            const async = table.resolveAction('async');
            this.methodResult = `isActionLoading('async') before: ${table.isActionLoading(async, row, 0)}`;
            table.executeAction('async', row, 0);
            this.$nextTick(() => {
                this.methodResult = `isActionLoading('async') during: ${table.isActionLoading(async, row, 0)} (resolves after ~1.2s)`;
            });
        },
        record(name, payload) {
            this.events.push(`${name}:${payload.action.id}:${payload.row.id}`);
        },
    },
});
</script>

<style>
.runtime-verification {
    padding: 24px;
    color: #303133;
}

.runtime-verification section {
    margin-bottom: 24px;
    padding: 18px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
}

.runtime-verification h1,
.runtime-verification h2 {
    margin-top: 0;
}

.runtime-verification__intro {
    color: #606266;
}

.capability-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 10px;
}

.capability-card {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 6px;
}

.capability-card span,
.capability-card small {
    color: #606266;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
}

.preview-card {
    min-width: 0;
    padding: 12px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
}

.preview-card h3 {
    margin: 0 0 12px;
    font-size: 15px;
}

.verification-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.runtime-verification pre {
    margin-top: 12px;
    padding: 12px;
    overflow: auto;
    background: #f5f7fa;
    border-radius: 6px;
}
</style>
