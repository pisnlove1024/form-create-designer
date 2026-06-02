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

export default {
    menu: 'main',
    icon: 'icon-table',
    label,
    name,
    input: false,
    mask: true,
    event: ['selectionChange', 'sortChange', 'filterChange', 'pageChange', 'rowClick', 'linkClick', 'actionClick'],
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
        ]);
    }
};
