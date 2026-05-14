<template>
    <el-dialog
        v-model="visible"
        :title="title"
        :width="width"
        :fullscreen="fullscreen"
        :top="top"
        :modal="modal"
        :append-to-body="appendToBody"
        :close-on-click-modal="closeOnClickModal"
        :close-on-press-escape="closeOnPressEscape"
        :show-close="showClose"
        :destroy-on-close="destroyOnClose"
        :draggable="draggable"
        :align-center="alignCenter"
        @open="onOpen"
        @opened="onOpened"
        @close="onClose"
        @closed="onClosed"
    >
        <slot></slot>
    </el-dialog>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'fcDialog',
    inheritAttrs: false,
    emits: ['update:modelValue', 'open', 'opened', 'close', 'closed'],
    props: {
        title: String,
        width: {type: String, default: '50%'},
        fullscreen: Boolean,
        top: String,
        modal: {type: Boolean, default: true},
        appendToBody: Boolean,
        closeOnClickModal: {type: Boolean, default: true},
        closeOnPressEscape: {type: Boolean, default: true},
        showClose: {type: Boolean, default: true},
        destroyOnClose: Boolean,
        draggable: Boolean,
        alignCenter: Boolean,
        modelValue: {type: Boolean, default: false},
    },
    computed: {
        visible: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
            }
        }
    },
    methods: {
        onOpen() {
            this.$emit('open');
        },
        onOpened() {
            this.$emit('opened');
        },
        onClose() {
            this.$emit('close');
        },
        onClosed() {
            this.$emit('closed');
        },
    }
});
</script>
