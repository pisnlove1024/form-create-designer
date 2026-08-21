import FcEditor from '../components/FcEditor.vue';
import FcTitle from '../components/FcTitle.vue';
import SignaturePad from '../components/SignaturePad.vue';
import TableForm from '../components/tableForm/TableForm.vue';
import FcTable from '../components/table/Table.vue';
import FcChart from '../components/FcChart.vue';
import FcDataTable from '../components/FcDataTable.vue';
import FcCodePreview from '../components/FcCodePreview.vue';
import FcYamlTreeEditor from '../components/FcYamlTreeEditor.vue';
import FcDialog from '../components/FcDialog.vue';
import FcDrawer from '../components/FcDrawer.vue';

const bindingKinds = new Set(['modelValue', 'prop', 'hybrid', 'children', 'none']);
const overlayKinds = new Set(['dialog', 'drawer']);

function freezeMetadata(value) {
    if (Array.isArray(value)) {
        return Object.freeze(value.map(item => freezeMetadata(item)));
    }
    if (value && Object.prototype.toString.call(value) === '[object Object]') {
        return Object.freeze(Object.keys(value).reduce((result, key) => {
            result[key] = freezeMetadata(value[key]);
            return result;
        }, {}));
    }
    return value;
}

function freezeDefinition(source) {
    return Object.freeze({
        ...source,
        binding: freezeMetadata(source.binding),
        capabilities: freezeMetadata(source.capabilities),
    });
}

const builtinDefinitions = Object.freeze([
    {type: 'fcEditor', category: 'input', component: FcEditor, binding: {kind: 'modelValue'}, capabilities: {input: true, preview: true, tableCell: true, contentKind: 'html'}},
    {type: 'fcTitle', category: 'display', component: FcTitle, binding: {kind: 'none'}, capabilities: {preview: true, tableCell: true}},
    {type: 'signaturePad', category: 'input', component: SignaturePad, binding: {kind: 'modelValue'}, capabilities: {input: true, preview: false}},
    {type: 'tableForm', category: 'composite', component: TableForm, binding: {kind: 'modelValue'}, capabilities: {input: true, preview: false, subForm: true}},
    {type: 'fcTable', category: 'layout', component: FcTable, binding: {kind: 'children'}, capabilities: {container: true, preview: false}},
    {type: 'fcChart', category: 'display', component: FcChart, binding: {kind: 'hybrid', prop: 'chartData', modelProp: 'modelValue'}, capabilities: {input: true, remoteData: true, preview: true, tableCell: true}},
    {
        type: 'fcDataTable', category: 'composite', component: FcDataTable,
        binding: {kind: 'hybrid', prop: 'data', modelProp: 'modelValue'},
        capabilities: {
            input: true, remoteData: true, preview: true, tableCell: true,
            tableColumnDefaultVisible: false, tableCellSummary: 'rowCount', actions: true,
            methods: ['executeAction', 'getSelectedRows', 'isActionLoading', 'loadCursorFirst', 'loadCursorNext', 'loadCursorPrev'],
        },
    },
    {type: 'fcCodePreview', category: 'display', component: FcCodePreview, binding: {kind: 'hybrid', prop: 'chartData', modelProp: 'modelValue'}, capabilities: {input: true, remoteData: true, preview: true, tableCell: true}},
    {type: 'fcYamlTreeEditor', category: 'composite', component: FcYamlTreeEditor, binding: {kind: 'hybrid', prop: 'yaml', modelProp: 'modelValue'}, capabilities: {input: true, remoteData: true, preview: true}},
    {type: 'fcDialog', category: 'overlay', component: FcDialog, binding: {kind: 'children'}, capabilities: {container: true, overlay: 'dialog', preview: false}},
    {type: 'fcDrawer', category: 'overlay', component: FcDrawer, binding: {kind: 'children'}, capabilities: {container: true, overlay: 'drawer', preview: false}},
].map(freezeDefinition));

const builtinDefinitionMap = new Map(builtinDefinitions.map(item => [item.type.toLowerCase(), item]));
const extensionDefinitionMap = new Map();

export let componentDefinitions = Object.freeze(builtinDefinitions.slice());

function refreshDefinitions() {
    const merged = new Map(builtinDefinitionMap);
    extensionDefinitionMap.forEach((definition, key) => merged.set(key, definition));
    componentDefinitions = Object.freeze(Array.from(merged.values()));
}

export function validateComponentDefinition(source) {
    if (!source || typeof source !== 'object') throw new TypeError('Component definition must be an object.');
    const type = typeof source.type === 'string' ? source.type.trim() : '';
    if (!type) throw new TypeError('Component definition.type is required.');
    if (!source.component) throw new TypeError(`Component definition "${type}" requires component.`);
    const binding = source.binding;
    if (!binding || !bindingKinds.has(binding.kind)) throw new TypeError(`Component definition "${type}" has an invalid binding.kind.`);
    if ((binding.kind === 'prop' || binding.kind === 'hybrid') && !String(binding.prop || '').trim()) {
        throw new TypeError(`Component definition "${type}" requires binding.prop.`);
    }
    if (binding.kind === 'hybrid' && !String(binding.modelProp || '').trim()) {
        throw new TypeError(`Component definition "${type}" requires binding.modelProp.`);
    }
    const capabilities = source.capabilities;
    if (!capabilities || typeof capabilities !== 'object' || Array.isArray(capabilities)) {
        throw new TypeError(`Component definition "${type}" requires capabilities.`);
    }
    if (capabilities.overlay != null && !overlayKinds.has(capabilities.overlay)) {
        throw new TypeError(`Component definition "${type}" only supports overlay "dialog" or "drawer".`);
    }
    if (capabilities.methods != null && (!Array.isArray(capabilities.methods) || capabilities.methods.some(name => typeof name !== 'string' || !name.trim()))) {
        throw new TypeError(`Component definition "${type}" capabilities.methods must be a string array.`);
    }
    return freezeDefinition({...source, type});
}

function metadataSignature(definition) {
    return JSON.stringify({
        type: definition.type,
        category: definition.category,
        binding: definition.binding,
        capabilities: definition.capabilities,
    });
}

export function isEquivalentComponentDefinition(left, right) {
    return !!left && !!right && left.component === right.component &&
        metadataSignature(left) === metadataSignature(right);
}

export function assertComponentDefinitionRegistration(source, options = {}) {
    const next = validateComponentDefinition(source);
    const current = getComponentDefinition(next.type);
    if (!current || isEquivalentComponentDefinition(current, next) || options.override === true) return next;
    throw new Error(`Component definition "${next.type}" is already registered. Pass { override: true } to replace it.`);
}

export function registerComponentDefinition(source, options = {}) {
    const next = assertComponentDefinitionRegistration(source, options);
    const current = getComponentDefinition(next.type);
    if (current && isEquivalentComponentDefinition(current, next)) return current;
    extensionDefinitionMap.set(next.type.toLowerCase(), next);
    refreshDefinitions();
    return next;
}

export function getComponentDefinition(type) {
    if (typeof type !== 'string') return undefined;
    const key = type.toLowerCase();
    return extensionDefinitionMap.get(key) || builtinDefinitionMap.get(key);
}

export function hasComponentDefinition(type) {
    return !!getComponentDefinition(type);
}

export function listComponentDefinitions(capability) {
    if (!capability) return componentDefinitions.slice();
    return componentDefinitions.filter(item => !!item.capabilities[capability]);
}

export function installRuntimeComponents(target) {
    if (!target || typeof target.component !== 'function') throw new TypeError('A form-create instance with component() is required.');
    componentDefinitions.forEach(item => target.component(item.type, item.component));
    return target;
}
