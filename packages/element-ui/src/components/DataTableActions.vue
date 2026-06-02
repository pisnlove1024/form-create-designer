<template>
    <div class="_dta-trigger">
        <el-button size="small" @click="visible = true">
            {{ t('dataTableActions.title') }}
            <span class="_dta-count">{{ list.length }}</span>
        </el-button>
        <el-dialog class="_dta-dialog" :title="t('dataTableActions.title')" v-model="visible"
                   destroy-on-close append-to-body :close-on-click-modal="false" width="1100px">
            <div class="_dta">
                <div class="_dta-scroll">
                    <div class="_dta-head _dta-row">
                        <div class="_dta-cell _dta-drag-col"></div>
                        <div class="_dta-cell _dta-idx">#</div>
                        <div class="_dta-cell _dta-c-preview">{{ t('dataTableActions.preview') }}</div>
                        <div class="_dta-cell _dta-c-id _dta-required">{{ t('dataTableActions.id') }}</div>
                        <div class="_dta-cell _dta-c-label _dta-required">{{ t('dataTableActions.label') }}</div>
                        <div class="_dta-cell _dta-c-type">{{ t('dataTableActions.type') }}</div>
                        <div class="_dta-cell _dta-c-size">{{ t('dataTableActions.size') }}</div>
                        <div class="_dta-cell _dta-c-decorate">{{ t('dataTableActions.decorate') }}</div>
                        <div class="_dta-cell _dta-c-hide">{{ t('dataTableActions.hide') }}</div>
                        <div class="_dta-cell _dta-c-callback">{{ t('dataTableActions.callback') }}</div>
                        <div class="_dta-cell _dta-op">{{ t('dataTableActions.operation') }}</div>
                    </div>
                    <draggable :list="list" handle="._dta-handle" item-key="_id" @end="emitChange" :animation="150">
                        <template #item="{element, index}">
                            <div class="_dta-row">
                                <div class="_dta-cell _dta-drag-col">
                                    <i class="fc-icon icon-drag _dta-handle"></i>
                                </div>
                                <div class="_dta-cell _dta-idx">{{ index + 1 }}</div>
                                <div class="_dta-cell _dta-c-preview">
                                    <el-button :type="element.type || undefined"
                                               :size="element.size || 'small'"
                                               :text="hasDecorate(element, 'text')"
                                               :round="hasDecorate(element, 'round')"
                                               :plain="hasDecorate(element, 'plain')"
                                               :disabled="hasDecorate(element, 'disabled')">
                                        {{ element.label || t('dataTableActions.preview') }}
                                    </el-button>
                                </div>
                                <div class="_dta-cell _dta-c-id">
                                    <el-input v-model="element.id" size="small"
                                              :placeholder="t('dataTableActions.placeholder')" @input="emitChange"/>
                                </div>
                                <div class="_dta-cell _dta-c-label">
                                    <el-input v-model="element.label" size="small"
                                              :placeholder="t('dataTableActions.placeholder')" @input="emitChange"/>
                                </div>
                                <div class="_dta-cell _dta-c-type">
                                    <el-select v-model="element.type" clearable size="small"
                                               :placeholder="t('dataTableActions.placeholder')" @change="emitChange">
                                        <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                                    </el-select>
                                </div>
                                <div class="_dta-cell _dta-c-size">
                                    <el-select v-model="element.size" clearable size="small"
                                               :placeholder="t('dataTableActions.placeholder')" @change="emitChange">
                                        <el-option v-for="opt in sizeOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                                    </el-select>
                                </div>
                                <div class="_dta-cell _dta-c-decorate">
                                    <el-select v-model="element.decorate" multiple collapse-tags clearable size="small"
                                               :placeholder="t('dataTableActions.placeholder')" @change="emitChange">
                                        <el-option v-for="opt in decorateOptions" :key="opt.value" :label="opt.label" :value="opt.value"/>
                                    </el-select>
                                </div>
                                <div class="_dta-cell _dta-c-hide">
                                    <el-switch v-model="element.hide" @change="emitChange"/>
                                </div>
                                <div class="_dta-cell _dta-c-callback">
                                    <FnInput v-model="element.disabledFn" :args="callbackArgs"
                                             :title="t('dataTableActions.callbackType.disabled')" @change="emitChange">
                                        {{ t('dataTableActions.callbackType.disabled') }}
                                    </FnInput>
                                    <FnInput v-model="element.hiddenFn" :args="callbackArgs"
                                             :title="t('dataTableActions.callbackType.hidden')" @change="emitChange">
                                        {{ t('dataTableActions.callbackType.hidden') }}
                                    </FnInput>
                                    <FnInput v-model="element.clickFn" :args="callbackArgs"
                                             :title="t('dataTableActions.callbackType.click')" @change="emitChange">
                                        {{ t('dataTableActions.callbackType.click') }}
                                    </FnInput>
                                </div>
                                <div class="_dta-cell _dta-op">
                                    <i class="fc-icon icon-delete _dta-del" @click="delRow(index)"></i>
                                </div>
                            </div>
                        </template>
                    </draggable>
                </div>
                <div class="_dta-handle-bar">
                    <el-button link type="primary" @click="addRow">
                        <i class="fc-icon icon-add"></i> {{ t('dataTableActions.add') }}
                    </el-button>
                </div>
            </div>
            <template #footer>
                <el-button @click="visible = false">{{ t('props.cancel') }}</el-button>
                <el-button type="primary" @click="visible = false">{{ t('props.ok') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import draggable from 'vuedraggable/src/vuedraggable';
import uniqueId from '@form-create/utils/lib/unique';
import FnInput from './FnInput.vue';

const FIELDS = ['id', 'label', 'type', 'size', 'decorate', 'hide', 'disabledFn', 'hiddenFn', 'clickFn'];

function makeAction(source = {}) {
    return {
        _id: uniqueId(),
        id: source.id || '',
        label: source.label || '',
        type: source.type || '',
        size: source.size || '',
        decorate: Array.isArray(source.decorate) ? source.decorate.slice() : [],
        hide: source.hide || false,
        disabledFn: source.disabledFn || '',
        hiddenFn: source.hiddenFn || '',
        clickFn: source.clickFn || '',
    };
}

export default defineComponent({
    name: 'DataTableActions',
    components: {draggable, FnInput},
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
            list: (this.modelValue || []).map(makeAction),
            oldValue: JSON.stringify(this.modelValue || []),
            callbackArgs: ['row', 'index'],
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        typeOptions() {
            return ['primary', 'success', 'warning', 'danger', 'info'].map(value => ({
                label: this.t('dataTableActions.typeOptions.' + value),
                value,
            }));
        },
        sizeOptions() {
            return ['large', 'default', 'small'].map(value => ({
                label: this.t('dataTableActions.sizeOptions.' + value),
                value,
            }));
        },
        decorateOptions() {
            return ['text', 'round', 'plain', 'disabled'].map(value => ({
                label: this.t('dataTableActions.decorateOptions.' + value),
                value,
            }));
        },
    },
    watch: {
        modelValue(v) {
            const str = JSON.stringify(v || []);
            if (str === this.oldValue) {
                return;
            }
            this.oldValue = str;
            this.list = (v || []).map(makeAction);
        },
    },
    methods: {
        hasDecorate(item, key) {
            return Array.isArray(item.decorate) && item.decorate.indexOf(key) > -1;
        },
        clean() {
            return this.list.map(item => {
                return FIELDS.reduce((act, key) => {
                    act[key] = item[key];
                    return act;
                }, {});
            });
        },
        emitChange() {
            const value = this.clean();
            this.oldValue = JSON.stringify(value);
            this.$emit('update:modelValue', value);
            this.$emit('change', value);
        },
        addRow() {
            this.list.push(makeAction());
            this.emitChange();
        },
        delRow(idx) {
            this.list.splice(idx, 1);
            this.emitChange();
        },
    },
});
</script>

<style>
._dta {
    width: 100%;
}

._dta-scroll {
    width: 100%;
    overflow-x: auto;
}

._dta-row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    min-width: max-content;
    padding: 3px 0;
}

._dta-head {
    font-weight: 500;
    color: #606266;
    padding-bottom: 6px;
}

._dta-cell {
    flex: 0 0 auto;
    padding: 0 4px;
    box-sizing: border-box;
}

._dta-drag-col {
    width: 30px;
    text-align: center;
}

._dta-handle {
    cursor: move;
    color: #c0c4cc;
}

._dta-idx {
    width: 36px;
    text-align: center;
    color: #909399;
}

._dta-c-preview {
    width: 110px;
}

._dta-c-id {
    width: 130px;
}

._dta-c-label {
    width: 130px;
}

._dta-c-type {
    width: 110px;
}

._dta-c-size {
    width: 110px;
}

._dta-c-decorate {
    width: 150px;
}

._dta-c-hide {
    width: 60px;
    text-align: center;
}

._dta-c-callback {
    width: 220px;
    display: flex;
    gap: 4px;
}

._dta-c-callback ._fd-fn-input {
    width: auto;
    flex: 1;
}

._dta-c-callback ._fd-fn-input .el-button {
    width: 100%;
    padding: 0 6px;
}

._dta-op {
    width: 56px;
    text-align: center;
}

._dta-required:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

._dta-del {
    cursor: pointer;
    color: #909399;
}

._dta-del:hover {
    color: #f56c6c;
}

._dta-handle-bar {
    padding-top: 6px;
}

._dta-count {
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
