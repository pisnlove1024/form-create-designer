<template>
    <section
        v-bind="$attrs"
        class="fc-yaml-tree-editor"
        :class="{
            'is-readonly': readonlyMode,
            'is-disabled': disabled,
        }"
        :style="editorStyle"
    >
        <header v-if="showHeader" class="fc-yaml-tree-editor__header">
            <div>
                <strong>{{ title || runtimeText('title') }}</strong>
                <span v-if="showFormatHint" class="fc-yaml-tree-editor__hint">{{ runtimeText('formatHint') }}</span>
            </div>
            <el-tag size="small" effect="plain">{{ runtimeText('nodeCount', {count: nodeCount}) }}</el-tag>
        </header>

        <el-alert
            v-if="importError"
            class="fc-yaml-tree-editor__alert"
            type="error"
            :closable="false"
            show-icon
            :title="importError"
        />
        <el-alert
            v-else-if="schemaError"
            class="fc-yaml-tree-editor__alert"
            type="warning"
            :closable="false"
            show-icon
            :title="schemaError"
        />
        <el-alert
            v-else-if="validationError"
            class="fc-yaml-tree-editor__alert"
            type="warning"
            :closable="false"
            show-icon
            :title="validationError"
        />
        <el-alert
            v-else-if="formatWarning"
            class="fc-yaml-tree-editor__alert"
            type="warning"
            :closable="false"
            show-icon
            :title="formatWarning"
        />

        <div
            class="fc-yaml-tree-editor__content"
            :class="{ 'is-split': viewMode === 'split' }"
        >
            <section v-if="viewMode !== 'tree'" class="fc-yaml-tree-editor__source-pane">
                <div class="fc-yaml-tree-editor__source-title">
                    <strong>{{ runtimeText('sourceTitle') }}</strong>
                    <el-tag v-if="sourceDirty" size="small" type="warning" effect="plain">{{ runtimeText('unapplied') }}</el-tag>
                </div>
                <el-input
                    v-model="sourceDraft"
                    class="fc-yaml-tree-editor__source-input"
                    type="textarea"
                    :autosize="{ minRows: 12, maxRows: 32 }"
                    :readonly="readonlyMode"
                    spellcheck="false"
                    :placeholder="runtimeText('sourcePlaceholder')"
                />
                <div class="fc-yaml-tree-editor__source-actions">
                    <el-button
                        v-if="!readonlyMode"
                        size="small"
                        type="primary"
                        :disabled="!sourceDirty"
                        @click="applySource"
                    >{{ runtimeText('applyToTree') }}</el-button>
                    <span>{{ runtimeText('sourceHelp') }}</span>
                </div>
            </section>

            <div v-if="viewMode !== 'source'" class="fc-yaml-tree-editor__body">
                <div class="fc-yaml-tree-editor__tree-pane">
                    <el-tree
                        class="fc-yaml-tree-editor__tree"
                        :data="treeData"
                        node-key="id"
                        :default-expand-all="defaultExpandAll"
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        :current-node-key="selectedId"
                        :props="treeProps"
                        @node-click="selectNode"
                    >
                        <template #default="{ data }">
                            <span
                                class="fc-yaml-tree-editor__tree-node"
                                :class="{ 'is-selected': data.id === selectedId }"
                            >
                                <span
                                    class="fc-yaml-tree-editor__kind"
                                    :class="`is-${data.kind}`"
                                >{{ kindLabel(data) }}</span>
                                <span class="fc-yaml-tree-editor__node-name">{{ nodeLabel(data) }}</span>
                                <span class="fc-yaml-tree-editor__node-preview">{{ nodePreview(data) }}</span>
                            </span>
                        </template>
                    </el-tree>
                </div>

                <aside v-if="selectedNode" class="fc-yaml-tree-editor__inspector">
                    <div class="fc-yaml-tree-editor__inspector-title">
                        <strong>{{ runtimeText('inspectorTitle') }}</strong>
                        <span>{{ selectedPath }}</span>
                    </div>
                    <p v-if="selectedSchemaDescription" class="fc-yaml-tree-editor__schema-description">
                        {{ selectedSchemaDescription }}
                    </p>

                    <el-form label-position="top" size="small">
                        <el-form-item v-if="selectedNodeHasKey" :label="runtimeText('keyLabel')">
                            <el-input
                                :model-value="selectedNode.key"
                                :disabled="readonlyMode"
                                :placeholder="runtimeText('keyPlaceholder')"
                                @update:model-value="updateSelectedKey"
                            />
                        </el-form-item>

                        <el-form-item :label="runtimeText('nodeTypeLabel')">
                            <el-select
                                :model-value="selectedNode.kind"
                                :disabled="readonlyMode || selectedKindLocked"
                                @update:model-value="changeSelectedKind"
                            >
                                <el-option :label="runtimeText('mapType')" value="map" :disabled="!isKindAllowed('map')" />
                                <el-option :label="runtimeText('listType')" value="seq" :disabled="!isKindAllowed('seq')" />
                                <el-option :label="runtimeText('scalarType')" value="scalar" :disabled="!isKindAllowed('scalar')" />
                            </el-select>
                        </el-form-item>

                        <template v-if="selectedNode.kind === 'scalar'">
                            <el-form-item :label="runtimeText('valueTypeLabel')">
                                <el-select
                                    :model-value="selectedNode.scalarType"
                                    :disabled="readonlyMode || selectedScalarTypeLocked"
                                    @update:model-value="changeSelectedScalarType"
                                >
                                    <el-option :label="runtimeText('textType')" value="string" :disabled="!isScalarTypeAllowed('string')" />
                                    <el-option :label="runtimeText('numberType')" value="number" :disabled="!isScalarTypeAllowed('number')" />
                                    <el-option :label="runtimeText('booleanType')" value="boolean" :disabled="!isScalarTypeAllowed('boolean')" />
                                    <el-option :label="runtimeText('nullType')" value="null" :disabled="!isScalarTypeAllowed('null')" />
                                </el-select>
                            </el-form-item>

                            <el-form-item v-if="selectedNode.scalarType === 'string'" :label="runtimeText('valueLabel')">
                                <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 3, maxRows: 8 }"
                                    :model-value="selectedNode.scalarValue"
                                    :disabled="readonlyMode"
                                    :placeholder="runtimeText('textPlaceholder')"
                                    @update:model-value="updateSelectedScalarValue"
                                />
                            </el-form-item>

                            <el-form-item v-else-if="selectedNode.scalarType === 'number'" :label="runtimeText('valueLabel')">
                                <el-input
                                    type="number"
                                    :model-value="selectedNode.scalarValue"
                                    :disabled="readonlyMode"
                                    :placeholder="runtimeText('numberPlaceholder')"
                                    @update:model-value="updateSelectedScalarValue"
                                />
                            </el-form-item>

                            <el-form-item v-else-if="selectedNode.scalarType === 'boolean'" :label="runtimeText('valueLabel')">
                                <el-switch
                                    :model-value="selectedNode.scalarValue === 'true'"
                                    :disabled="readonlyMode"
                                    active-text="true"
                                    inactive-text="false"
                                    @update:model-value="updateSelectedBooleanValue"
                                />
                            </el-form-item>

                            <div v-else class="fc-yaml-tree-editor__null-value">null</div>
                        </template>
                    </el-form>

                    <div v-if="!readonlyMode" class="fc-yaml-tree-editor__actions">
                        <el-button
                            v-if="selectedNode.kind !== 'scalar'"
                            size="small"
                            type="primary"
                            plain
                            :disabled="!canAddChild"
                            @click="addChild"
                        >{{ runtimeText('addChild') }}</el-button>
                        <el-button
                            v-if="!isRootSelected"
                            size="small"
                            plain
                            :disabled="!canAddSibling"
                            @click="addSibling"
                        >{{ runtimeText('addSibling') }}</el-button>
                        <el-button
                            v-if="!isRootSelected"
                            size="small"
                            plain
                            :disabled="!canMoveSelected(-1)"
                            @click="moveSelected(-1)"
                        >{{ runtimeText('moveUp') }}</el-button>
                        <el-button
                            v-if="!isRootSelected"
                            size="small"
                            plain
                            :disabled="!canMoveSelected(1)"
                            @click="moveSelected(1)"
                        >{{ runtimeText('moveDown') }}</el-button>
                        <el-button v-if="!isRootSelected" size="small" type="danger" plain @click="removeSelected">{{ runtimeText('remove') }}</el-button>
                    </div>
                </aside>
            </div>
        </div>
    </section>
</template>

<script>
import {computed, defineComponent, nextTick, ref, watch} from 'vue';
import {isAlias, isMap, isScalar, isSeq, parseAllDocuments, stringify} from 'yaml';
import ZhCn from '../locale/zh-cn';
import {t as globalT} from '../utils/locale';

const runtimeLocalePath = 'com.fcYamlTreeEditor.runtime';

function formatRuntimeText(value, option) {
    return value.replace(/\{(\w+)\}/g, (_, key) => `${option?.[key] ?? `{${key}}`}`);
}

function runtimeText(key, option) {
    const path = `${runtimeLocalePath}.${key}`;
    const translated = globalT(path, option);
    if (typeof translated === 'string' && translated) return translated;
    const fallback = ZhCn.com.fcYamlTreeEditor.runtime[key];
    return typeof fallback === 'string' ? formatRuntimeText(fallback, option) : key;
}

let nodeSequence = 0;

function makeNodeId() {
    nodeSequence += 1;
    return `yaml-node-${nodeSequence}`;
}

function createNode(kind = 'scalar', key = '') {
    return {
        id: makeNodeId(),
        key,
        kind,
        scalarType: 'string',
        scalarValue: '',
        children: [],
    };
}

function createEmptyRoot() {
    return createNode('map');
}

function scalarType(value) {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number' && Number.isFinite(value)) return 'number';
    return 'string';
}

function scalarText(value, type) {
    if (type === 'null') return '';
    if (type === 'boolean') return value ? 'true' : 'false';
    return value == null ? '' : String(value);
}

function isCustomTag(node) {
    const tag = node && typeof node.tag === 'string' ? node.tag : '';
    return !!tag && !tag.startsWith('tag:yaml.org,2002:');
}

function readMapKey(node) {
    const value = isScalar(node) ? node.value : node;
    if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
        return String(value);
    }
    throw new Error(runtimeText('scalarKeyOnly'));
}

function fromYamlNode(rawNode, key = '') {
    if (isAlias(rawNode)) {
        throw new Error(runtimeText('unsupportedAlias'));
    }
    if (rawNode && rawNode.anchor) {
        throw new Error(runtimeText('unsupportedAlias'));
    }
    if (isCustomTag(rawNode)) {
        throw new Error(runtimeText('unsupportedTag'));
    }

    if (isMap(rawNode)) {
        const node = createNode('map', key);
        node.children = rawNode.items.map((pair) => fromYamlNode(pair.value, readMapKey(pair.key)));
        return node;
    }
    if (isSeq(rawNode)) {
        const node = createNode('seq', key);
        node.children = rawNode.items.map(item => fromYamlNode(item, ''));
        return node;
    }

    const value = isScalar(rawNode) ? rawNode.value : rawNode;
    const type = scalarType(value);
    const node = createNode('scalar', key);
    node.scalarType = type;
    node.scalarValue = scalarText(value, type);
    return node;
}

function sourceFromValue(value) {
    if (typeof value === 'string') return value;
    if (value === undefined || value === null) return '';
    return stringify(value, {indent: 2, lineWidth: 0});
}

function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target || {}, key);
}

function parseSchemaValue(value) {
    if (value === undefined || value === null || value === '') {
        return {schema: null, error: ''};
    }
    if (typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch (error) {
            return {schema: null, error: runtimeText('schemaJsonParseError', {message: error.message || runtimeText('invalidFormat')})};
        }
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {schema: null, error: runtimeText('invalidSchema')};
    }
    return {schema: value, error: ''};
}

function schemaTypes(schema) {
    if (!schema || typeof schema !== 'object') return [];
    if (Array.isArray(schema.type)) return schema.type.filter(type => typeof type === 'string');
    if (typeof schema.type === 'string') return [schema.type];
    if (schema.properties || hasOwn(schema, 'additionalProperties')) return ['object'];
    if (hasOwn(schema, 'items')) return ['array'];
    return [];
}

function schemaKinds(schema) {
    return schemaTypes(schema).map(type => {
        if (type === 'object') return 'map';
        if (type === 'array') return 'seq';
        return 'scalar';
    });
}

function schemaScalarTypes(schema) {
    return schemaTypes(schema)
        .filter(type => ['string', 'number', 'integer', 'boolean', 'null'].includes(type))
        .map(type => type === 'integer' ? 'number' : type);
}

function schemaForChild(parentSchema, parentNode, child, index) {
    if (!parentSchema || typeof parentSchema !== 'object') return null;
    if (parentNode.kind === 'map') {
        if (parentSchema.properties && hasOwn(parentSchema.properties, child.key)) {
            return parentSchema.properties[child.key];
        }
        return parentSchema.additionalProperties && typeof parentSchema.additionalProperties === 'object'
            ? parentSchema.additionalProperties
            : null;
    }
    if (parentNode.kind === 'seq') {
        if (Array.isArray(parentSchema.items)) {
            return parentSchema.items[index] || parentSchema.additionalItems || null;
        }
        return parentSchema.items && typeof parentSchema.items === 'object' ? parentSchema.items : null;
    }
    return null;
}

function findSchemaForNode(root, id, schema) {
    if (!root || !schema) return null;
    if (root.id === id) return schema;
    for (let index = 0; index < root.children.length; index += 1) {
        const child = root.children[index];
        const childSchema = schemaForChild(schema, root, child, index);
        const found = findSchemaForNode(child, id, childSchema);
        if (found) return found;
    }
    return null;
}

function schemaAllowsKind(schema, kind) {
    const kinds = schemaKinds(schema);
    return !kinds.length || kinds.includes(kind);
}

function schemaAllowsScalarType(schema, type) {
    const types = schemaScalarTypes(schema);
    return !types.length || types.includes(type);
}

function schemaKindLocked(schema) {
    return schemaKinds(schema).length === 1;
}

function schemaScalarTypeLocked(schema) {
    return schemaScalarTypes(schema).length === 1;
}

function schemaValue(node) {
    if (node.kind === 'map') {
        return node.children.reduce((result, child) => {
            result[child.key] = schemaValue(child);
            return result;
        }, Object.create(null));
    }
    if (node.kind === 'seq') return node.children.map(child => schemaValue(child));
    if (node.scalarType === 'null') return null;
    if (node.scalarType === 'boolean') return node.scalarValue === 'true';
    if (node.scalarType === 'number') return Number(node.scalarValue);
    return node.scalarValue;
}

function sameSchemaValue(left, right) {
    if (Object.is(left, right)) return true;
    try {
        return JSON.stringify(left) === JSON.stringify(right);
    } catch (error) {
        return false;
    }
}

function schemaMatchesType(node, type) {
    if (type === 'object') return node.kind === 'map';
    if (type === 'array') return node.kind === 'seq';
    if (type === 'string') return node.kind === 'scalar' && node.scalarType === 'string';
    if (type === 'number') return node.kind === 'scalar' && node.scalarType === 'number';
    if (type === 'integer') return node.kind === 'scalar' && node.scalarType === 'number' && Number.isInteger(Number(node.scalarValue));
    if (type === 'boolean') return node.kind === 'scalar' && node.scalarType === 'boolean';
    if (type === 'null') return node.kind === 'scalar' && node.scalarType === 'null';
    return true;
}

function schemaTypeLabel(types) {
    return types.join(' / ');
}

function validateSchema(node, schema, path = '$') {
    if (!schema || typeof schema !== 'object') return '';

    const types = schemaTypes(schema);
    if (types.length && !types.some(type => schemaMatchesType(node, type))) {
        return runtimeText('schemaTypeMismatch', {path, types: schemaTypeLabel(types)});
    }

    const value = schemaValue(node);
    if (Array.isArray(schema.enum) && !schema.enum.some(item => sameSchemaValue(item, value))) {
        return runtimeText('enum', {path});
    }
    if (hasOwn(schema, 'const') && !sameSchemaValue(schema.const, value)) {
        return runtimeText('const', {path, value: String(schema.const)});
    }

    if (node.kind === 'map') {
        const properties = schema.properties || {};
        const required = Array.isArray(schema.required) ? schema.required : [];
        const keys = new Set(node.children.map(child => String(child.key)));
        for (const key of required) {
            if (!keys.has(key)) return runtimeText('required', {path, key});
        }
        if (schema.minProperties != null && node.children.length < Number(schema.minProperties)) {
            return runtimeText('minProperties', {path, count: schema.minProperties});
        }
        if (schema.maxProperties != null && node.children.length > Number(schema.maxProperties)) {
            return runtimeText('maxProperties', {path, count: schema.maxProperties});
        }
        for (const child of node.children) {
            let childSchema = hasOwn(properties, child.key) ? properties[child.key] : null;
            if (!childSchema && schema.additionalProperties && typeof schema.additionalProperties === 'object') {
                childSchema = schema.additionalProperties;
            }
            if (!childSchema && schema.additionalProperties === false) {
                return runtimeText('additionalProperties', {path, key: child.key});
            }
            const next = validateSchema(child, childSchema, `${path}.${child.key}`);
            if (next) return next;
        }
    } else if (node.kind === 'seq') {
        if (schema.minItems != null && node.children.length < Number(schema.minItems)) {
            return runtimeText('minItems', {path, count: schema.minItems});
        }
        if (schema.maxItems != null && node.children.length > Number(schema.maxItems)) {
            return runtimeText('maxItems', {path, count: schema.maxItems});
        }
        for (let index = 0; index < node.children.length; index += 1) {
            const childSchema = Array.isArray(schema.items)
                ? (schema.items[index] || schema.additionalItems || null)
                : schema.items;
            const next = validateSchema(node.children[index], childSchema, `${path}[${index}]`);
            if (next) return next;
        }
    } else if (node.scalarType === 'string') {
        if (schema.minLength != null && node.scalarValue.length < Number(schema.minLength)) {
            return runtimeText('minLength', {path, count: schema.minLength});
        }
        if (schema.maxLength != null && node.scalarValue.length > Number(schema.maxLength)) {
            return runtimeText('maxLength', {path, count: schema.maxLength});
        }
        if (schema.pattern) {
            try {
                if (!new RegExp(schema.pattern).test(node.scalarValue)) return runtimeText('pattern', {path});
            } catch (error) {
                // Invalid schema patterns are ignored here and surfaced by the schema editor itself.
            }
        }
    } else if (node.scalarType === 'number') {
        const number = Number(node.scalarValue);
        if (schema.minimum != null && number < Number(schema.minimum)) return runtimeText('minimum', {path, value: schema.minimum});
        if (schema.maximum != null && number > Number(schema.maximum)) return runtimeText('maximum', {path, value: schema.maximum});
    }
    return '';
}

function defaultScalarType(schema) {
    const types = schemaScalarTypes(schema);
    return types.length === 1 ? types[0] : 'string';
}

function createNodeForSchema(schema, key = '') {
    const kinds = schemaKinds(schema);
    const kind = kinds.length === 1 ? kinds[0] : 'scalar';
    const node = createNode(kind, key);
    if (kind === 'scalar') {
        node.scalarType = defaultScalarType(schema);
        node.scalarValue = schema && hasOwn(schema, 'default') ? scalarText(schema.default, node.scalarType) : '';
    }
    return node;
}

function findNode(root, id, parent = null) {
    if (!root) return null;
    if (root.id === id) return {node: root, parent, index: -1};
    for (let index = 0; index < root.children.length; index += 1) {
        const child = root.children[index];
        if (child.id === id) return {node: child, parent: root, index};
        const found = findNode(child, id, root);
        if (found) return found;
    }
    return null;
}

function countNodes(node) {
    if (!node) return 0;
    return 1 + node.children.reduce((count, child) => count + countNodes(child), 0);
}

function treeToYamlValue(node) {
    if (node.kind === 'map') {
        const value = new Map();
        node.children.forEach((child) => {
            value.set(child.key, treeToYamlValue(child));
        });
        return value;
    }
    if (node.kind === 'seq') {
        return node.children.map(child => treeToYamlValue(child));
    }
    if (node.scalarType === 'null') return null;
    if (node.scalarType === 'boolean') return node.scalarValue === 'true';
    if (node.scalarType === 'number') return Number(node.scalarValue);
    return node.scalarValue;
}

function validateTree(node, path = '$') {
    if (node.kind === 'map') {
        const usedKeys = new Set();
        for (const child of node.children) {
            const key = String(child.key || '').trim();
            if (!key) return runtimeText('emptyKey', {path});
            if (usedKeys.has(key)) return runtimeText('duplicateKey', {path, key});
            usedKeys.add(key);
            const next = validateTree(child, `${path}.${key}`);
            if (next) return next;
        }
    } else if (node.kind === 'seq') {
        for (let index = 0; index < node.children.length; index += 1) {
            const next = validateTree(node.children[index], `${path}[${index}]`);
            if (next) return next;
        }
    } else if (node.scalarType === 'number') {
        const value = Number(node.scalarValue);
        if (!String(node.scalarValue).trim() || !Number.isFinite(value)) {
            return runtimeText('invalidNumber', {path});
        }
    }
    return '';
}

function hasYamlComment(source) {
    return /(^|\s)#\S|(^|\s)#\s/m.test(source);
}

export default defineComponent({
    name: 'FcYamlTreeEditor',
    inheritAttrs: false,
    emits: ['update:modelValue', 'change', 'parse-error', 'validation-error', 'node-change'],
    props: {
        modelValue: {
            type: [String, Number, Boolean, Object, Array],
            default: undefined,
        },
        yaml: {
            type: [String, Number, Boolean, Object, Array],
            default: '',
        },
        schema: {
            type: [String, Object],
            default: null,
        },
        title: {
            type: String,
            default: '',
        },
        height: {
            type: [String, Number],
            default: '420px',
        },
        indent: {
            type: Number,
            default: 2,
        },
        readonly: Boolean,
        disabled: Boolean,
        defaultExpandAll: {
            type: Boolean,
            default: true,
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        showFormatHint: {
            type: Boolean,
            default: true,
        },
        viewMode: {
            type: String,
            default: 'tree',
            validator: value => ['tree', 'source', 'split'].includes(value),
        },
    },
    setup(props, {emit, expose}) {
        const rootNode = ref(createEmptyRoot());
        const selectedId = ref(rootNode.value.id);
        const importError = ref('');
        const validationError = ref('');
        const formatWarning = ref('');
        const lastEmittedValue = ref(null);
        const sourceDraft = ref('');
        const loadedSource = ref('');
        const treeProps = {children: 'children'};

        const readonlyMode = computed(() => props.readonly || props.disabled);
        const viewMode = computed(() => ['tree', 'source', 'split'].includes(props.viewMode) ? props.viewMode : 'tree');
        const schemaResult = computed(() => parseSchemaValue(props.schema));
        const activeSchema = computed(() => schemaResult.value.schema);
        const schemaError = computed(() => schemaResult.value.error);
        const editorStyle = computed(() => ({
            height: typeof props.height === 'number' ? `${props.height}px` : props.height,
        }));
        const treeData = computed(() => [rootNode.value]);
        const nodeCount = computed(() => countNodes(rootNode.value));
        const selectedEntry = computed(() => findNode(rootNode.value, selectedId.value));
        const selectedNode = computed(() => selectedEntry.value && selectedEntry.value.node);
        const selectedNodeHasKey = computed(() => !!(
            selectedEntry.value && selectedEntry.value.parent && selectedEntry.value.parent.kind === 'map'
        ));
        const isRootSelected = computed(() => !selectedEntry.value || !selectedEntry.value.parent);
        const selectedPath = computed(() => getNodePath(selectedId.value));
        const selectedSchema = computed(() => findSchemaForNode(rootNode.value, selectedId.value, activeSchema.value));
        const selectedSchemaDescription = computed(() => selectedSchema.value && selectedSchema.value.description || '');
        const selectedKindLocked = computed(() => schemaKindLocked(selectedSchema.value));
        const selectedScalarTypeLocked = computed(() => schemaScalarTypeLocked(selectedSchema.value));
        const sourceDirty = computed(() => sourceDraft.value !== loadedSource.value);

        function isKindAllowed(kind) {
            return schemaAllowsKind(selectedSchema.value, kind);
        }

        function isScalarTypeAllowed(type) {
            return schemaAllowsScalarType(selectedSchema.value, type);
        }

        function canCreateMapChild(parent) {
            const parentSchema = findSchemaForNode(rootNode.value, parent.id, activeSchema.value);
            if (parentSchema && parentSchema.maxProperties != null && parent.children.length >= Number(parentSchema.maxProperties)) {
                return false;
            }
            if (!parentSchema || parentSchema.additionalProperties !== false) return true;
            const keys = new Set(parent.children.map(child => child.key));
            return Object.keys(parentSchema.properties || {}).some(key => !keys.has(key));
        }

        function canCreateChild(parent) {
            if (!parent || parent.kind === 'scalar') return false;
            if (parent.kind === 'map') return canCreateMapChild(parent);
            const parentSchema = findSchemaForNode(rootNode.value, parent.id, activeSchema.value);
            if (!parentSchema) return true;
            if (parentSchema.maxItems != null && parent.children.length >= Number(parentSchema.maxItems)) return false;
            if (Array.isArray(parentSchema.items) && parentSchema.additionalItems === false && parent.children.length >= parentSchema.items.length) {
                return false;
            }
            return true;
        }

        const canAddChild = computed(() => {
            return canCreateChild(selectedNode.value);
        });
        const canAddSibling = computed(() => {
            const entry = selectedEntry.value;
            return !!entry && !!entry.parent && canCreateChild(entry.parent);
        });

        function getIncomingSource(value = props.modelValue) {
            if (value !== undefined && value !== null) return sourceFromValue(value);
            return sourceFromValue(props.yaml);
        }

        function refreshValidationState(emitError = true) {
            const error = getValidationError();
            validationError.value = error;
            if (error && emitError) emit('validation-error', error);
            return error;
        }

        function loadSource(source, {emitValidation = true} = {}) {
            const normalized = String(source || '');
            sourceDraft.value = normalized;
            loadedSource.value = normalized;
            importError.value = '';
            validationError.value = '';
            formatWarning.value = hasYamlComment(normalized)
                ? runtimeText('commentWarning')
                : '';

            if (!normalized.trim()) {
                rootNode.value = createEmptyRoot();
                selectedId.value = rootNode.value.id;
                refreshValidationState(emitValidation);
                return true;
            }

            try {
                const documents = parseAllDocuments(normalized, {prettyErrors: true, strict: true});
                if (documents.length !== 1) {
                    throw new Error(runtimeText('singleDocumentOnly'));
                }
                const document = documents[0];
                if (document.errors.length) {
                    throw new Error(document.errors.map(error => error.message).join('; '));
                }
                rootNode.value = fromYamlNode(document.contents || null);
                selectedId.value = rootNode.value.id;
                refreshValidationState(emitValidation);
                return true;
            } catch (error) {
                importError.value = runtimeText('parseError', {message: error.message || runtimeText('unknownError')});
                emit('parse-error', importError.value);
                return false;
            }
        }

        function getValidationError() {
            const treeError = validateTree(rootNode.value);
            if (treeError) return treeError;
            return activeSchema.value ? validateSchema(rootNode.value, activeSchema.value) : '';
        }

        function serializeTree() {
            const error = getValidationError();
            validationError.value = error;
            if (error) {
                emit('validation-error', error);
                return '';
            }
            try {
                return stringify(treeToYamlValue(rootNode.value), {
                    indent: Math.max(1, Math.floor(Number(props.indent) || 2)),
                    lineWidth: 0,
                    sortMapEntries: false,
                });
            } catch (error) {
                validationError.value = runtimeText('generateError', {message: error.message || runtimeText('unknownError')});
                emit('validation-error', validationError.value);
                return '';
            }
        }

        function commit(action, nodeId = selectedId.value) {
            if (readonlyMode.value) return;
            importError.value = '';
            const yaml = serializeTree();
            if (!yaml) return;
            // A successful tree edit has already normalized the document, so a
            // warning about comments or source formatting is no longer useful.
            formatWarning.value = '';
            lastEmittedValue.value = yaml;
            sourceDraft.value = yaml;
            loadedSource.value = yaml;
            emit('update:modelValue', yaml);
            emit('change', yaml);
            emit('node-change', {action, nodeId, yaml});
        }

        function applySource() {
            if (readonlyMode.value || !sourceDirty.value) return;
            if (loadSource(sourceDraft.value, {emitValidation: false})) commit('apply-source', selectedId.value);
        }

        function selectNode(node) {
            selectedId.value = node.id;
        }

        function nodeLabel(node) {
            if (node.id === rootNode.value.id) return runtimeText('rootNode');
            if (node.key) return node.key;
            const entry = findNode(rootNode.value, node.id);
            return entry && entry.index >= 0
                ? runtimeText('listItemWithIndex', {index: entry.index + 1})
                : runtimeText('listItem');
        }

        function nodePreview(node) {
            if (node.kind === 'map') return `{ ${runtimeText('mapPreview', {count: node.children.length})} }`;
            if (node.kind === 'seq') return `[ ${runtimeText('listPreview', {count: node.children.length})} ]`;
            if (node.scalarType === 'null') return runtimeText('nullValue');
            const value = node.scalarValue === '' ? '""' : node.scalarValue;
            return String(value).replace(/\n/g, ' ↵ ').slice(0, 52);
        }

        function kindLabel(node) {
            if (node.kind === 'map') return runtimeText('mapShort');
            if (node.kind === 'seq') return runtimeText('listShort');
            if (node.scalarType === 'string') return runtimeText('textShort');
            if (node.scalarType === 'number') return runtimeText('numberShort');
            if (node.scalarType === 'boolean') return runtimeText('booleanShort');
            return runtimeText('nullShort');
        }

        function getNodePath(id) {
            const path = [];
            let currentId = id;
            while (currentId) {
                const entry = findNode(rootNode.value, currentId);
                if (!entry || !entry.parent) break;
                if (entry.parent.kind === 'seq') path.unshift(`[${entry.index}]`);
                else path.unshift(`.${entry.node.key || '?'}`);
                currentId = entry.parent.id;
            }
            return `$${path.join('')}`;
        }

        function updateSelectedKey(value) {
            if (!selectedNode.value) return;
            selectedNode.value.key = String(value);
            commit('rename');
        }

        function updateSelectedScalarValue(value) {
            if (!selectedNode.value) return;
            selectedNode.value.scalarValue = String(value);
            commit('change-value');
        }

        function updateSelectedBooleanValue(value) {
            if (!selectedNode.value) return;
            selectedNode.value.scalarValue = value ? 'true' : 'false';
            commit('change-value');
        }

        function changeSelectedScalarType(type) {
            if (!selectedNode.value) return;
            if (!isScalarTypeAllowed(type)) return;
            selectedNode.value.scalarType = type;
            if (type === 'boolean' && !['true', 'false'].includes(selectedNode.value.scalarValue)) {
                selectedNode.value.scalarValue = 'false';
            } else if (type === 'null') {
                selectedNode.value.scalarValue = '';
            } else if (type === 'number' && !Number.isFinite(Number(selectedNode.value.scalarValue))) {
                selectedNode.value.scalarValue = '0';
            }
            commit('change-scalar-type');
        }

        function changeSelectedKind(kind) {
            const node = selectedNode.value;
            if (!node || node.kind === kind || !isKindAllowed(kind)) return;
            node.kind = kind;
            if (kind === 'scalar') {
                node.children = [];
                node.scalarType = defaultScalarType(selectedSchema.value);
                node.scalarValue = '';
            } else {
                node.children = [];
            }
            commit('change-kind');
        }

        function nextMapKey(parent) {
            const keys = new Set(parent.children.map(child => child.key));
            const parentSchema = findSchemaForNode(rootNode.value, parent.id, activeSchema.value);
            const schemaKeys = Object.keys(parentSchema && parentSchema.properties || {});
            const availableSchemaKey = schemaKeys.find(key => !keys.has(key));
            if (availableSchemaKey) return availableSchemaKey;
            if (parentSchema && parentSchema.additionalProperties === false) return '';
            let index = 1;
            let key = 'new_key';
            while (keys.has(key)) {
                index += 1;
                key = `new_key_${index}`;
            }
            return key;
        }

        function makeChild(parent) {
            const key = parent.kind === 'map' ? nextMapKey(parent) : '';
            if (parent.kind === 'map' && !key) return null;
            const parentSchema = findSchemaForNode(rootNode.value, parent.id, activeSchema.value);
            const index = parent.children.length;
            const childSchema = schemaForChild(parentSchema, parent, {key}, index);
            return createNodeForSchema(childSchema, key);
        }

        function selectLater(node) {
            nextTick(() => {
                selectedId.value = node.id;
            });
        }

        function addChild() {
            const parent = selectedNode.value;
            if (!canCreateChild(parent)) return;
            const child = makeChild(parent);
            if (!child) return;
            parent.children.push(child);
            selectLater(child);
            commit('add-child', child.id);
        }

        function addSibling() {
            const entry = selectedEntry.value;
            if (!entry || !entry.parent || !canCreateChild(entry.parent)) return;
            const sibling = makeChild(entry.parent);
            if (!sibling) return;
            entry.parent.children.splice(entry.index + 1, 0, sibling);
            selectLater(sibling);
            commit('add-sibling', sibling.id);
        }

        function canMoveSelected(direction) {
            const entry = selectedEntry.value;
            if (!entry || !entry.parent) return false;
            const nextIndex = entry.index + direction;
            return nextIndex >= 0 && nextIndex < entry.parent.children.length;
        }

        function moveSelected(direction) {
            const entry = selectedEntry.value;
            if (!entry || !entry.parent || !canMoveSelected(direction)) return;
            const nextIndex = entry.index + direction;
            const [node] = entry.parent.children.splice(entry.index, 1);
            entry.parent.children.splice(nextIndex, 0, node);
            commit(direction < 0 ? 'move-up' : 'move-down');
        }

        function removeSelected() {
            const entry = selectedEntry.value;
            if (!entry || !entry.parent) return;
            entry.parent.children.splice(entry.index, 1);
            selectedId.value = entry.parent.id;
            commit('remove');
        }

        function getYaml() {
            return serializeTree();
        }

        function setYaml(value) {
            loadSource(sourceFromValue(value));
        }

        watch(
            () => props.modelValue,
            (value) => {
                const source = getIncomingSource(value);
                if (source === lastEmittedValue.value) return;
                loadSource(source);
            },
            {immediate: true, deep: true},
        );

        watch(
            () => props.yaml,
            (value) => {
                if (props.modelValue === undefined || props.modelValue === null) {
                    const source = sourceFromValue(value);
                    if (source !== lastEmittedValue.value) loadSource(source);
                }
            },
            {deep: true},
        );

        watch(
            () => props.schema,
            () => refreshValidationState(),
            {deep: true},
        );

        expose({getYaml, setYaml, applySource, validate: getValidationError});

        return {
            rootNode,
            treeData,
            treeProps,
            selectedId,
            selectedNode,
            selectedNodeHasKey,
            selectedPath,
            selectedSchemaDescription,
            selectedKindLocked,
            selectedScalarTypeLocked,
            isRootSelected,
            canAddChild,
            canAddSibling,
            nodeCount,
            readonlyMode,
            viewMode,
            editorStyle,
            importError,
            schemaError,
            validationError,
            formatWarning,
            sourceDraft,
            sourceDirty,
            nodeLabel,
            nodePreview,
            kindLabel,
            selectNode,
            updateSelectedKey,
            updateSelectedScalarValue,
            updateSelectedBooleanValue,
            changeSelectedScalarType,
            changeSelectedKind,
            isKindAllowed,
            isScalarTypeAllowed,
            addChild,
            addSibling,
            canMoveSelected,
            moveSelected,
            removeSelected,
            applySource,
            runtimeText,
        };
    },
});
</script>

<style>
.fc-yaml-tree-editor {
    min-height: 260px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    background: #fff;
    box-sizing: border-box;
    color: #303133;
}

.fc-yaml-tree-editor__header {
    min-height: 42px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #ebeef5;
    background: #f8fafc;
}

.fc-yaml-tree-editor__header strong {
    font-size: 14px;
}

.fc-yaml-tree-editor__hint {
    margin-left: 8px;
    color: #909399;
    font-size: 12px;
}

.fc-yaml-tree-editor__alert {
    margin: 8px 10px 0;
}

.fc-yaml-tree-editor__content {
    min-height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.fc-yaml-tree-editor__content.is-split {
    display: grid;
    grid-template-columns: minmax(280px, 0.8fr) minmax(460px, 1.2fr);
}

.fc-yaml-tree-editor__source-pane {
    min-height: 0;
    overflow: auto;
    padding: 12px;
    background: #fcfcfd;
}

.fc-yaml-tree-editor__content:not(.is-split) .fc-yaml-tree-editor__source-pane {
    flex: 1;
}

.fc-yaml-tree-editor__content.is-split .fc-yaml-tree-editor__source-pane {
    border-right: 1px solid #ebeef5;
}

.fc-yaml-tree-editor__source-title {
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: #303133;
    font-size: 13px;
}

.fc-yaml-tree-editor__source-input {
    margin-top: 8px;
}

.fc-yaml-tree-editor__source-input textarea {
    min-height: 220px;
    resize: vertical;
    color: #303133;
    background: #fff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    line-height: 1.5;
}

.fc-yaml-tree-editor__source-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    color: #909399;
    font-size: 12px;
}

.fc-yaml-tree-editor__body {
    min-height: 0;
    flex: 1;
    display: grid;
    grid-template-columns: minmax(220px, 1.05fr) minmax(260px, 0.95fr);
}

.fc-yaml-tree-editor__tree-pane {
    min-height: 0;
    overflow: auto;
    padding: 8px;
    border-right: 1px solid #ebeef5;
    background: #fcfcfd;
}

.fc-yaml-tree-editor__tree {
    min-width: max-content;
    background: transparent;
}

.fc-yaml-tree-editor__tree .el-tree-node__content {
    height: 30px;
    border-radius: 4px;
}

.fc-yaml-tree-editor__tree .el-tree-node__content:hover,
.fc-yaml-tree-editor__tree .el-tree-node:focus > .el-tree-node__content,
.fc-yaml-tree-editor__tree .is-current > .el-tree-node__content {
    background: #ecf5ff;
}

.fc-yaml-tree-editor__tree-node {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding-right: 8px;
    line-height: 1;
}

.fc-yaml-tree-editor__kind {
    min-width: 34px;
    padding: 3px 4px;
    border-radius: 3px;
    color: #606266;
    background: #ebeef5;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
}

.fc-yaml-tree-editor__kind.is-map {
    color: #1d6ec9;
    background: #e8f3ff;
}

.fc-yaml-tree-editor__kind.is-seq {
    color: #8a5a00;
    background: #fdf1d8;
}

.fc-yaml-tree-editor__kind.is-scalar {
    color: #25815d;
    background: #e8f8f0;
}

.fc-yaml-tree-editor__node-name {
    max-width: 190px;
    overflow: hidden;
    color: #303133;
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fc-yaml-tree-editor__node-preview {
    max-width: 180px;
    overflow: hidden;
    color: #909399;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fc-yaml-tree-editor__inspector {
    min-height: 0;
    overflow: auto;
    padding: 14px;
}

.fc-yaml-tree-editor__inspector-title {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

.fc-yaml-tree-editor__inspector-title strong {
    font-size: 14px;
}

.fc-yaml-tree-editor__inspector-title span {
    overflow: hidden;
    color: #909399;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fc-yaml-tree-editor__schema-description {
    margin: -2px 0 12px;
    color: #606266;
    font-size: 12px;
    line-height: 1.5;
}

.fc-yaml-tree-editor__inspector .el-form-item {
    margin-bottom: 12px;
}

.fc-yaml-tree-editor__inspector .el-select {
    width: 100%;
}

.fc-yaml-tree-editor__null-value {
    padding: 8px 10px;
    border-radius: 4px;
    color: #909399;
    background: #f5f7fa;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.fc-yaml-tree-editor__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 2px;
}

.fc-yaml-tree-editor.is-readonly .fc-yaml-tree-editor__hint,
.fc-yaml-tree-editor.is-disabled .fc-yaml-tree-editor__hint {
    color: #c0c4cc;
}

@media (max-width: 640px) {
    .fc-yaml-tree-editor__content.is-split {
        display: flex;
        flex-direction: column;
    }

    .fc-yaml-tree-editor__content.is-split .fc-yaml-tree-editor__source-pane {
        border-right: 0;
        border-bottom: 1px solid #ebeef5;
    }

    .fc-yaml-tree-editor__body {
        grid-template-columns: 1fr;
    }

    .fc-yaml-tree-editor__tree-pane {
        min-height: 220px;
        border-right: 0;
        border-bottom: 1px solid #ebeef5;
    }
}
</style>
