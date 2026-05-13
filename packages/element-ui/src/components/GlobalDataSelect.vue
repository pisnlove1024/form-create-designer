<template>
    <el-select v-model="selectedValue" :placeholder="t('globalData.selectPlaceholder')" size="default"
               @change="onChange" style="width: 100%;">
        <el-option v-for="item in globalDataOptions" :key="item.name"
                   :label="item.name" :value="item.name">
            <span>{{ item.name }}</span>
            <el-tag size="small" :type="item.type === 'static' ? 'success' : 'primary'"
                    style="margin-left: 8px;" disable-transitions>
                {{ item.type === 'static' ? t('globalData.static') : t('globalData.fetch') }}
            </el-tag>
        </el-option>
        <template #empty>
            <div style="padding: 10px; color: #999; text-align: center;">{{ t('globalData.empty') }}</div>
        </template>
    </el-select>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'GlobalDataSelect',
    emits: ['update:modelValue'],
    props: {
        modelValue: [String, Object],
        to: {
            type: String,
            default: 'options'
        },
    },
    inject: ['designer'],
    data() {
        const val = this.modelValue;
        return {
            selectedValue: (val && typeof val === 'object') ? val.name || '' : (val || ''),
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        globalDataOptions() {
            const formOptions = this.designer.setupState.dragForm?.api?.getOption?.() || {};
            const globalData = formOptions._globalData || this.getGlobalDataFromDesigner();
            if (!globalData || !globalData._items) return [];
            return globalData._items;
        },
    },
    watch: {
        modelValue(v) {
            this.selectedValue = (v && typeof v === 'object') ? v.name || '' : (v || '');
        },
    },
    methods: {
        getGlobalDataFromDesigner() {
            try {
                const data = this.designer.setupState;
                const formOptions = data.formOptions || {};
                return formOptions._globalData || {};
            } catch (e) {
                return {};
            }
        },
        onChange(val) {
            this.$emit('update:modelValue', {name: val, to: this.to});
        },
    }
});
</script>
