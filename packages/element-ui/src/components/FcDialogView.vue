<template>
    <div class="_fc-dialog" :class="{'_fc-child-empty' : !$slots.default}">
        <div class="_fc-dialog-header" v-if="showClose !== false || title">
            <span class="_fc-dialog-title">{{ title }}</span>
            <span v-if="showClose !== false" class="_fc-dialog-close">&#x2715;</span>
        </div>
        <div class="_fc-dialog-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'fcDialog',
    inheritAttrs: false,
    props: {
        title: String,
        showClose: {type: Boolean, default: true},
    },
});
</script>

<style>
._fc-dialog {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
    position: relative;
    min-height: 90px;
}

._fc-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e4e7ed;
}

._fc-dialog-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
}

._fc-dialog-close {
    color: #909399;
    cursor: pointer;
    font-size: 14px;
}

._fc-dialog-body {
    padding: 16px;
    min-height: 60px;
}
</style>
