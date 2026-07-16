<template>
    <div class="_dtc-trigger">
        <el-button size="small" @click="openEditor">
            {{ t('dataTableColumns.title') }}
            <span class="_dtc-count">{{ list.length }}</span>
        </el-button>
        <el-dialog class="_dtc-dialog" :title="t('dataTableColumns.title')" v-model="visible"
                   destroy-on-close append-to-body :close-on-click-modal="false" width="1100px">
            <div class="_dtc">
                <div class="_dtc-scroll">
                    <div class="_dtc-head _dtc-row">
                <div class="_dtc-cell _dtc-drag-col"></div>
                <div class="_dtc-cell _dtc-idx">#</div>
                <div class="_dtc-cell _dtc-c-prop">{{ t('dataTableColumns.prop') }}</div>
                <div class="_dtc-cell _dtc-c-label _dtc-required">{{ t('dataTableColumns.label') }}</div>
                <div class="_dtc-cell _dtc-c-width">{{ t('dataTableColumns.width') }}</div>
                <div class="_dtc-cell _dtc-c-filter">{{ t('dataTableColumns.filter') }}</div>
                <div class="_dtc-cell _dtc-c-class">{{ t('dataTableColumns.className') }}</div>
                <div class="_dtc-cell _dtc-c-sort">{{ t('dataTableColumns.sort') }}</div>
                <div class="_dtc-cell _dtc-c-overflow">{{ t('dataTableColumns.overflow') }}</div>
                <div class="_dtc-cell _dtc-c-fixed">{{ t('dataTableColumns.fixed') }}</div>
                <div class="_dtc-cell _dtc-c-align">{{ t('dataTableColumns.align') }}</div>
                <div class="_dtc-cell _dtc-c-render">{{ t('dataTableColumns.render') }}</div>
                <div class="_dtc-cell _dtc-c-hide">{{ t('dataTableColumns.hide') }}</div>
                <div class="_dtc-cell _dtc-op">{{ t('dataTableColumns.operation') }}</div>
            </div>
            <draggable :list="editingList" handle="._dtc-handle" item-key="_id" :animation="150">
                <template #item="{element, index}">
                    <div class="_dtc-row">
                        <div class="_dtc-cell _dtc-drag-col">
                            <i class="fc-icon icon-drag _dtc-handle"></i>
                        </div>
                        <div class="_dtc-cell _dtc-idx">{{ index + 1 }}</div>
                        <div class="_dtc-cell _dtc-c-prop">
                            <el-select v-model="element.prop" filterable allow-create default-first-option clearable
                                       size="small" :placeholder="t('dataTableColumns.placeholder')">
                                <el-option v-for="opt in fieldOptions" :key="opt" :label="opt" :value="opt"/>
                            </el-select>
                        </div>
                        <div class="_dtc-cell _dtc-c-label">
                            <el-input v-model="element.label" size="small"
                                      :placeholder="t('dataTableColumns.placeholder')"/>
                        </div>
                        <div class="_dtc-cell _dtc-c-width">
                            <el-input v-model="element.width" size="small"/>
                        </div>
                        <div class="_dtc-cell _dtc-c-filter">
                            <DataTableFilter v-model="element.filter"/>
                        </div>
                        <div class="_dtc-cell _dtc-c-class">
                            <el-input v-model="element.className" size="small"/>
                        </div>
                        <div class="_dtc-cell _dtc-c-sort">
                            <el-select v-model="element.sort" size="small"
                                       :placeholder="t('dataTableColumns.placeholder')">
                                <el-option v-for="opt in sortOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                            </el-select>
                        </div>
                        <div class="_dtc-cell _dtc-c-overflow">
                            <el-select v-model="element.overflow" size="small"
                                       :placeholder="t('dataTableColumns.placeholder')">
                                <el-option v-for="opt in overflowOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                            </el-select>
                        </div>
                        <div class="_dtc-cell _dtc-c-fixed">
                            <el-select v-model="element.fixed" clearable size="small"
                                       :placeholder="t('dataTableColumns.placeholder')">
                                <el-option v-for="opt in fixedOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                            </el-select>
                        </div>
                        <div class="_dtc-cell _dtc-c-align">
                            <el-select v-model="element.align" clearable size="small"
                                       :placeholder="t('dataTableColumns.placeholder')">
                                <el-option v-for="opt in alignOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                            </el-select>
                        </div>
                        <div class="_dtc-cell _dtc-c-render">
                            <el-select v-model="element.render" size="small"
                                       :placeholder="t('dataTableColumns.placeholder')">
                                <el-option v-for="opt in renderOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                            </el-select>
                        </div>
                        <div class="_dtc-cell _dtc-c-hide">
                            <el-switch v-model="element.hide"/>
                        </div>
                        <div class="_dtc-cell _dtc-op">
                            <i class="fc-icon icon-delete _dtc-del" @click="delRow(index)"></i>
                        </div>
                    </div>
                </template>
                    </draggable>
                </div>
                <div class="_dtc-handle-bar">
                    <el-button link type="primary" @click="addRow">
                        <i class="fc-icon icon-add"></i> {{ t('dataTableColumns.add') }}
                    </el-button>
                </div>
            </div>
            <template #footer>
                <el-button @click="cancelEditor">{{ t('props.cancel') }}</el-button>
                <el-button type="primary" @click="confirmEditor">{{ t('props.ok') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import draggable from 'vuedraggable/src/vuedraggable';
import uniqueId from '@form-create/utils/lib/unique';
import DataTableFilter from './DataTableFilter.vue';
import errorMessage from '../utils/message';

function normalizeFilter(source) {
    if (source && typeof source === 'object') {
        return {
            ...source,
            type: source.type || '',
            options: Array.isArray(source.options) ? source.options : [],
            fetch: source.fetch && typeof source.fetch === 'object' ? source.fetch : {},
            global: typeof source.global === 'string' ? source.global : '',
        };
    }
    return {type: '', options: [], fetch: {}, global: ''};
}

function makeColumn(source = {}) {
    return {
        ...source,
        _id: uniqueId(),
        prop: source.prop ?? '',
        label: source.label ?? '',
        width: source.width ?? '',
        filter: normalizeFilter(source.filter),
        className: source.className || '',
        sort: source.sort || '',
        overflow: source.overflow || '',
        fixed: source.fixed || '',
        align: source.align || '',
        render: source.render || 'normal',
        hide: !!source.hide,
    };
}

export default defineComponent({
    name: 'DataTableColumns',
    components: {draggable, DataTableFilter},
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
    },
    inject: ['designer'],
    data() {
        return {
            visible: false,
            list: (this.modelValue || []).map(makeColumn),
            editingList: [],
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        fieldOptions() {
            try {
                const data = this.designer.setupState.activeRule?.props?.data;
                if (Array.isArray(data) && data.length && data[0] && typeof data[0] === 'object') {
                    return Object.keys(data[0]);
                }
            } catch (e) {
                // ignore
            }
            return [];
        },
        sortOptions() {
            return [
                {label: this.t('dataTableColumns.sortType.none'), value: ''},
                {label: this.t('dataTableColumns.sortType.normal'), value: 'normal'},
                {label: this.t('dataTableColumns.sortType.remote'), value: 'custom'},
            ];
        },
        overflowOptions() {
            return [
                {label: this.t('dataTableColumns.overflowType.default'), value: ''},
                {label: this.t('dataTableColumns.overflowType.tooltip'), value: 'tooltip'},
            ];
        },
        fixedOptions() {
            return [
                {label: this.t('dataTableColumns.fixedType.normal'), value: 'normal'},
                {label: this.t('dataTableColumns.fixedType.left'), value: 'left'},
                {label: this.t('dataTableColumns.fixedType.right'), value: 'right'},
            ];
        },
        alignOptions() {
            return [
                {label: this.t('dataTableColumns.alignType.left'), value: 'left'},
                {label: this.t('dataTableColumns.alignType.center'), value: 'center'},
                {label: this.t('dataTableColumns.alignType.right'), value: 'right'},
            ];
        },
        renderOptions() {
            return [
                {label: this.t('dataTableColumns.renderType.normal'), value: 'normal'},
                {label: this.t('dataTableColumns.renderType.tag'), value: 'tag'},
                {label: this.t('dataTableColumns.renderType.link'), value: 'link'},
                {label: this.t('dataTableColumns.renderType.image'), value: 'image'},
            ];
        },
    },
    watch: {
        modelValue(v) {
            this.list = (v || []).map(makeColumn);
            if (!this.visible) {
                this.editingList = [];
            }
        },
    },
    methods: {
        clean() {
            return this.editingList.map(item => {
                const column = {...item};
                delete column._id;
                return column;
            });
        },
        openEditor() {
            this.editingList = this.list.map(makeColumn);
            this.visible = true;
        },
        cancelEditor() {
            this.visible = false;
            this.editingList = [];
        },
        validate() {
            const index = this.editingList.findIndex(column => !String(column.label ?? '').trim());
            if (index > -1) {
                errorMessage(`${index + 1}: ${this.t('dataTableColumns.requiredError')}`);
                return false;
            }
            this.editingList.forEach(column => {
                column.label = String(column.label).trim();
            });
            return true;
        },
        confirmEditor() {
            if (!this.validate()) {
                return;
            }
            const value = this.clean();
            this.list = value.map(makeColumn);
            this.$emit('update:modelValue', value);
            this.$emit('change', value);
            this.visible = false;
            this.editingList = [];
        },
        addRow() {
            this.editingList.push(makeColumn());
        },
        delRow(idx) {
            this.editingList.splice(idx, 1);
        },
    },
});
</script>

<style>
._dtc {
    width: 100%;
}

._dtc-scroll {
    width: 100%;
    overflow-x: auto;
}

._dtc-row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    min-width: max-content;
    padding: 3px 0;
}

._dtc-head {
    font-weight: 500;
    color: #606266;
    padding-bottom: 6px;
}

._dtc-cell {
    flex: 0 0 auto;
    padding: 0 4px;
    box-sizing: border-box;
}

._dtc-drag-col {
    width: 30px;
    text-align: center;
}

._dtc-handle {
    cursor: move;
    color: #c0c4cc;
}

._dtc-idx {
    width: 36px;
    text-align: center;
    color: #909399;
}

._dtc-c-prop {
    width: 140px;
}

._dtc-c-label {
    width: 140px;
}

._dtc-c-width {
    width: 90px;
}

._dtc-c-filter {
    width: 130px;
}

._dtc-c-class {
    width: 110px;
}

._dtc-c-sort {
    width: 120px;
}

._dtc-c-overflow {
    width: 120px;
}

._dtc-c-fixed {
    width: 110px;
}

._dtc-c-align {
    width: 110px;
}

._dtc-c-render {
    width: 110px;
}

._dtc-c-hide {
    width: 60px;
    text-align: center;
}

._dtc-op {
    width: 56px;
    text-align: center;
}

._dtc-required:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

._dtc-del {
    cursor: pointer;
    color: #909399;
}

._dtc-del:hover {
    color: #f56c6c;
}

._dtc-handle-bar {
    padding-top: 6px;
}

._dtc-empty {
    padding: 10px;
    color: #999;
    text-align: center;
}

._dtc-count {
    display: inline-block;
    min-width: 16px;
    padding: 0 5px;
    margin-left: 4px;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
    background: #409eff;
    border-radius: 8px;
}
</style>
