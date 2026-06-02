<template>
    <div class="_dtf">
        <el-badge type="warning" is-dot :hidden="!configured">
            <el-button size="small" @click="open">{{ t('dataTableFilter.title') }}</el-button>
        </el-badge>
        <el-dialog class="_dtf-dialog" :title="t('dataTableFilter.title')" v-model="visible"
                   destroy-on-close append-to-body :close-on-click-modal="false" width="640px">
            <el-form label-width="80px" size="default">
                <el-form-item :label="t('dataTableFilter.source')">
                    <el-radio-group v-model="local.type">
                        <el-radio-button label="static">{{ t('fetch.optionsType.struct') }}</el-radio-button>
                        <el-radio-button label="fetch">{{ t('fetch.optionsType.fetch') }}</el-radio-button>
                        <el-radio-button label="global">{{ t('fetch.optionsType.global') }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <template v-if="local.type === 'static'">
                    <el-form-item :label="t('dataTableFilter.options')">
                        <div class="_dtf-static">
                            <div class="_dtf-static-row _dtf-static-head">
                                <span class="_dtf-static-cell">{{ t('dataTableFilter.label') }}</span>
                                <span class="_dtf-static-cell">{{ t('dataTableFilter.value') }}</span>
                                <span class="_dtf-static-op"></span>
                            </div>
                            <div v-for="(opt, i) in local.options" :key="i" class="_dtf-static-row">
                                <el-input class="_dtf-static-cell" v-model="opt.label" size="small"
                                          :placeholder="t('dataTableFilter.label')"/>
                                <el-input class="_dtf-static-cell" v-model="opt.value" size="small"
                                          :placeholder="t('dataTableFilter.value')"/>
                                <i class="fc-icon icon-delete _dtf-static-del" @click="delOption(i)"></i>
                            </div>
                            <el-button link type="primary" @click="addOption">
                                <i class="fc-icon icon-add"></i> {{ t('dataTableFilter.add') }}
                            </el-button>
                        </div>
                    </el-form-item>
                </template>
                <template v-else-if="local.type === 'fetch'">
                    <el-form-item :label="t('fetch.optionsType.fetch')">
                        <FetchConfig v-model="local.fetch"/>
                    </el-form-item>
                </template>
                <template v-else-if="local.type === 'global'">
                    <el-form-item :label="t('fetch.optionsType.global')">
                        <GlobalDataSelect v-model="local.global"/>
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <el-button @click="visible = false">{{ t('props.cancel') }}</el-button>
                <el-button type="primary" @click="onOk">{{ t('props.ok') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import {deepCopy} from '@form-create/utils/lib/deepextend';
import FetchConfig from './FetchConfig.vue';
import GlobalDataSelect from './GlobalDataSelect.vue';

function normalize(source) {
    const v = (source && typeof source === 'object') ? source : {};
    return {
        type: v.type || '',
        options: Array.isArray(v.options) ? deepCopy(v.options) : [],
        fetch: v.fetch && typeof v.fetch === 'object' ? deepCopy(v.fetch) : {},
        global: typeof v.global === 'string' ? v.global : (v.global && v.global.name) || '',
    };
}

export default defineComponent({
    name: 'DataTableFilter',
    components: {FetchConfig, GlobalDataSelect},
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: {
            type: [Object, String],
            default: () => ({}),
        },
    },
    inject: ['designer'],
    data() {
        return {
            visible: false,
            local: normalize(this.modelValue),
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        configured() {
            const v = this.modelValue;
            return !!(v && typeof v === 'object' && v.type);
        },
    },
    watch: {
        'local.global'(v) {
            if (v && typeof v === 'object') {
                this.local.global = v.name || '';
            }
        },
    },
    methods: {
        open() {
            this.local = normalize(this.modelValue);
            this.visible = true;
        },
        addOption() {
            this.local.options.push({label: '', value: ''});
        },
        delOption(i) {
            this.local.options.splice(i, 1);
        },
        onOk() {
            const value = {
                type: this.local.type,
                options: this.local.type === 'static' ? this.local.options.filter(o => o.label !== '' || o.value !== '') : [],
                fetch: this.local.type === 'fetch' ? this.local.fetch : {},
                global: this.local.type === 'global'
                    ? (typeof this.local.global === 'object' ? (this.local.global.name || '') : this.local.global)
                    : '',
            };
            this.$emit('update:modelValue', value);
            this.$emit('change', value);
            this.visible = false;
        },
    },
});
</script>

<style>
._dtf, ._dtf .el-badge {
    width: 100%;
}

._dtf .el-button {
    width: 100%;
}

._dtf-static {
    width: 100%;
}

._dtf-static-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

._dtf-static-head {
    color: #909399;
    font-size: 12px;
}

._dtf-static-cell {
    flex: 1;
}

._dtf-static-op {
    width: 20px;
}

._dtf-static-del {
    width: 20px;
    cursor: pointer;
    color: #909399;
}

._dtf-static-del:hover {
    color: #f56c6c;
}
</style>
