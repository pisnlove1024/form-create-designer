import formCreate from '@form-create/element-ui';
import FcEditor from '../components/FcEditor.vue';
import FcTitle from '../components/FcTitle.vue';
import SignaturePad from '../components/SignaturePad.vue';
import TableForm from '../components/tableForm/TableForm.vue';
import Table from '../components/table/Table.vue';
import FcChart from '../components/FcChart.vue';
import FcDataTable from '../components/FcDataTable.vue';
import FcCodePreview from '../components/FcCodePreview.vue';
import FcDialog from '../components/FcDialog.vue';
import FcDrawer from '../components/FcDrawer.vue';

const install = (formCreate) => {
    formCreate.component('FcEditor', FcEditor);
    formCreate.component('FcTitle', FcTitle);
    formCreate.component('SignaturePad', SignaturePad);
    formCreate.component('TableForm', TableForm);
    formCreate.component('FcTable', Table);
    formCreate.component('FcChart', FcChart);
    formCreate.component('FcDataTable', FcDataTable);
    formCreate.component('FcCodePreview', FcCodePreview);
    formCreate.component('FcDialog', FcDialog);
    formCreate.component('FcDrawer', FcDrawer);
}

install(formCreate);

export default install;
