import {componentDefinitions, getComponentDefinition} from '../runtime/componentRegistry';
import TableFormView from '../components/tableForm/TableFormView.vue';
import FcTableView from '../components/table/TableView.vue';
import FcDialogView from '../components/FcDialogView.vue';
import FcDrawerView from '../components/FcDrawerView.vue';

import editor from '../config/rule/editor';
import title from '../config/rule/title';
import signaturePad from '../config/rule/signaturePad';
import tableForm from '../config/rule/tableForm';
import table from '../config/rule/table';
import chart from '../config/rule/chart';
import dataTable from '../config/rule/dataTable';
import codePreview from '../config/rule/codePreview';
import yamlTreeEditor from '../config/rule/yamlTreeEditor';
import dialog from '../config/rule/dialog';
import drawer from '../config/rule/drawer';

const builtinDragRules = Object.freeze([editor, title, signaturePad, tableForm, table, chart, dataTable, codePreview, yamlTreeEditor, dialog, drawer]);
const builtinDragRuleMap = new Map(builtinDragRules.map(rule => [rule.name.toLowerCase(), rule]));
const extensionDragRuleMap = new Map();
const extensionPreviewMap = new Map();
const builtinPreviewMap = new Map([
    ['tableform', TableFormView], ['fctable', FcTableView], ['fcdialog', FcDialogView], ['fcdrawer', FcDrawerView],
]);

export let componentDragRules = Object.freeze(builtinDragRules.slice());

function refreshDragRules() {
    const merged = new Map(builtinDragRuleMap);
    extensionDragRuleMap.forEach((rule, key) => merged.set(key, rule));
    componentDragRules = Object.freeze(Array.from(merged.values()));
}

function getPreviewComponent(type) {
    const key = String(type || '').toLowerCase();
    return extensionPreviewMap.get(key) || builtinPreviewMap.get(key);
}

export function validateComponentDragRule(type, dragRule) {
    if (dragRule == null) return undefined;
    if (!dragRule || typeof dragRule !== 'object') throw new TypeError(`Drag rule for "${type}" must be an object.`);
    const name = typeof dragRule.name === 'string' ? dragRule.name.trim() : '';
    if (!name) throw new TypeError(`Drag rule for "${type}" requires name.`);
    if (name.toLowerCase() !== String(type).toLowerCase()) throw new TypeError(`Drag rule name "${name}" must match component type "${type}".`);
    if (typeof dragRule.label !== 'string' || !dragRule.label.trim()) throw new TypeError(`Drag rule "${name}" requires label.`);
    if (typeof dragRule.icon !== 'string' || !dragRule.icon.trim()) throw new TypeError(`Drag rule "${name}" requires icon.`);
    if (dragRule.menu != null && (typeof dragRule.menu !== 'string' || !dragRule.menu.trim())) {
        throw new TypeError(`Drag rule "${name}" menu must be a non-empty string.`);
    }
    if (typeof dragRule.rule !== 'function') throw new TypeError(`Drag rule "${name}" requires rule().`);
    if (typeof dragRule.props !== 'function') throw new TypeError(`Drag rule "${name}" requires props().`);
    return dragRule;
}

export function isEquivalentComponentDragRule(left, right) {
    return left === right || (!!left && !!right && left.name === right.name && left.rule === right.rule && left.props === right.props);
}

export function assertComponentDragRuleRegistration(type, dragRule, options = {}) {
    const next = validateComponentDragRule(type, dragRule);
    if (!next) return next;
    const current = getComponentDragRule(type);
    if (!current || isEquivalentComponentDragRule(current, next) || options.override === true) return next;
    throw new Error(`Drag rule "${type}" is already registered. Pass { override: true } to replace it.`);
}

export function assertComponentDesignerRegistration(type, designerComponent, options = {}) {
    if (!designerComponent) return designerComponent;
    const current = getPreviewComponent(type);
    if (!current || current === designerComponent || options.override === true) return designerComponent;
    throw new Error(`Designer component "${type}" is already registered. Pass { override: true } to replace it.`);
}

export function resolveDesignerComponent(type, runtimeComponent, designerComponent, options = {}) {
    if (designerComponent) return designerComponent;
    const key = String(type || '').toLowerCase();
    if (options.override === true) return builtinPreviewMap.get(key) || runtimeComponent;
    return extensionPreviewMap.get(key) || builtinPreviewMap.get(key) || runtimeComponent;
}

export function registerComponentDragRule(type, dragRule, designerComponent, options = {}) {
    const next = assertComponentDragRuleRegistration(type, dragRule, options);
    assertComponentDesignerRegistration(type, designerComponent, options);
    const key = String(type).toLowerCase();
    let refresh = false;
    if (next) {
        if (!isEquivalentComponentDragRule(getComponentDragRule(type), next)) {
            extensionDragRuleMap.set(key, next);
            refresh = true;
        }
    } else if (options.override === true && extensionDragRuleMap.delete(key)) {
        refresh = true;
    }
    if (refresh) {
        refreshDragRules();
    }
    if (designerComponent) {
        extensionPreviewMap.set(key, designerComponent);
    } else if (options.override === true) {
        extensionPreviewMap.delete(key);
    }
    return next;
}

export function getComponentDragRule(type) {
    if (typeof type !== 'string') return undefined;
    const key = type.toLowerCase();
    return extensionDragRuleMap.get(key) || builtinDragRuleMap.get(key);
}

export function installDesignerComponents(target) {
    if (!target || typeof target.component !== 'function') throw new TypeError('A form-create designer instance with component() is required.');
    componentDefinitions.forEach(item => target.component(item.type, getPreviewComponent(item.type) || item.component));
    return target;
}

export function getDesignerComponentDefinition(type) {
    const definition = getComponentDefinition(type);
    if (!definition) return undefined;
    return {
        ...definition,
        designer: getComponentDragRule(type),
        designerComponent: getPreviewComponent(definition.type) || definition.component,
    };
}
