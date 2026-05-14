<template>
    <el-drawer
        v-model="visible"
        :title="title"
        :size="size"
        :direction="direction"
        :modal="modal"
        :append-to-body="appendToBody"
        :close-on-click-modal="closeOnClickModal"
        :close-on-press-escape="closeOnPressEscape"
        :show-close="showClose"
        :destroy-on-close="destroyOnClose"
        :with-header="withHeader"
        @open="onOpen"
        @opened="onOpened"
        @close="onClose"
        @closed="onClosed"
    >
        <slot></slot>
    </el-drawer>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'fcDrawer',
    inheritAttrs: false,
    emits: ['update:modelValue', 'open', 'opened', 'close', 'closed'],
    props: {
        title: String,
        size: {type: String, default: '30%'},
        direction: {type: String, default: 'rtl'},
        modal: {type: Boolean, default: true},
        appendToBody: Boolean,
        closeOnClickModal: {type: Boolean, default: true},
        closeOnPressEscape: {type: Boolean, default: true},
        showClose: {type: Boolean, default: true},
        destroyOnClose: Boolean,
        withHeader: {type: Boolean, default: true},
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
