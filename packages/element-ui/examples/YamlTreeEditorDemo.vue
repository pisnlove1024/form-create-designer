<template>
    <main class="yaml-tree-demo" data-testid="yaml-tree-editor-demo">
        <header class="yaml-tree-demo__header">
            <h1>YAML 树编辑器</h1>
            <p>用树形编辑器完成受约束的结构化修改，用 CodePreview 编辑完整 YAML 语法；两者通过按钮显式同步，避免半成品 YAML 直接污染树状态。</p>
        </header>

        <section class="yaml-tree-demo__loader">
            <h2>加载测试 YAML</h2>
            <el-input
                v-model="sourceYaml"
                data-testid="yaml-source-input"
                type="textarea"
                :autosize="{minRows: 8, maxRows: 16}"
                placeholder="在此粘贴任意单文档 YAML"
            />
            <div class="yaml-tree-demo__loader-actions">
                <el-button data-testid="yaml-load-button" type="primary" @click="loadYaml">加载到树编辑器</el-button>
                <el-button @click="resetYaml">恢复小样例</el-button>
                <span v-if="parseStatus" class="yaml-tree-demo__error">{{ parseStatus }}</span>
            </div>
        </section>

        <section class="yaml-tree-demo__editor">
            <FcYamlTreeEditor
                v-model="yamlValue"
                height="620px"
                view-mode="split"
                :schema="schema"
                @change="handleYamlChange"
                @node-change="handleNodeChange"
                @parse-error="parseStatus = $event"
                @validation-error="parseStatus = $event"
            />
        </section>

        <section class="yaml-tree-demo__source">
            <div class="yaml-tree-demo__section-heading">
                <div>
                    <h2>源码逃生通道：fcCodePreview</h2>
                    <p>适合锚点、复杂排版或树编辑器暂不支持的 YAML 语法；格式化使用 YAML 解析器重新输出。</p>
                </div>
                <span v-if="lastNodeChange" class="yaml-tree-demo__event">最近事件：{{ lastNodeChange }}</span>
            </div>
            <FcCodePreview
                v-model="codeYaml"
                language="yaml"
                height="360px"
                :editable="true"
                :copyable="true"
                :formattable="true"
                chart-name="YAML source"
                chart-description="CodePreview provides the free-form YAML editing surface."
            />
            <div class="yaml-tree-demo__loader-actions">
                <el-button type="primary" @click="applyCodeYaml">应用 CodePreview YAML 到树</el-button>
                <el-button @click="syncTreeToCode">同步树结果到 CodePreview</el-button>
            </div>
        </section>

        <details class="yaml-tree-demo__output">
            <summary>查看当前 v-model YAML</summary>
            <pre data-testid="yaml-tree-output">{{ yamlValue }}</pre>
        </details>
    </main>
</template>

<script>
import {defineComponent} from 'vue';
import FcCodePreview from '../src/components/FcCodePreview.vue';
import FcYamlTreeEditor from '../src/components/FcYamlTreeEditor.vue';

const initialYaml = `service:
  name: pmt
  replicas: 3
  enabled: true
  env:
    - name: LOG_LEVEL
      value: info
`;

const schema = {
    type: 'object',
    required: ['service'],
    properties: {
        service: {
            type: 'object',
            required: ['name', 'replicas', 'enabled', 'env'],
            properties: {
                name: {type: 'string', minLength: 1},
                replicas: {type: 'integer', minimum: 1},
                enabled: {type: 'boolean'},
                env: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['name', 'value'],
                        properties: {
                            name: {type: 'string', minLength: 1},
                            value: {type: ['string', 'object']},
                        },
                    },
                },
            },
        },
    },
};

export default defineComponent({
    name: 'YamlTreeEditorDemo',
    components: {FcCodePreview, FcYamlTreeEditor},
    data() {
        return {
            sourceYaml: initialYaml,
            yamlValue: initialYaml,
            codeYaml: initialYaml,
            schema,
            parseStatus: '',
            lastNodeChange: '',
        };
    },
    methods: {
        loadYaml() {
            this.parseStatus = '';
            this.yamlValue = this.sourceYaml;
        },
        resetYaml() {
            this.parseStatus = '';
            this.sourceYaml = initialYaml;
            this.yamlValue = initialYaml;
            this.codeYaml = initialYaml;
            this.lastNodeChange = '';
        },
        handleYamlChange(value) {
            this.parseStatus = '';
            this.sourceYaml = value;
            this.codeYaml = value;
        },
        handleNodeChange(event) {
            this.lastNodeChange = `${event.action} / ${event.nodeId}`;
        },
        applyCodeYaml() {
            this.parseStatus = '';
            this.yamlValue = this.codeYaml;
        },
        syncTreeToCode() {
            this.codeYaml = this.yamlValue;
        },
    },
});
</script>

<style>
.yaml-tree-demo {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px;
    color: #303133;
}

.yaml-tree-demo__header {
    margin-bottom: 24px;
}

.yaml-tree-demo__header h1,
.yaml-tree-demo__loader h2 {
    margin: 0;
}

.yaml-tree-demo__header p {
    margin: 8px 0 0;
    color: #606266;
}

.yaml-tree-demo__loader,
.yaml-tree-demo__editor,
.yaml-tree-demo__source,
.yaml-tree-demo__output {
    margin-top: 18px;
    padding: 18px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    background: #fff;
}

.yaml-tree-demo__section-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
}

.yaml-tree-demo__section-heading h2 {
    margin: 0;
    font-size: 16px;
}

.yaml-tree-demo__section-heading p {
    margin: 8px 0 0;
    color: #606266;
    font-size: 13px;
}

.yaml-tree-demo__event {
    flex: 0 0 auto;
    color: #909399;
    font-size: 12px;
}

.yaml-tree-demo__loader h2 {
    margin-bottom: 12px;
    font-size: 16px;
}

.yaml-tree-demo__loader-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 12px;
}

.yaml-tree-demo__error {
    color: #f56c6c;
    font-size: 13px;
}

.yaml-tree-demo__output {
    cursor: pointer;
}

.yaml-tree-demo__output pre {
    margin: 14px 0 0;
    padding: 14px;
    overflow: auto;
    border-radius: 4px;
    background: #f5f7fa;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    line-height: 1.45;
}

@media (max-width: 640px) {
    .yaml-tree-demo {
        padding: 16px;
    }
}
</style>
