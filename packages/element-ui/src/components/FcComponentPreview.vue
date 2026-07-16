<template>
    <component v-if="definition && canPreview" :is="definition.component"
               v-bind="{...resolvedBindings, ...$attrs}"
               :class="resolvedClass" :style="resolvedStyle"/>
    <div v-else class="_fc-component-preview-fallback">
        <slot name="fallback" :rule="rule" :definition="definition"></slot>
    </div>
</template>

<script>
import {computed, defineComponent} from 'vue';
import {getComponentDefinition} from '../runtime/componentRegistry';
import {readComponentValue, resolveComponentProps} from '../runtime/valueBinding';

export default defineComponent({
    name: 'FcComponentPreview',
    inheritAttrs: false,
    props: {
        rule: {
            type: Object,
            required: true,
        },
        value: {
            default: undefined,
        },
        formData: {
            type: Object,
            default: () => ({}),
        },
        componentProps: {
            type: Object,
            default: () => ({}),
        },
        mode: {
            type: String,
            default: 'default',
        },
    },
    setup(props) {
        const definition = computed(() => getComponentDefinition(props.rule && props.rule.type));
        const canPreview = computed(() => {
            const capabilities = definition.value && definition.value.capabilities;
            return !!(capabilities && capabilities.preview && (props.mode !== 'tableCell' || capabilities.tableCell));
        });
        const resolvedValue = computed(() => props.value === undefined
            ? readComponentValue(props.rule, props.formData)
            : props.value);
        const resolvedProps = computed(() => resolveComponentProps(props.rule, resolvedValue.value, props.componentProps));
        const resolvedAttrs = computed(() => {
            const attrs = props.rule && props.rule.attrs;
            return attrs && typeof attrs === 'object' ? attrs : {};
        });
        const resolvedBindings = computed(() => ({...resolvedAttrs.value, ...resolvedProps.value}));
        const resolvedClass = computed(() => props.rule && (props.rule.class || props.rule.className));
        const resolvedStyle = computed(() => props.rule && props.rule.style);
        return {definition, canPreview, resolvedBindings, resolvedClass, resolvedStyle};
    },
});
</script>
