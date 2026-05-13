<template>
    <div class="_fd-gd-config">
        <el-badge :value="itemCount" type="warning" :hidden="itemCount < 1">
            <el-button @click="visible=true" size="small">{{ t('globalData.title') }}</el-button>
        </el-badge>
        <el-dialog class="_fd-gd-dialog" :title="t('globalData.title')" v-model="visible" destroy-on-close
                   :close-on-click-modal="false"
                   append-to-body
                   width="1080px">
            <el-container class="_fd-gd-con" style="height: 600px">
                <el-aside style="width:300px;">
                    <el-container class="_fd-gd-l">
                        <el-header class="_fd-gd-head" height="40px">
                            <el-text type="primary" size="default">
                                {{ t('globalData.list') }}
                            </el-text>
                        </el-header>
                        <el-main>
                            <el-menu :default-active="defActive">
                                <template v-for="(item, index) in items" :key="item.name">
                                    <el-menu-item :index="item.name" @click="selectItem(index)">
                                        <div class="_fd-gd-item">
                                            <div class="_fd-gd-item-info">
                                                <el-tag size="small" :type="item.type === 'static' ? 'success' : 'primary'" disable-transitions>
                                                    {{ item.type === 'static' ? t('globalData.static') : t('globalData.fetch') }}
                                                </el-tag>
                                                <span class="_fd-gd-item-name">{{ item.name }}</span>
                                            </div>
                                            <i class="fc-icon icon-delete _fd-gd-item-del" @click.stop="removeItem(index)"></i>
                                        </div>
                                    </el-menu-item>
                                </template>
                            </el-menu>
                            <div class="_fd-gd-add" v-if="adding">
                                <el-input v-model="addName" size="small"
                                          :placeholder="t('globalData.namePlaceholder')"
                                          @keydown.enter="confirmAdd">
                                </el-input>
                                <i class="fc-icon icon-add" @click="confirmAdd"></i>
                                <i class="fc-icon icon-delete" @click="cancelAdd"></i>
                            </div>
                            <div class="_fd-gd-btns" v-else>
                                <el-button link type="primary" size="small" @click="startAdd('static')">
                                    + {{ t('globalData.addStatic') }}
                                </el-button>
                                <el-button link type="primary" size="small" @click="startAdd('fetch')" style="margin-left: 0;">
                                    + {{ t('globalData.addFetch') }}
                                </el-button>
                            </div>
                        </el-main>
                    </el-container>
                </el-aside>
                <el-main>
                    <el-container class="_fd-gd-r">
                        <el-header class="_fd-gd-head" height="40px" v-if="activeIndex >= 0">
                            <span class="_fd-gd-head-tip">{{ t('globalData.info') }}</span>
                            <el-button size="small" type="primary" @click="saveItem" color="#2f73ff">
                                {{ t('props.save') }}
                            </el-button>
                        </el-header>
                        <el-main v-if="activeIndex >= 0 && activeItem">
                            <template v-if="activeItem.type === 'static'">
                                <StructEditor ref="structEditor" v-model="editData" />
                            </template>
                            <template v-else>
                                <el-tabs model-value="first" class="_fc-tabs" style="width:100%;height:100%;">
                                    <el-tab-pane :label="t('fetch.config')" name="first">
                                        <DragForm v-model:api="fetchForm.api" v-model="fetchForm.formData"
                                                  :rule="fetchForm.rule" :option="fetchForm.options">
                                        </DragForm>
                                    </el-tab-pane>
                                    <el-tab-pane lazy :label="t('fetch.parse')" name="second">
                                        <FnEditor style="height: 400px;" v-model="fetchForm.parse" name="parse"
                                                  :args="[{name:'res', info: t('fetch.response')}, 'rule', 'api']"
                                                  ref="parse"></FnEditor>
                                    </el-tab-pane>
                                    <el-tab-pane lazy :label="t('fetch.onError')" name="third">
                                        <FnEditor style="height: 400px;" v-model="fetchForm.onError" name="onError"
                                                  :args="['e']"
                                                  ref="error"></FnEditor>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                        </el-main>
                    </el-container>
                </el-main>
            </el-container>
            <template #footer>
                <div>
                    <el-button size="default" @click="visible=false">{{ t('props.cancel') }}</el-button>
                    <el-button type="primary" size="default" @click="submit" color="#2f73ff">
                        {{ t('props.ok') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {deepCopy} from '@form-create/utils/lib/deepextend';
import {defineComponent} from 'vue';
import StructEditor from './StructEditor.vue';
import FnEditor from './FnEditor.vue';
import {designerForm} from '../utils/form';
import errorMessage from '../utils/message';

const makeFetchRule = (t) => {
    return [
        {
            type: 'input',
            field: 'action',
            title: t('fetch.action'),
            value: '',
            props: {size: 'default'},
            validate: [{required: true, message: t('fetch.actionRequired'), trigger: 'blur'}]
        },
        {
            type: 'radio',
            field: 'method',
            title: t('fetch.method'),
            value: 'GET',
            props: {size: 'default'},
            options: [
                {label: 'GET', value: 'GET'},
                {label: 'POST', value: 'POST'},
            ],
        },
        {
            type: 'TableOptions',
            field: 'headers',
            title: t('fetch.headers'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'default'
            },
        },
        {
            type: 'TableOptions',
            field: 'query',
            title: t('fetch.query'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'default'
            },
        },
        {
            type: 'TableOptions',
            field: 'data',
            title: t('fetch.data'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'default'
            },
        }
    ];
};

export default defineComponent({
    name: 'GlobalDataConfig',
    emits: ['update:modelValue'],
    props: {
        modelValue: [Object, undefined, null],
    },
    inject: ['designer'],
    components: {
        StructEditor,
        FnEditor,
        DragForm: designerForm.$form(),
    },
    data() {
        return {
            visible: false,
            items: [],
            activeIndex: -1,
            defActive: '',
            adding: false,
            addName: '',
            addType: 'static',
            editData: {},
            fetchForm: {
                api: {},
                formData: {},
                rule: [],
                options: {
                    form: {labelWidth: '90px', size: 'default'},
                    submitBtn: false,
                    resetBtn: false,
                },
                parse: '',
                onError: '',
            },
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        itemCount() {
            const val = this.modelValue;
            if (!val || !val._items) return 0;
            return val._items.length;
        },
        activeItem() {
            return this.items[this.activeIndex] || null;
        },
    },
    watch: {
        visible(v) {
            if (v) {
                const val = deepCopy(this.modelValue || {});
                this.items = val._items || [];
                this.activeIndex = -1;
                this.defActive = '';
            } else {
                this.cancelAdd();
            }
        },
    },
    methods: {
        selectItem(index) {
            if (this.activeIndex >= 0) {
                this.saveCurrentItem();
            }
            this.activeIndex = index;
            const item = this.items[index];
            this.defActive = item.name;
            if (item.type === 'static') {
                try {
                    this.editData = item.data ? (new Function('return ' + item.data))() : {};
                } catch (e) {
                    this.editData = {};
                }
            } else {
                const fetch = item.fetch || {};
                this.fetchForm.rule = makeFetchRule(this.t);
                this.fetchForm.formData = {...fetch};
                this.fetchForm.parse = fetch.parse || '';
                this.fetchForm.onError = fetch.onError || '';
            }
        },
        saveCurrentItem() {
            if (this.activeIndex < 0) return;
            const item = this.items[this.activeIndex];
            if (item.type === 'static') {
                if (this.$refs.structEditor && this.$refs.structEditor.save) {
                    this.$refs.structEditor.save();
                }
                item.data = this.editData ? JSON.stringify(this.editData) : '';
            } else {
                this.saveFetchItem(item);
            }
        },
        saveFetchItem(item) {
            const formData = {...this.fetchForm.formData};
            if (this.$refs.parse) {
                this.$refs.parse.save();
            }
            if (this.$refs.error) {
                this.$refs.error.save();
            }
            formData.parse = this.fetchForm.parse ? designerForm.parseFn(this.fetchForm.parse) : '';
            formData.onError = this.fetchForm.onError || '';
            item.fetch = formData;
        },
        saveItem() {
            this.saveCurrentItem();
        },
        removeItem(index) {
            if (this.activeIndex === index) {
                this.activeIndex = -1;
                this.defActive = '';
            } else if (this.activeIndex > index) {
                this.activeIndex--;
            }
            this.items.splice(index, 1);
        },
        startAdd(type) {
            this.adding = true;
            this.addType = type;
            this.addName = '';
        },
        cancelAdd() {
            this.adding = false;
            this.addName = '';
        },
        confirmAdd() {
            const name = (this.addName || '').trim();
            if (!name) return;
            if (this.items.some(item => item.name === name)) {
                return errorMessage(this.t('globalData.nameExists'));
            }
            const item = {name, type: this.addType};
            if (this.addType === 'static') {
                item.data = '';
            } else {
                item.fetch = {};
            }
            this.items.push(item);
            this.cancelAdd();
            this.selectItem(this.items.length - 1);
        },
        submit() {
            this.saveCurrentItem();
            const value = {_items: deepCopy(this.items)};
            this.$emit('update:modelValue', value);
            this.visible = false;
        },
    }
});
</script>

<style>
._fd-gd-config, ._fd-gd-config .el-badge {
    width: 100%;
}

._fd-gd-config .el-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-gd-dialog .el-dialog__body {
    padding: 10px 20px;
}

._fd-gd-con .el-main {
    padding: 0;
}

._fd-gd-l, ._fd-gd-r {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    border: 1px solid #ececec;
}

._fd-gd-r {
    border-left: 0 none;
}

._fd-gd-head {
    display: flex;
    padding: 5px 15px;
    border-bottom: 1px solid #eee;
    background: #f8f9ff;
    align-items: center;
    justify-content: space-between;
}

._fd-gd-head-tip {
    font-size: 12px;
    color: #999;
}

._fd-gd-l > .el-main {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

._fd-gd-r > .el-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
}

._fd-gd-l .el-menu {
    padding: 0 10px 5px;
    border-right: 0 none;
    width: 100%;
    border-top: 0 none;
}

._fd-gd-l .el-menu-item {
    height: auto;
    line-height: 1em;
    border: 1px solid #ECECEC;
    border-radius: 5px;
    padding: 0 10px;
    margin-top: 5px;
}

._fd-gd-l .el-menu-item.is-active {
    background: #e4e7ed;
    color: #303133;
}

._fd-gd-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0;
}

._fd-gd-item-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

._fd-gd-item-name {
    font-size: 14px;
    font-family: monospace;
    color: #303133;
}

._fd-gd-item-del {
    font-size: 18px;
    color: #F56C6C;
    cursor: pointer;
}

._fd-gd-add {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    gap: 5px;
}

._fd-gd-add .fc-icon {
    font-size: 18px;
    cursor: pointer;
    color: #282828;
}

._fd-gd-btns {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 0 8px 0;
    gap: 5px;
}

._fd-gd-con .CodeMirror {
    height: 100%;
    width: 100%;
}
</style>
