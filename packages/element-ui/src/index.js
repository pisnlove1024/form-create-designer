import FcDesigner from './components/FcDesigner.vue';
import DragTool from './components/DragTool.vue';
import Struct from './components/Struct.vue';
import OptionTextInput from './components/OptionsTextInput.vue';
import Row from './components/Row.vue';
import HtmlEditor from './components/HtmlEditor.vue';
import FnEditor from './components/FnEditor.vue';
import FnInput from './components/FnInput.vue';
import FetchConfig from './components/FetchConfig.vue';
import ConfigItem from './components/style/ConfigItem.vue';
import FieldInput from './components/FieldInput.vue';
import EventConfig from './components/EventConfig.vue';
import FnConfig from './components/FnConfig.vue';
import Validate from './components/Validate.vue';
import DragBox from './components/DragBox.vue';
import Required from './components/Required.vue';
import TableOptions from './components/TableOptions.vue';
import TreeOptions from './components/TreeOptions.vue';
import TableFormColumnView from './components/tableForm/TableFormColumnView.vue';
import SizeInput from './components/style/SizeInput.vue';
import ColorInput from './components/style/ColorInput.vue';
import StyleConfig from './components/style/StyleConfig.vue';
import LanguageInput from './components/language/LanguageInput.vue';
import ValueInput from './components/ValueInput.vue';
import formCreate, {designerForm} from './utils/form';
import DataTableColumns from './components/DataTableColumns.vue';
import DataTableActions from './components/DataTableActions.vue';
import DataTableFilter from './components/DataTableFilter.vue';
import GlobalDataConfig from './components/GlobalDataConfig.vue';
import GlobalDataSelect from './components/GlobalDataSelect.vue';
import FcComponentPreview from './components/FcComponentPreview.vue';
import draggable from 'vuedraggable/src/vuedraggable';
import {
    compareVersion,
    copyTextToClipboard,
    getInjectArg,
    localeOptions,
    localeProps,
    makeOptionsRule,
    makeRequiredRule,
    makeTreeOptions,
    makeTreeOptionsRule,
    toJSON
} from './utils/index';
import globalUseLocale, {t} from './utils/locale';
import './style/index.css';
import './style/icon.css';
import './utils/highlight/style.css';
import menus from './config/menu';
import dragRuleList from './config/index';
import {
    assertComponentDragRuleRegistration,
    assertComponentDesignerRegistration,
    getComponentDragRule,
    getDesignerComponentDefinition,
    installDesignerComponents,
    registerComponentDragRule,
    resolveDesignerComponent,
} from './designer/componentRegistry';
import {installDesignerHtmlPreview} from './designer/htmlPreview';
import {
    assertComponentDefinitionRegistration,
    installRuntimeComponents,
    registerComponentDefinition,
} from './runtime/componentRegistry';
import * as componentRuntime from './runtime/index';

const addComponent = (id, component, previewComponent) => {
    designerForm.component(id, previewComponent || component);
    formCreate.component(id, component);
}

/**
 * 统一注册一个可被设计器与宿主共同识别的组件契约。
 * component() 仍只负责渲染器注册；需要能力发现时必须使用本 API。
 */
const registerComponent = (registration, options = {}) => {
    if (!registration || typeof registration !== 'object') {
        throw new TypeError('Component registration must be an object.');
    }
    const {dragRule: rawDragRule, designerComponent, ...definitionSource} = registration;
    const definition = assertComponentDefinitionRegistration(definitionSource, options);
    const dragRule = assertComponentDragRuleRegistration(definition.type, rawDragRule, options);
    assertComponentDesignerRegistration(definition.type, designerComponent, options);
    const previewComponent = resolveDesignerComponent(definition.type, definition.component, designerComponent, options);

    // 校验全部完成后先更新渲染器，再提交可发现的契约元数据。
    formCreate.component(definition.type, definition.component);
    designerForm.component(definition.type, previewComponent);
    registerComponentDefinition(definition, options);
    registerComponentDragRule(definition.type, dragRule, designerComponent, options);

    if (dragRule || options.override === true) {
        const activeDragRule = getComponentDragRule(definition.type);
        const index = dragRuleList.findIndex(item => String(item && item.name).toLowerCase() === definition.type.toLowerCase());
        if (activeDragRule && index === -1) dragRuleList.push(activeDragRule);
        else if (activeDragRule && index > -1) dragRuleList.splice(index, 1, activeDragRule);
        else if (!activeDragRule && index > -1) dragRuleList.splice(index, 1);
    }
    return getDesignerComponentDefinition(definition.type);
};

designerForm.component('draggable', draggable);
designerForm.component('DragTool', DragTool);
designerForm.component('DragBox', DragBox);
designerForm.component('Validate', Validate);
designerForm.component('Struct', Struct);
designerForm.component('OptionTextInput', OptionTextInput);
designerForm.component('HtmlEditor', HtmlEditor);
designerForm.component('FetchConfig', FetchConfig);
designerForm.component('FnEditor', FnEditor);
designerForm.component('FnInput', FnInput);
designerForm.component('Required', Required);
designerForm.component('TableOptions', TableOptions);
designerForm.component('TreeOptions', TreeOptions);
designerForm.component('TableFormColumn', TableFormColumnView);
designerForm.component('EventConfig', EventConfig);
designerForm.component('ColorInput', ColorInput);
designerForm.component('SizeInput', SizeInput);
designerForm.component('StyleConfig', StyleConfig);
designerForm.component('LanguageInput', LanguageInput);
designerForm.component('ConfigItem', ConfigItem);
designerForm.component('FieldInput', FieldInput);
designerForm.component('FnConfig', FnConfig);
designerForm.component('GlobalDataConfig', GlobalDataConfig);
designerForm.component('GlobalDataSelect', GlobalDataSelect);
designerForm.component('FcRow', Row);
designerForm.component('ValueInput', ValueInput);
designerForm.component('DataTableColumns', DataTableColumns);
designerForm.component('DataTableActions', DataTableActions);
designerForm.component('DataTableFilter', DataTableFilter);
designerForm.component('FcComponentPreview', FcComponentPreview);
installDesignerComponents(designerForm);
installDesignerHtmlPreview(designerForm);
installRuntimeComponents(formCreate);

const install = function (Vue) {
    Vue.component('FcDesigner', FcDesigner);
};

const addMenu = function (menu, before) {
    if (!Array.isArray(menu)) {
        menu = [menu];
    }
    if (before) {
        menus.unshift(...menu);
    } else {
        menus.push(...menu);
    }
}

const addDragRule = function (dragRule, before) {
    if (!Array.isArray(dragRule)) {
        dragRule = [dragRule];
    }
    if (before) {
        dragRuleList.unshift(...dragRule);
    } else {
        dragRuleList.push(...dragRule);
    }
}

FcDesigner.install = install;
FcDesigner.makeOptionsRule = makeOptionsRule;
FcDesigner.copyTextToClipboard = copyTextToClipboard;
FcDesigner.getInjectArg = getInjectArg;
FcDesigner.localeOptions = localeOptions;
FcDesigner.localeProps = localeProps;
FcDesigner.makeRequiredRule = makeRequiredRule;
FcDesigner.makeTreeOptions = makeTreeOptions;
FcDesigner.makeTreeOptionsRule = makeTreeOptionsRule;
FcDesigner.toJSON = toJSON;
FcDesigner.formCreate = formCreate;
FcDesigner.designerForm = designerForm;
FcDesigner.component = addComponent;
FcDesigner.registerComponent = registerComponent;
FcDesigner.useLocale = globalUseLocale;
FcDesigner.addMenu = addMenu;
FcDesigner.addDragRule = addDragRule;
FcDesigner.t = t;
// `components` is reserved by Vue for this component's local component registry.
// Expose the FC runtime contract under a distinct name so installing the plugin
// never replaces FcDesigner's internal DragForm/ViewForm/etc. registrations.
FcDesigner.componentRuntime = componentRuntime;

FcDesigner.utils = {
    copyTextToClipboard,
    getInjectArg,
    localeOptions,
    localeProps,
    makeOptionsRule,
    makeRequiredRule,
    makeTreeOptions,
    makeTreeOptionsRule,
    toJSON
}

const minVersion = '3.2.24';

if (compareVersion(minVersion, formCreate.version) === 1) {
    console.warn('Please use FormCreate version ' + minVersion + ' or greater, see https://github.com/xaboy/form-create.');
}

FcDesigner.version = '3.4.0-cg.8';

if (typeof window !== 'undefined') {
    window.FcDesigner = FcDesigner;
}

export default FcDesigner;

export {
    formCreate,
    designerForm,
    install,
    copyTextToClipboard,
    getInjectArg,
    localeOptions,
    localeProps,
    makeOptionsRule,
    makeRequiredRule,
    makeTreeOptions,
    makeTreeOptionsRule,
    addDragRule,
    addMenu,
    registerComponent,
    toJSON,
};

export {default as FcComponentPreview} from './components/FcComponentPreview.vue';
export * from './runtime/index';
export {
    componentDragRules,
    getComponentDragRule,
    getDesignerComponentDefinition,
    installDesignerComponents,
    registerComponentDragRule,
} from './designer/componentRegistry';
export {installDesignerHtmlPreview} from './designer/htmlPreview';
