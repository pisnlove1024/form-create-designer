export const dataTableActionDefaults = Object.freeze({
    id: '',
    label: '',
    type: '',
    size: '',
    decorate: Object.freeze([]),
    hide: false,
    confirm: false,
    successMessage: '',
    errorMessage: '',
    disabledFn: '',
    hiddenFn: '',
    clickFn: '',
});

export function normalizeDataTableAction(source = {}) {
    return {
        ...dataTableActionDefaults,
        ...source,
        decorate: Array.isArray(source.decorate) ? source.decorate.slice() : [],
        hide: source.hide === true,
        confirm: source.confirm || false,
    };
}
export function validateDataTableActions(actions) {
    const ids = new Set();
    const list = Array.isArray(actions) ? actions : [];
    for (let index = 0; index < list.length; index++) {
        const action = list[index] || {};
        const id = String(action.id || '').trim();
        if (!id) {
            return {valid: false, code: 'required', field: 'id', index};
        }
        if (!String(action.label || '').trim()) {
            return {valid: false, code: 'required', field: 'label', index};
        }
        if (ids.has(id)) {
            return {valid: false, code: 'duplicate', field: 'id', index};
        }
        ids.add(id);
    }
    return {valid: true};
}
