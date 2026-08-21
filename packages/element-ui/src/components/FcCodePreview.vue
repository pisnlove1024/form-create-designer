<template>
    <div ref="rootRef" class="fc-code-preview" :style="{width: width, height: height}">
        <div v-if="chartName || chartDescription" class="fc-code-preview-header">
            <div v-if="chartName" class="fc-code-preview-title">{{ chartName }}</div>
            <div v-if="chartDescription" class="fc-code-preview-desc">{{ chartDescription }}</div>
        </div>
        <div class="fc-code-preview-body">
            <div v-if="copyable || canFormat" class="fc-code-preview-toolbar">
                <span v-if="canFormat" class="fc-code-preview-btn" @click="formatCode">格式化</span>
                <span v-if="copyable" class="fc-code-preview-btn" @click="copyCode">{{ copyTip }}</span>
            </div>
            <div ref="editorRef" class="fc-code-preview-editor"></div>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref, computed, watch, onMounted, onBeforeUnmount, nextTick, markRaw} from 'vue';
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/yaml/yaml';
import beautify from 'js-beautify';
import {parse as parseYaml, stringify as stringifyYaml} from 'yaml';

const languageModeMap = {
    javascript: 'javascript',
    html: 'htmlmixed',
    css: 'css',
    json: {name: 'javascript', json: true},
    python: 'python',
    java: 'text/x-java',
    sql: 'sql',
    yaml: 'yaml',
    plaintext: null,
};

const formattableLanguages = ['javascript', 'html', 'css', 'json', 'yaml'];

function resolveData(data) {
    if (typeof data === 'function') return data.__json || data.toString();
    return data;
}

function normalizeCode(data, language) {
    data = resolveData(data);
    if (data == null || data === '') return '';
    if (typeof data === 'string') return data;
    try {
        if (language === 'yaml') return stringifyYaml(data, {indent: 2, lineWidth: 0});
        return JSON.stringify(data, null, 2);
    } catch (e) {
        return '';
    }
}

function formatByLanguage(code, language) {
    try {
        switch (language) {
        case 'javascript':
            return beautify.js(code, {indent_size: 2});
        case 'html':
            return beautify.html(code, {indent_size: 2});
        case 'css':
            return beautify.css(code, {indent_size: 2});
        case 'json':
            return JSON.stringify(JSON.parse(code), null, 2);
        case 'yaml':
            return stringifyYaml(parseYaml(code), {indent: 2, lineWidth: 0});
        default:
            return code;
        }
    } catch (e) {
        return code;
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (e) {
        success = false;
    }
    document.body.removeChild(textarea);
    return success;
}

export default defineComponent({
    name: 'FcCodePreview',
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: [String, Number, Boolean, Object, Array, Function],
        chartData: {
            default: ''
        },
        language: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        chartName: {
            type: String,
            default: ''
        },
        chartDescription: {
            type: String,
            default: ''
        },
        editable: {
            type: Boolean,
            default: false
        },
        copyable: {
            type: Boolean,
            default: true
        },
        formattable: {
            type: Boolean,
            default: true
        },
    },
    setup(props, {emit}) {
        const rootRef = ref(null);
        const editorRef = ref(null);
        const copyTip = ref('复制');
        let editor = null;
        let updatingEditor = false;
        let resizeObserver = null;
        let intersectionObserver = null;
        let refreshTimers = [];

        const clearRefreshTimers = () => {
            refreshTimers.forEach(timer => clearTimeout(timer));
            refreshTimers = [];
        };

        const canFormat = computed(() => {
            return props.formattable && formattableLanguages.includes(props.language);
        });

        const hasModelValue = () => {
            return props.modelValue !== undefined && props.modelValue !== null;
        };

        const getEditorSource = () => {
            return hasModelValue() ? props.modelValue : props.chartData;
        };

        const codeText = computed(() => {
            return normalizeCode(getEditorSource(), props.language);
        });

        const getMode = () => {
            return languageModeMap[props.language] || null;
        };

        const refreshEditor = () => {
            if (!editor) return;
            editor.refresh();
        };

        const scheduleRefresh = () => {
            if (!editor) return;
            clearRefreshTimers();
            nextTick(() => {
                refreshEditor();
                if (typeof requestAnimationFrame === 'function') {
                    requestAnimationFrame(refreshEditor);
                    requestAnimationFrame(() => requestAnimationFrame(refreshEditor));
                }
                refreshTimers = [
                    setTimeout(refreshEditor, 80),
                    setTimeout(refreshEditor, 240),
                ];
            });
        };

        const updateEditorValue = (val) => {
            if (!editor) return;
            if (editor.getValue() !== val) {
                updatingEditor = true;
                try {
                    editor.operation(() => {
                        editor.setValue(val);
                    });
                } finally {
                    updatingEditor = false;
                }
            }
            scheduleRefresh();
        };

        const emitInput = (val) => {
            if (!props.editable) return;
            emit('update:modelValue', val);
            emit('change', val);
        };

        const initEditor = () => {
            if (!editorRef.value) return;
            editor = markRaw(CodeMirror(editorRef.value, {
                value: codeText.value,
                mode: getMode(),
                lineNumbers: true,
                readOnly: !props.editable,
                tabSize: 2,
                lineWrapping: true,
                cursorBlinkRate: props.editable ? 530 : -1,
            }));
            editor.on('change', (instance) => {
                if (updatingEditor) return;
                emitInput(instance.getValue());
            });
            scheduleRefresh();
        };

        const observeEditorLayout = () => {
            if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
                resizeObserver = new ResizeObserver(scheduleRefresh);
                resizeObserver.observe(rootRef.value);
                if (editorRef.value) {
                    resizeObserver.observe(editorRef.value);
                }
            }
            if (typeof IntersectionObserver !== 'undefined' && rootRef.value) {
                intersectionObserver = new IntersectionObserver((entries) => {
                    if (entries.some(entry => entry.isIntersecting)) {
                        scheduleRefresh();
                    }
                });
                intersectionObserver.observe(rootRef.value);
            }
            if (typeof window !== 'undefined') {
                window.addEventListener('resize', scheduleRefresh);
            }
        };

        const copyCode = () => {
            const code = editor ? editor.getValue() : codeText.value;
            copyToClipboard(code).then((success) => {
                if (success !== false) {
                    copyTip.value = '已复制';
                    setTimeout(() => {
                        copyTip.value = '复制';
                    }, 2000);
                }
            });
        };

        const formatCode = () => {
            if (!editor || !canFormat.value) return;
            const code = editor.getValue();
            const formatted = formatByLanguage(code, props.language);
            if (formatted !== code) {
                editor.setValue(formatted);
            }
        };

        onMounted(() => {
            nextTick(() => {
                initEditor();
                observeEditorLayout();
            });
        });

        watch(codeText, (val) => {
            updateEditorValue(val);
        });

        watch(() => props.modelValue, (val) => {
            updateEditorValue(normalizeCode(val, props.language));
        }, {deep: true});

        watch(() => props.chartData, (val) => {
            if (!hasModelValue()) {
                updateEditorValue(normalizeCode(val, props.language));
            }
        }, {deep: true});

        watch(() => props.language, () => {
            if (editor) {
                editor.setOption('mode', getMode());
            }
            updateEditorValue(normalizeCode(getEditorSource(), props.language));
        });

        watch(() => props.editable, (val) => {
            if (editor) {
                editor.setOption('readOnly', !val);
                editor.setOption('cursorBlinkRate', val ? 530 : -1);
                scheduleRefresh();
            }
        });

        watch(() => [props.width, props.height, props.chartName, props.chartDescription, props.copyable, props.formattable], () => {
            scheduleRefresh();
        });

        onBeforeUnmount(() => {
            clearRefreshTimers();
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
            if (intersectionObserver) {
                intersectionObserver.disconnect();
                intersectionObserver = null;
            }
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', scheduleRefresh);
            }
            editor = null;
        });

        return {rootRef, editorRef, copyTip, canFormat, copyCode, formatCode};
    }
});
</script>

<style>
.fc-code-preview {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
.fc-code-preview-header {
    padding: 8px 12px;
    border-bottom: 1px solid #e8e8e8;
    background: #fff;
    flex-shrink: 0;
}
.fc-code-preview-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}
.fc-code-preview-desc {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}
.fc-code-preview-body {
    flex: 1;
    position: relative;
    overflow: hidden;
}
.fc-code-preview-toolbar {
    position: absolute;
    top: 4px;
    right: 12px;
    z-index: 10;
    display: flex;
    gap: 8px;
}
.fc-code-preview-btn {
    padding: 2px 8px;
    font-size: 12px;
    color: #606266;
    background: #f5f5f5;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    line-height: 20px;
}
.fc-code-preview-btn:hover {
    color: #409eff;
    border-color: #409eff;
    background: #ecf5ff;
}
.fc-code-preview-editor {
    height: 100%;
    overflow: auto;
}
.fc-code-preview-editor .CodeMirror {
    height: 100%;
}
.fc-code-preview-editor .CodeMirror-line {
    line-height: 18px !important;
    font-size: 13px !important;
}
</style>
