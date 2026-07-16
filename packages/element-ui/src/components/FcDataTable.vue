<template>
    <div class="_fc-data-table">
        <el-table
            ref="table"
            v-loading="filterLoading > 0 || cursorLoading"
            :data="displayData"
            :border="border"
            :stripe="stripe"
            :size="size || 'default'"
            :row-key="rowKey || undefined"
            :height="height || undefined"
            :max-height="maxHeight || undefined"
            :empty-text="emptyText || undefined"
            :highlight-current-row="highlightCurrentRow"
            style="width: 100%"
            @selection-change="onSelectionChange"
            @sort-change="onSortChange"
            @filter-change="onFilterChange"
            @row-click="onRowClick">
            <el-table-column v-if="selection" type="selection" width="50" align="center" :reserve-selection="!!rowKey"/>
            <el-table-column v-if="showIndex" type="index" label="#" width="60" align="center"/>
            <el-table-column
                v-for="(col, idx) in normalizedColumns"
                :key="col.prop || idx"
                :prop="col.prop"
                :column-key="col.prop || undefined"
                :label="col.label"
                :width="col.width || undefined"
                :align="col.align || undefined"
                :fixed="colFixed(col)"
                :sortable="colSortable(col)"
                :show-overflow-tooltip="col.overflow === 'tooltip'"
                :class-name="col.className || undefined"
                :filters="filterEnabled(col) ? (filterOptions[col.prop] || []) : undefined"
                :filtered-value="filterEnabled(col) ? (filterState[col.prop] || []) : undefined">
                <template v-if="col.render && col.render !== 'normal'" #default="scope">
                    <el-tag v-if="col.render === 'tag'" disable-transitions>{{ display(scope.row, col.prop) }}</el-tag>
                    <el-link v-else-if="col.render === 'link'" type="primary" :underline="false"
                             @click.stop="onLinkClick(scope.row, col.prop)">{{ display(scope.row, col.prop) }}</el-link>
                    <el-image v-else-if="col.render === 'image' && display(scope.row, col.prop)"
                              :src="display(scope.row, col.prop)" fit="cover"
                              :preview-src-list="[display(scope.row, col.prop)]" class="_fc-data-table-img"/>
                </template>
            </el-table-column>
            <el-table-column v-if="hasActions" :label="actionColLabel" align="center"
                             :fixed="actionFixed || undefined" :width="actionWidth || undefined"
                             class-name="_fc-data-table-actions">
                <template #default="scope">
                    <span v-for="(act, i) in actions" :key="act.id || i">
                        <el-button
                            v-if="!actionHidden(act, scope.row, scope.$index)"
                            :type="act.type || undefined"
                            :size="act.size || 'small'"
                            :text="hasDecorate(act, 'text')"
                            :round="hasDecorate(act, 'round')"
                            :plain="hasDecorate(act, 'plain')"
                            :loading="isActionLoading(act, scope.row, scope.$index)"
                            :disabled="actionDisabled(act, scope.row, scope.$index)"
                            @click="onActionClick(act, scope.row, scope.$index)">
                            {{ act.label }}
                        </el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="pagination && !cursorEnabled" class="_fc-data-table-pager">
            <el-pagination
                small
                :current-page="currentPage"
                :page-size="innerPageSize"
                :page-sizes="pageSizeOptions"
                :total="displayTotal"
                layout="sizes, prev, pager, next, jumper, total"
                @current-change="onPageChange"
                @size-change="onSizeChange"/>
        </div>
        <div v-if="cursorEnabled && (canCursorPrev || canCursorNext || cursorLoading)" class="_fc-data-table-cursor-pager">
            <el-button v-if="canCursorPrev" size="small" :disabled="cursorLoading" @click="loadCursorPrev">
                {{ cursorPrevLabel }}
            </el-button>
            <el-button v-if="canCursorNext || cursorLoading" size="small" type="primary" :disabled="cursorLoading || !canCursorNext" @click="loadCursorNext">
                {{ cursorNextLabel }}
            </el-button>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import {ElMessageBox} from 'element-plus';
import {message} from '../utils/message';

const actionRowIds = new WeakMap();
let actionRowIdSeed = 0;

export default defineComponent({
    name: 'FcDataTable',
    emits: [
        'selectionChange', 'sortChange', 'filterChange', 'pageChange', 'cursorPageChange',
        'rowClick', 'linkClick', 'actionClick', 'actionSuccess', 'actionError', 'actionFinally',
    ],
    props: {
        formCreateInject: Object,
        modelValue: {
            type: Array,
            default: undefined,
        },
        data: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Array,
            default: () => [],
        },
        actions: {
            type: Array,
            default: () => [],
        },
        actionLabel: {
            type: String,
            default: '',
        },
        actionWidth: [String, Number],
        actionFixed: {
            type: [Boolean, String],
            default: false,
        },
        border: {
            type: Boolean,
            default: true,
        },
        stripe: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: 'default',
        },
        rowKey: String,
        height: [String, Number],
        maxHeight: [String, Number],
        emptyText: String,
        showIndex: {
            type: Boolean,
            default: false,
        },
        selection: {
            type: Boolean,
            default: false,
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false,
        },
        pagination: {
            type: Boolean,
            default: false,
        },
        remotePagination: {
            type: Boolean,
            default: false,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        total: {
            type: Number,
            default: 0,
        },
        cursorPagination: {
            type: [Object, Boolean],
            default: () => ({}),
        },
    },
    data() {
        return {
            currentPage: 1,
            innerPageSize: this.pageSize || 10,
            filterLoading: 0,
            cursorLoading: false,
            cursorRows: Array.isArray(this.modelValue) ? this.modelValue.slice() : (Array.isArray(this.data) ? this.data.slice() : []),
            cursorHasMore: false,
            cursorNextCursor: '',
            cursorPrevCursor: '',
            cursorCurrentCursor: '',
            cursorCursorStack: [],
            filterOptions: {},
            // 自管的筛选/排序状态，作用于全量数据（修复分页只对当页排序/筛选的问题）
            filterState: {},
            sortState: {prop: '', order: ''},
            selectionRows: [],
            actionLoading: {},
        };
    },
    computed: {
        normalizedColumns() {
            return (this.columns || []).filter(col => !col.hide);
        },
        hasActions() {
            return Array.isArray(this.actions) && this.actions.length > 0;
        },
        actionColLabel() {
            if (this.actionLabel) {
                return this.actionLabel;
            }
            const t = this.formCreateInject && this.formCreateInject.t;
            return (typeof t === 'function' && t('com.fcDataTable.actionDefault')) || '操作';
        },
        // 触发筛选项重新解析的签名：只在列的 prop / filter 配置变化时变化，避免改标题/宽度也重发请求
        filterSignature() {
            return JSON.stringify((this.columns || []).map(col => ({p: col.prop, f: col.filter})));
        },
        cursorConfig() {
            return this.normalizeCursorConfig(this.cursorPagination);
        },
        cursorEnabled() {
            return this.cursorConfig.enabled === true;
        },
        cursorRequestConfig() {
            return this.cursorConfig.request || {};
        },
        cursorResponseConfig() {
            return this.cursorConfig.response || {};
        },
        cursorLabels() {
            return this.cursorConfig.labels || {};
        },
        cursorAutoLoad() {
            return this.cursorConfig.autoLoad === true;
        },
        cursorInitialCursorValue() {
            return this.cursorRequestConfig.initialCursor;
        },
        sourceData() {
            const data = Array.isArray(this.modelValue) ? this.modelValue : this.data;
            return this.cursorEnabled ? this.cursorRows : (data || []);
        },
        filteredData() {
            let list = this.sourceData;
            const state = this.filterState;
            Object.keys(state).forEach(prop => {
                const vals = state[prop];
                if (vals && vals.length) {
                    list = list.filter(row => vals.some(v => this.looseEq(row ? row[prop] : undefined, v)));
                }
            });
            return list;
        },
        sortedData() {
            const list = this.filteredData.slice();
            const {prop, order} = this.sortState;
            if (prop && order) {
                const factor = order === 'descending' ? -1 : 1;
                list.sort((a, b) => factor * this.compareValues(a ? a[prop] : undefined, b ? b[prop] : undefined));
            }
            return list;
        },
        displayTotal() {
            return this.remotePagination ? (Number(this.total) || 0) : this.sortedData.length;
        },
        displayData() {
            return this.cursorEnabled ? this.sortedData : this.pagedData;
        },
        pagedData() {
            const list = this.sortedData;
            if (!this.pagination || this.remotePagination) {
                return list;
            }
            const size = this.innerPageSize || 10;
            const start = (this.currentPage - 1) * size;
            return list.slice(start, start + size);
        },
        pageSizeOptions() {
            const base = [10, 20, 50, 100];
            const size = this.innerPageSize || 10;
            return base.indexOf(size) > -1 ? base : [size, ...base].sort((a, b) => a - b);
        },
        canCursorPrev() {
            return this.hasCursorValue(this.cursorPrevCursor) || this.cursorCursorStack.length > 0;
        },
        canCursorNext() {
            return this.cursorHasMore && this.hasCursorValue(this.cursorNextCursor);
        },
        cursorPrevLabel() {
            return this.cursorLabels.prev || this.translate('cursorPrev', '上一页');
        },
        cursorNextLabel() {
            return this.cursorLabels.next || this.translate('cursorNext', '下一页');
        },
    },
    watch: {
        data(v) {
            if (!Array.isArray(this.modelValue) && this.cursorEnabled && !this.cursorAutoLoad) {
                this.cursorRows = Array.isArray(v) ? v.slice() : [];
            }
        },
        modelValue(v) {
            if (this.cursorEnabled && !this.cursorAutoLoad) {
                const data = Array.isArray(v) ? v : this.data;
                this.cursorRows = Array.isArray(data) ? data.slice() : [];
            }
        },
        cursorPagination: {
            deep: true,
            handler() {
                this.resetCursorState();
                if (this.cursorEnabled && this.cursorAutoLoad) {
                    this.loadCursorFirst();
                }
            },
        },
        displayTotal() {
            const maxPage = Math.max(1, Math.ceil(this.displayTotal / (this.innerPageSize || 10)));
            if (this.currentPage > maxPage) {
                this.currentPage = maxPage;
            }
        },
        pageSize(v) {
            this.innerPageSize = v || 10;
            this.currentPage = 1;
        },
        filterSignature() {
            this.syncFilterState();
            this.resolveFilters();
        },
    },
    mounted() {
        this.resolveFilters();
        if (this.cursorEnabled && this.cursorAutoLoad) {
            this.loadCursorFirst();
        }
    },
    methods: {
        translate(key, fallback) {
            const t = this.formCreateInject && this.formCreateInject.t;
            return (typeof t === 'function' && t('com.fcDataTable.' + key)) || fallback;
        },
        onPageChange(page) {
            this.currentPage = page;
            this.$emit('pageChange', {page, pageSize: this.innerPageSize});
        },
        onSizeChange(size) {
            this.innerPageSize = size;
            this.currentPage = 1;
            this.$emit('pageChange', {page: this.currentPage, pageSize: size});
        },
        onRowClick(row, column, event) {
            this.$emit('rowClick', row, column, event);
        },
        onLinkClick(row, prop) {
            this.$emit('linkClick', row, prop);
        },
        display(row, prop) {
            const v = row ? row[prop] : undefined;
            return v == null ? '' : v;
        },
        colFixed(col) {
            return (col.fixed === 'left' || col.fixed === 'right') ? col.fixed : false;
        },
        colSortable(col) {
            // 两种排序都交给组件自己处理（custom 模式 el-table 只发事件不排序），
            // 常规排序在本组件内对全量数据排序，接口排序则把事件抛给外部去取数。
            return (col.sort === 'normal' || col.sort === 'custom') ? 'custom' : false;
        },
        compareValues(a, b) {
            if (a == null && b == null) return 0;
            if (a == null) return -1;
            if (b == null) return 1;
            const na = Number(a);
            const nb = Number(b);
            if (!isNaN(na) && !isNaN(nb)) return na - nb;
            return String(a).localeCompare(String(b));
        },
        looseEq(a, b) {
            return a === b || String(a) === String(b);
        },
        isObject(value) {
            return value && Object.prototype.toString.call(value) === '[object Object]';
        },
        defaultCursorConfig() {
            return {
                enabled: false,
                preset: 'nextCursorHasMore',
                autoLoad: false,
                fetch: {},
                request: {
                    cursorPath: '',
                    pageSizePath: '',
                    pageSize: 0,
                    initialCursor: '',
                    emptyCursorBehavior: 'omit',
                },
                response: {
                    rowsPath: '',
                    nextCursorPath: '',
                    hasMorePath: '',
                    prevCursorPath: '',
                    totalPath: '',
                },
                labels: {
                    prev: '',
                    next: '',
                },
            };
        },
        cursorPresetConfig(preset) {
            const presets = {
                nextCursorHasMore: {
                    request: {
                        cursorPath: 'data.cursor',
                    },
                    response: {
                        rowsPath: 'rows',
                        nextCursorPath: 'next_cursor',
                        hasMorePath: 'has_more',
                    },
                },
                nextCursorOnly: {
                    request: {
                        cursorPath: 'data.cursor',
                    },
                    response: {
                        rowsPath: 'rows',
                        nextCursorPath: 'next_cursor',
                        hasMorePath: '',
                    },
                },
                pageToken: {
                    request: {
                        cursorPath: 'query.pageToken',
                    },
                    response: {
                        rowsPath: 'data.items',
                        nextCursorPath: 'data.nextPageToken',
                        hasMorePath: '',
                    },
                },
                offsetLimit: {
                    request: {
                        cursorPath: 'query.offset',
                        pageSizePath: 'query.limit',
                        pageSize: 20,
                        initialCursor: 0,
                        emptyCursorBehavior: 'keep',
                    },
                    response: {
                        rowsPath: 'rows',
                        nextCursorPath: 'next_cursor',
                        hasMorePath: 'has_more',
                    },
                },
            };
            return presets[preset] || presets.nextCursorHasMore;
        },
        clone(value) {
            if (Array.isArray(value)) {
                return value.map(item => this.clone(item));
            }
            if (this.isObject(value)) {
                const ret = {};
                Object.keys(value).forEach(key => {
                    ret[key] = this.clone(value[key]);
                });
                return ret;
            }
            return value;
        },
        mergeObject(base, source, skipEmptyString = false) {
            const ret = this.clone(base);
            if (!this.isObject(source)) {
                return ret;
            }
            Object.keys(source).forEach(key => {
                if (this.isObject(ret[key]) && this.isObject(source[key])) {
                    ret[key] = this.mergeObject(ret[key], source[key], skipEmptyString);
                } else if (source[key] !== undefined && (!skipEmptyString || source[key] !== '')) {
                    ret[key] = this.clone(source[key]);
                }
            });
            return ret;
        },
        normalizeCursorConfig(value) {
            const base = this.defaultCursorConfig();
            if (value === true) {
                base.enabled = true;
                return this.mergeObject(base, this.cursorPresetConfig(base.preset));
            }
            const source = this.isObject(value) ? value : {};
            const presetName = source.preset || base.preset;
            const config = this.mergeObject(this.mergeObject(base, this.cursorPresetConfig(presetName)), source, true);
            config.enabled = config.enabled === true;
            config.preset = presetName;
            return config;
        },
        pathParts(path) {
            return String(path || '').split('.').filter(Boolean);
        },
        getByPath(target, path, defaultValue) {
            const parts = this.pathParts(path);
            if (!parts.length) {
                return target === undefined ? defaultValue : target;
            }
            let value = target;
            for (let i = 0; i < parts.length; i++) {
                if (value == null) {
                    return defaultValue;
                }
                value = value[parts[i]];
            }
            return value === undefined ? defaultValue : value;
        },
        setByPath(target, path, value) {
            const parts = this.pathParts(path);
            if (!parts.length) {
                return;
            }
            let cur = target;
            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i];
                if (!this.isObject(cur[key])) {
                    cur[key] = {};
                }
                cur = cur[key];
            }
            cur[parts[parts.length - 1]] = value;
        },
        deleteByPath(target, path) {
            const parts = this.pathParts(path);
            if (!parts.length) {
                return;
            }
            let cur = target;
            for (let i = 0; i < parts.length - 1; i++) {
                cur = cur && cur[parts[i]];
                if (cur == null) {
                    return;
                }
            }
            if (cur && Object.prototype.hasOwnProperty.call(cur, parts[parts.length - 1])) {
                delete cur[parts[parts.length - 1]];
            }
        },
        normalizeBoolean(value) {
            return value === true || value === 1 || value === '1' || value === 'true';
        },
        hasCursorValue(value) {
            return value !== undefined && value !== null && value !== '';
        },
        makeCursorFetchConfig(cursor) {
            const fetchConfig = this.cursorConfig.fetch;
            if (!fetchConfig || typeof fetchConfig !== 'object') {
                return null;
            }
            const config = this.clone(fetchConfig);
            if (!Object.keys(config).length) {
                return null;
            }
            const request = this.cursorRequestConfig;
            const cursorPath = request.cursorPath;
            if (cursorPath) {
                if (!this.hasCursorValue(cursor)) {
                    if (request.emptyCursorBehavior === 'keep') {
                        this.setByPath(config, cursorPath, '');
                    } else if (request.emptyCursorBehavior === 'null') {
                        this.setByPath(config, cursorPath, null);
                    } else {
                        this.deleteByPath(config, cursorPath);
                    }
                } else {
                    this.setByPath(config, cursorPath, cursor);
                }
            }
            if (request.pageSizePath && Number(request.pageSize) > 0) {
                this.setByPath(config, request.pageSizePath, Number(request.pageSize));
            }
            return config;
        },
        resetCursorState() {
            const data = Array.isArray(this.modelValue) ? this.modelValue : this.data;
            this.cursorRows = Array.isArray(data) ? data.slice() : [];
            this.cursorHasMore = false;
            this.cursorNextCursor = '';
            this.cursorPrevCursor = '';
            this.cursorCurrentCursor = this.hasCursorValue(this.cursorInitialCursorValue) ? this.cursorInitialCursorValue : '';
            this.cursorCursorStack = [];
        },
        loadCursorFirst() {
            const cursor = this.hasCursorValue(this.cursorInitialCursorValue) ? this.cursorInitialCursorValue : '';
            return this.loadCursorPage(cursor, [], 'first');
        },
        loadCursorNext() {
            if (!this.canCursorNext || this.cursorLoading) {
                return undefined;
            }
            const currentCursor = this.hasCursorValue(this.cursorCurrentCursor) ? this.cursorCurrentCursor : '';
            return this.loadCursorPage(this.cursorNextCursor, this.cursorCursorStack.concat([currentCursor]), 'next');
        },
        loadCursorPrev() {
            if (!this.canCursorPrev || this.cursorLoading) {
                return undefined;
            }
            const stack = this.cursorCursorStack.slice();
            const cursor = this.hasCursorValue(this.cursorPrevCursor) ? this.cursorPrevCursor : stack.pop();
            if (stack.length && cursor === stack[stack.length - 1]) {
                stack.pop();
            }
            return this.loadCursorPage(this.hasCursorValue(cursor) ? cursor : '', stack, 'prev');
        },
        loadCursorPage(cursor, stack, direction) {
            const api = this.formCreateInject && this.formCreateInject.api;
            const fetchConfig = this.makeCursorFetchConfig(cursor);
            if (!api || typeof api.fetch !== 'function' || !fetchConfig) {
                return undefined;
            }
            this.cursorLoading = true;
            return api.fetch(fetchConfig)
                .then(res => {
                    const response = this.cursorResponseConfig;
                    const rows = this.getByPath(res, response.rowsPath, Array.isArray(res) ? res : []);
                    const nextCursor = this.getByPath(res, response.nextCursorPath, '');
                    const prevCursor = response.prevCursorPath ? this.getByPath(res, response.prevCursorPath, '') : '';
                    const rawHasMore = response.hasMorePath ? this.getByPath(res, response.hasMorePath, undefined) : undefined;
                    const total = response.totalPath ? this.getByPath(res, response.totalPath, undefined) : undefined;
                    this.cursorRows = Array.isArray(rows) ? rows : [];
                    this.cursorHasMore = rawHasMore === undefined ? this.hasCursorValue(nextCursor) : this.normalizeBoolean(rawHasMore);
                    this.cursorNextCursor = nextCursor;
                    this.cursorPrevCursor = prevCursor;
                    this.cursorCurrentCursor = this.hasCursorValue(cursor) ? cursor : '';
                    this.cursorCursorStack = Array.isArray(stack) ? stack.slice() : [];
                    this.$emit('cursorPageChange', {
                        direction,
                        cursor: this.cursorCurrentCursor,
                        nextCursor: this.cursorNextCursor,
                        hasMore: this.cursorHasMore,
                        page: this.cursorCursorStack.length + 1,
                        rows: this.cursorRows,
                        total,
                        response: res,
                    });
                })
                .catch(e => {
                    // eslint-disable-next-line no-console
                    console.warn('[FcDataTable] cursor page request failed:', e);
                    this.$emit('cursorPageChange', {direction, cursor, error: e});
                })
                .finally(() => {
                    this.cursorLoading = false;
                });
        },
        filterEnabled(col) {
            return !!(col && col.prop && col.filter && typeof col.filter === 'object' && col.filter.type);
        },
        toFilterItems(res) {
            if (!Array.isArray(res)) {
                return [];
            }
            return res.map(item => {
                if (item && typeof item === 'object') {
                    const text = item.label != null ? item.label : (item.text != null ? item.text : item.value);
                    return {text: String(text), value: item.value};
                }
                return {text: String(item), value: item};
            });
        },
        resolveFilters() {
            const api = this.formCreateInject && this.formCreateInject.api;
            (this.columns || []).forEach(col => {
                if (!this.filterEnabled(col)) {
                    return;
                }
                const f = col.filter;
                const prop = col.prop;
                if (f.type === 'static') {
                    this.filterOptions[prop] = this.toFilterItems(f.options);
                } else if (f.type === 'global' && api && api.getGlobalData && f.global) {
                    this.filterLoading++;
                    api.getGlobalData(f.global)
                        .then(res => {
                            this.filterOptions[prop] = this.toFilterItems(res);
                        })
                        .catch(e => {
                            // eslint-disable-next-line no-console
                            console.warn('[FcDataTable] resolve global filter failed:', e);
                        })
                        .finally(() => this.filterLoading--);
                } else if (f.type === 'fetch' && api && api.fetch && f.fetch && Object.keys(f.fetch).length) {
                    this.filterLoading++;
                    api.fetch(f.fetch)
                        .then(res => {
                            this.filterOptions[prop] = this.toFilterItems(res);
                        })
                        .catch(e => {
                            // eslint-disable-next-line no-console
                            console.warn('[FcDataTable] resolve fetch filter failed:', e);
                        })
                        .finally(() => this.filterLoading--);
                }
            });
        },
        syncFilterState() {
            const enabledProps = new Set((this.columns || [])
                .filter(col => this.filterEnabled(col))
                .map(col => col.prop));
            const nextState = {};
            Object.keys(this.filterState || {}).forEach(prop => {
                if (enabledProps.has(prop)) {
                    nextState[prop] = this.filterState[prop];
                }
            });
            const nextOptions = {};
            Object.keys(this.filterOptions || {}).forEach(prop => {
                if (enabledProps.has(prop)) {
                    nextOptions[prop] = this.filterOptions[prop];
                }
            });
            this.filterState = nextState;
            this.filterOptions = nextOptions;
        },
        onSelectionChange(rows) {
            this.selectionRows = Array.isArray(rows) ? rows.slice() : [];
            this.$emit('selectionChange', rows);
        },
        onSortChange({prop, order}) {
            const col = (this.columns || []).find(c => c.prop === prop);
            // 接口排序(custom)只抛事件，由外部重新取数；常规排序在本地对全量数据排序
            if (col && col.sort === 'custom') {
                this.sortState = {prop: '', order: ''};
            } else {
                this.sortState = {prop: prop || '', order: order || ''};
            }
            this.currentPage = 1;
            this.$emit('sortChange', {prop, order});
        },
        onFilterChange(filters) {
            const next = {...this.filterState};
            Object.keys(filters || {}).forEach(key => {
                next[key] = filters[key];
            });
            this.filterState = next;
            this.currentPage = 1;
            this.$emit('filterChange', next);
        },
        hasDecorate(act, key) {
            return Array.isArray(act.decorate) && act.decorate.indexOf(key) > -1;
        },
        makeActionContext(act, row, index) {
            return {
                action: act,
                row,
                index,
                table: this,
                tableRef: this.$refs.table,
                api: this.formCreateInject && this.formCreateInject.api,
                emit: (...args) => this.$emit(...args),
                selectedRows: this.getSelectedRows(),
            };
        },
        callFn(fn, row, index, act, context) {
            if (typeof fn !== 'function') {
                return undefined;
            }
            return fn.call(this, row, index, act, context || this.makeActionContext(act, row, index));
        },
        actionHidden(act, row, index) {
            if (act.hide) {
                return true;
            }
            try {
                return this.callFn(act.hiddenFn, row, index, act) === true;
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
                return false;
            }
        },
        actionDisabled(act, row, index) {
            if (this.hasDecorate(act, 'disabled') || this.isActionLoading(act, row, index)) {
                return true;
            }
            try {
                return this.callFn(act.disabledFn, row, index, act) === true;
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
                return false;
            }
        },
        getRowIdentity(row, index) {
            if (this.rowKey && row && row[this.rowKey] !== undefined) {
                return String(row[this.rowKey]);
            }
            if (row && typeof row === 'object') {
                if (!actionRowIds.has(row)) {
                    actionRowIds.set(row, ++actionRowIdSeed);
                }
                return String(actionRowIds.get(row));
            }
            return String(index);
        },
        getActionLoadingKey(act, row, index) {
            return (act.id || this.actions.indexOf(act)) + ':' + this.getRowIdentity(row, index);
        },
        isActionLoading(act, row, index) {
            return !!this.actionLoading[this.getActionLoadingKey(act, row, index)];
        },
        setActionLoading(act, row, index, loading) {
            const key = this.getActionLoadingKey(act, row, index);
            if (loading) {
                this.actionLoading = {...this.actionLoading, [key]: true};
            } else {
                const next = {...this.actionLoading};
                delete next[key];
                this.actionLoading = next;
            }
        },
        getSelectedRows() {
            const table = this.$refs.table;
            if (table && typeof table.getSelectionRows === 'function') {
                return table.getSelectionRows();
            }
            return this.selectionRows.slice();
        },
        requestActionConfirm(act) {
            if (!act.confirm || (typeof act.confirm === 'object' && act.confirm.enabled === false)) {
                return Promise.resolve(true);
            }
            const config = typeof act.confirm === 'object' ? act.confirm : {};
            const message = typeof act.confirm === 'string'
                ? act.confirm
                : (config.message || this.translate('actionConfirm', '确认执行该操作吗？'));
            const title = config.title || this.translate('actionConfirmTitle', '提示');
            const options = {...config};
            delete options.message;
            delete options.title;
            delete options.enabled;
            return ElMessageBox.confirm(message, title, options).then(() => true).catch(() => false);
        },
        resolveAction(action) {
            return typeof action === 'string'
                ? (this.actions || []).find(item => item && item.id === action)
                : action;
        },
        executeAction(action, row, index, options = {}) {
            const act = this.resolveAction(action);
            if (index === undefined || index === null) {
                index = this.displayData.indexOf(row);
            }
            if (!act || this.isActionLoading(act, row, index)) {
                return Promise.resolve(undefined);
            }
            const context = this.makeActionContext(act, row, index);
            const payload = {action: act, row, index, context};
            this.$emit('actionClick', payload);
            const confirm = options.skipConfirm ? Promise.resolve(true) : this.requestActionConfirm(act);
            return confirm.then(confirmed => {
                if (!confirmed) {
                    return undefined;
                }
                if (this.isActionLoading(act, row, index)) {
                    return undefined;
                }
                this.setActionLoading(act, row, index, true);
                return Promise.resolve().then(() => this.callFn(act.clickFn, row, index, act, context))
                    .then(result => {
                        const successPayload = {...payload, result};
                        if (act.successMessage) {
                            message(act.successMessage, 'success');
                        }
                        this.$emit('actionSuccess', successPayload);
                        return result;
                    })
                    .catch(error => {
                        const errorPayload = {...payload, error};
                        if (act.errorMessage) {
                            message(act.errorMessage, 'error');
                        }
                        this.$emit('actionError', errorPayload);
                        throw error;
                    })
                    .finally(() => {
                        this.setActionLoading(act, row, index, false);
                        this.$emit('actionFinally', payload);
                    });
            });
        },
        onActionClick(act, row, index) {
            this.executeAction(act, row, index).catch(error => {
                // The error is exposed through actionError; avoid an unhandled click promise.
                // eslint-disable-next-line no-console
                console.error(error);
            });
        },
    },
});
</script>

<style>
._fc-data-table {
    width: 100%;
}

._fc-data-table-pager {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
}

._fc-data-table-cursor-pager {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 10px;
}

._fc-data-table-img {
    height: 40px;
    width: 40px;
    border-radius: 4px;
}
</style>
