import {getComponentDefinition} from './componentRegistry';

const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target || {}, key);

function resolveBinding(ruleOrType) {
    const type = typeof ruleOrType === 'string' ? ruleOrType : ruleOrType && ruleOrType.type;
    const definition = getComponentDefinition(type);
    return definition && definition.binding;
}
function resolveFormValue(rule, formData) {
    if (rule && rule.field && hasOwn(formData, rule.field)) {
        return formData[rule.field];
    }
    return rule && hasOwn(rule, 'value') ? rule.value : undefined;
}

export function readComponentValue(rule, formData = {}) {
    const binding = resolveBinding(rule);
    if (!binding || binding.kind === 'none' || binding.kind === 'children') {
        return undefined;
    }
    const formValue = resolveFormValue(rule, formData);
    if (formValue !== undefined) {
        return formValue;
    }
    return binding.prop && rule && rule.props ? rule.props[binding.prop] : undefined;
}

export function resolveComponentProps(rule, value, extraProps = {}) {
    const props = {...((rule && rule.props) || {}), ...extraProps};
    const binding = resolveBinding(rule);
    if (!binding || value === undefined) {
        return props;
    }
    if (binding.kind === 'modelValue' || binding.kind === 'hybrid') {
        props[binding.modelProp || 'modelValue'] = value;
    } else if (binding.kind === 'prop' && binding.prop) {
        props[binding.prop] = value;
    }
    return props;
}

export function bindRuleValue(rule, value) {
    if (!rule || typeof rule !== 'object') {
        return rule;
    }
    const binding = resolveBinding(rule);
    if (!binding || binding.kind === 'none' || binding.kind === 'children') {
        return rule;
    }
    if (binding.kind === 'modelValue' || (binding.kind === 'hybrid' && rule.field)) {
        rule.value = value;
    } else if (binding.prop) {
        rule.props = {...(rule.props || {}), [binding.prop]: value};
    }
    return rule;
}

export function applyComponentValue(api, rule, value) {
    const binding = resolveBinding(rule);
    if (!binding || !rule) {
        return false;
    }
    if ((binding.kind === 'modelValue' || binding.kind === 'hybrid') && rule.field && api && typeof api.setValue === 'function') {
        api.setValue(rule.field, value);
        return true;
    }
    if ((binding.kind === 'prop' || binding.kind === 'hybrid') && binding.prop) {
        const identity = rule.field || rule._fc_id || rule.name;
        if (identity && api && typeof api.mergeRule === 'function') {
            api.mergeRule(identity, {props: {...(rule.props || {}), [binding.prop]: value}});
            return true;
        }
        bindRuleValue(rule, value);
        return true;
    }
    return false;
}

export function bindRuleTreeValues(rules, formData = {}) {
    const visit = rule => {
        if (!rule || typeof rule !== 'object') {
            return rule;
        }
        const next = {...rule};
        if (rule.props) {
            next.props = {...rule.props};
        }
        if (Array.isArray(rule.children)) {
            next.children = rule.children.map(visit);
        }
        if (next.field && hasOwn(formData, next.field)) {
            bindRuleValue(next, formData[next.field]);
        }
        return next;
    };
    return Array.isArray(rules) ? rules.map(visit) : [];
}
