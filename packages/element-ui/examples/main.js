import {createApp, defineComponent, h} from 'vue';
import ELEMENT from 'element-plus';
import 'element-plus/dist/index.css';
import formCreate from '@form-create/element-ui';
import App from './App.vue';
import RuntimeVerification from './RuntimeVerification.vue';
import YamlTreeEditorDemo from './YamlTreeEditorDemo.vue';
import FcDesigner, {registerComponent} from '../src/index';

const ExampleMetric = defineComponent({
    name: 'ExampleMetric',
    props: {modelValue: [String, Number], suffix: {type: String, default: ''}},
    setup(props) {
        return () => h('strong', {class: 'example-metric'}, `${props.modelValue ?? '-'}${props.suffix}`);
    },
});

// 第三方组件闭环示例：一次注册即可被设计器、运行时、预览和值绑定共同识别。
registerComponent({
    type: 'fcExampleMetric',
    category: 'display',
    component: ExampleMetric,
    binding: {kind: 'modelValue'},
    capabilities: {input: true, preview: true, tableCell: true},
    dragRule: {
        name: 'fcExampleMetric',
        label: '扩展指标',
        icon: 'icon-number',
        menu: 'main',
        rule: () => ({type: 'fcExampleMetric', field: 'metric', title: '扩展指标', value: 100, props: {suffix: '%'}}),
        props: () => [],
    },
});

const search = new URLSearchParams(window.location.search);
const rootComponent = search.has('yaml-tree-editor')
    ? YamlTreeEditorDemo
    : (search.has('runtime-verification') ? RuntimeVerification : App);
const app = createApp(rootComponent);

app.use(ELEMENT);
app.use(formCreate);
app.use(FcDesigner);


app.mount('#app')
