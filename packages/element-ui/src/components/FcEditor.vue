<template>
    <div class="fc-editor-wrapper" :class="{'fc-editor-hide-toolbar': hideToolbar}">
        <BaseEditor
            v-bind="$attrs"
            :model-value="modelValue"
            :init="init"
            :disabled="disabled"
            :config="config"
            @update:modelValue="value => $emit('update:modelValue', value)"
        />
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import BaseEditor from '@form-create/component-wangeditor';

export default defineComponent({
    name: 'fcEditor',
    components: {BaseEditor},
    inheritAttrs: false,
    emits: ['update:modelValue'],
    props: {
        modelValue: String,
        init: Function,
        disabled: Boolean,
        config: Object,
        hideToolbar: {
            type: Boolean,
            default: false,
        },
    },
});
</script>

<style>
.fc-editor-wrapper.fc-editor-hide-toolbar .w-e-toolbar {
    display: none !important;
}

.fc-editor-wrapper.fc-editor-hide-toolbar .w-e-text-container {
    border: none !important;
    border-top: none !important;
    height: fit-content !important;
}
</style>
