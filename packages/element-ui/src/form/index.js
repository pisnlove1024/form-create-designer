import formCreate from '@form-create/element-ui';
import {installRuntimeComponents} from '../runtime/componentRegistry';
export * from '../runtime/index';
export {default as FcComponentPreview} from '../components/FcComponentPreview.vue';

const install = (formCreate) => {
    return installRuntimeComponents(formCreate);
}

install(formCreate);

export default install;
