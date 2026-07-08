import uniqueId from '@form-create/utils/lib/unique';
import {localeOptions, localeProps} from '../../utils';

const label = '数据表格';
const name = 'fcDataTable';

const defaultColumns = [
    {prop: 'name', label: '名称', width: '', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'left', render: 'normal', hide: false},
    {prop: 'status', label: '状态', width: '', filter: '', className: '', sort: '', overflow: '', fixed: '', align: 'center', render: 'tag', hide: false},
];

const defaultData = [
    {name: '示例A', status: 1},
    {name: '示例B', status: 0},
];

const defaultCursorPagination = {
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

const makeDefaultCursorPagination = () => JSON.parse(JSON.stringify(defaultCursorPagination));

export default {
    menu: 'main',
    icon: 'icon-table',
    label,
    name,
    input: false,
    mask: true,
    event: ['selectionChange', 'sortChange', 'filterChange', 'pageChange', 'cursorPageChange', 'rowClick', 'linkClick', 'actionClick'],
    rule({t}) {
        return {
            type: name,
            field: uniqueId(),
            title: t('com.fcDataTable.name'),
            info: '',
            $required: false,
            props: {
                data: defaultData,
                columns: defaultColumns,
                actions: [],
                actionLabel: '',
                actionWidth: '',
                actionFixed: '',
                border: true,
                stripe: false,
                size: 'default',
                showIndex: false,
                selection: false,
                highlightCurrentRow: false,
                pagination: false,
                remotePagination: false,
                pageSize: 10,
                total: 0,
                cursorPagination: makeDefaultCursorPagination(),
                height: '',
                maxHeight: '',
                emptyText: '',
                rowKey: '',
            },
            effect: {
                fetch: ''
            },
            style: {
                width: '100%',
            }
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            {
                type: 'radio',
                title: t('fetch.optionsType.struct'),
                field: '_dataType',
                value: 2,
                options: [
                    {label: t('fetch.optionsType.struct'), value: 2},
                    {label: t('fetch.optionsType.fetch'), value: 1},
                    {label: t('fetch.optionsType.global'), value: 3},
                ],
                props: {
                    type: 'button'
                },
                control: [
                    {
                        value: 1,
                        rule: [
                            {
                                type: 'FetchConfig',
                                field: 'formCreateEffect>fetch',
                                props: {
                                    to: 'props.data'
                                }
                            }
                        ]
                    },
                    {
                        value: 2,
                        rule: [
                            {
                                type: 'Struct',
                                field: 'data',
                                props: {
                                    defaultValue: defaultData
                                }
                            }
                        ]
                    },
                    {
                        value: 3,
                        rule: [
                            {
                                type: 'GlobalDataSelect',
                                field: 'formCreateEffect>globalData',
                                title: t('fetch.optionsType.global'),
                                props: {
                                    to: 'props.data'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: 'DataTableColumns',
                field: 'columns',
            },
            {
                type: 'DataTableActions',
                field: 'actions',
            },
            {
                type: 'input',
                field: 'actionLabel',
            },
            {
                type: 'input',
                field: 'actionWidth',
            },
            {
                type: 'select',
                field: 'actionFixed',
                options: localeOptions(t, [
                    {label: 'normal', value: ''},
                    {label: 'left', value: 'left'},
                    {label: 'right', value: 'right'},
                ], 'com.fcDataTable.fixedType'),
            },
            {
                type: 'input',
                field: 'emptyText',
            },
            {
                type: 'input',
                field: 'rowKey',
            },
            {
                type: 'input',
                field: 'height',
            },
            {
                type: 'input',
                field: 'maxHeight',
            },
            {
                type: 'switch',
                field: 'border',
                value: true,
            },
            {
                type: 'switch',
                field: 'stripe',
            },
            {
                type: 'switch',
                field: 'showIndex',
            },
            {
                type: 'switch',
                field: 'selection',
            },
            {
                type: 'switch',
                field: 'highlightCurrentRow',
            },
            {
                type: 'select',
                field: 'size',
                value: 'default',
                options: localeOptions(t, [
                    {label: 'default', value: 'default'},
                    {label: 'large', value: 'large'},
                    {label: 'small', value: 'small'},
                ], 'com.fcDataTable.sizes'),
            },
            {
                type: 'switch',
                field: 'pagination',
                control: [
                    {
                        value: true,
                        rule: [
                            {
                                type: 'inputNumber',
                                field: 'pageSize',
                                title: t('com.fcDataTable.props.pageSize'),
                                value: 10,
                                props: {min: 1}
                            },
                            {
                                type: 'switch',
                                field: 'remotePagination',
                                title: t('com.fcDataTable.props.remotePagination'),
                            },
                            {
                                type: 'inputNumber',
                                field: 'total',
                                title: t('com.fcDataTable.props.total'),
                                value: 0,
                                props: {min: 0}
                            }
                        ]
                    }
                ]
            },
            {
                type: 'switch',
                field: 'cursorPagination>enabled',
                title: t('com.fcDataTable.props.cursorPagination'),
                warning: t('com.fcDataTable.cursorPaginationInfo'),
                control: [
                    {
                        value: true,
                        rule: [
                            {
                                type: 'select',
                                field: 'cursorPagination>preset',
                                title: t('com.fcDataTable.props.cursorPreset'),
                                value: 'nextCursorHasMore',
                                options: localeOptions(t, [
                                    {label: 'nextCursorHasMore', value: 'nextCursorHasMore'},
                                    {label: 'nextCursorOnly', value: 'nextCursorOnly'},
                                    {label: 'pageToken', value: 'pageToken'},
                                    {label: 'offsetLimit', value: 'offsetLimit'},
                                ], 'com.fcDataTable.cursorPresets'),
                                warning: t('com.fcDataTable.cursorPresetInfo'),
                            },
                            {
                                type: 'FetchConfig',
                                field: 'cursorPagination>fetch',
                                title: t('com.fcDataTable.props.cursorFetch'),
                                warning: t('com.fcDataTable.cursorFetchInfo'),
                            },
                            {
                                type: 'switch',
                                field: 'cursorPagination>autoLoad',
                                title: t('com.fcDataTable.props.cursorAutoLoad'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>request>cursorPath',
                                title: t('com.fcDataTable.props.cursorRequestPath'),
                                warning: t('com.fcDataTable.cursorRequestPathInfo'),
                            },
                            {
                                type: 'inputNumber',
                                field: 'cursorPagination>request>pageSize',
                                title: t('com.fcDataTable.props.cursorPageSize'),
                                value: 0,
                                props: {min: 0},
                                warning: t('com.fcDataTable.cursorPageSizeInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>request>pageSizePath',
                                title: t('com.fcDataTable.props.cursorPageSizePath'),
                                warning: t('com.fcDataTable.cursorPageSizePathInfo'),
                            },
                            {
                                type: 'select',
                                field: 'cursorPagination>request>emptyCursorBehavior',
                                title: t('com.fcDataTable.props.cursorEmptyCursorBehavior'),
                                value: 'omit',
                                options: localeOptions(t, [
                                    {label: 'omit', value: 'omit'},
                                    {label: 'keep', value: 'keep'},
                                    {label: 'null', value: 'null'},
                                ], 'com.fcDataTable.emptyCursorBehavior'),
                                warning: t('com.fcDataTable.cursorEmptyCursorBehaviorInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>request>initialCursor',
                                title: t('com.fcDataTable.props.cursorInitialCursor'),
                                warning: t('com.fcDataTable.cursorInitialCursorInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>response>rowsPath',
                                title: t('com.fcDataTable.props.cursorDataPath'),
                                warning: t('com.fcDataTable.cursorDataPathInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>response>nextCursorPath',
                                title: t('com.fcDataTable.props.cursorNextPath'),
                                warning: t('com.fcDataTable.cursorNextPathInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>response>hasMorePath',
                                title: t('com.fcDataTable.props.cursorHasMorePath'),
                                warning: t('com.fcDataTable.cursorHasMorePathInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>response>prevCursorPath',
                                title: t('com.fcDataTable.props.cursorPrevPath'),
                                warning: t('com.fcDataTable.cursorPrevPathInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>response>totalPath',
                                title: t('com.fcDataTable.props.cursorTotalPath'),
                                warning: t('com.fcDataTable.cursorTotalPathInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>labels>prev',
                                title: t('com.fcDataTable.props.cursorPrevLabel'),
                                warning: t('com.fcDataTable.cursorPrevLabelInfo'),
                            },
                            {
                                type: 'input',
                                field: 'cursorPagination>labels>next',
                                title: t('com.fcDataTable.props.cursorNextLabel'),
                                warning: t('com.fcDataTable.cursorNextLabelInfo'),
                            }
                        ]
                    }
                ]
            },
        ]);
    }
};
