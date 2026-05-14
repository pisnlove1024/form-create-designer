<template>
    <div class="_fc-drawer" :class="['_fc-drawer--' + direction, {'_fc-child-empty' : !$slots.default}]">
        <div class="_fc-drawer-header" v-if="withHeader !== false">
            <span class="_fc-drawer-title">{{ title }}</span>
            <span v-if="showClose !== false" class="_fc-drawer-close">&#x2715;</span>
        </div>
        <div class="_fc-drawer-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'fcDrawer',
    inheritAttrs: false,
    props: {
        title: String,
        direction: {type: String, default: 'rtl'},
        showClose: {type: Boolean, default: true},
        withHeader: {type: Boolean, default: true},
    },
});
</script>

<style>
._fc-drawer {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
    position: relative;
    min-height: 90px;
}

._fc-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e4e7ed;
}

._fc-drawer-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
}

._fc-drawer-close {
    color: #909399;
    cursor: pointer;
    font-size: 14px;
}

._fc-drawer-body {
    padding: 16px;
    min-height: 60px;
}
</style>
