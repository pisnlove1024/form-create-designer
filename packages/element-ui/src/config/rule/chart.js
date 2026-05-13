import uniqueId from '@form-create/utils/lib/unique';
import {localeOptions, localeProps} from '../../utils';

const label = '图表';
const name = 'fcChart';

const defaultChartData = {
    category: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    series: [
        {name: '数据A', data: [120, 132, 101, 134, 90, 230, 210]},
        {name: '数据B', data: [220, 182, 191, 234, 290, 330, 310]},
        {name: '数据C', data: [150, 232, 201, 154, 190, 330, 410]},
        {name: '数据D', data: [320, 332, 301, 334, 390, 330, 320]},
        {name: '数据E', data: [820, 932, 901, 934, 1290, 1330, 1320]},
    ]
};

export default {
    menu: 'aide',
    icon: 'icon-statistic',
    label,
    name,
    input: true,
    mask: true,
    event: [],
    rule({t}) {
        return {
            type: name,
            field: uniqueId(),
            title: t('com.fcChart.name'),
            info: '',
            $required: false,
            props: {
                chartType: 'line',
                chartData: defaultChartData,
                chartName: '',
                chartDescription: '',
                valueFormat: '{value}',
                stack: false,
                smooth: false,
                showSymbol: true,
                showLabel: false,
                showAverageLine: false,
            },
            effect: {
                fetch: ''
            },
            style: {
                width: '100%',
                height: '300px',
            }
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            {
                type: 'select',
                field: 'chartType',
                value: 'line',
                options: localeOptions(t, [
                    {label: 'line', value: 'line'},
                    {label: 'area', value: 'area'},
                    {label: 'bar', value: 'bar'},
                    {label: 'horizontalBar', value: 'horizontalBar'},
                    {label: 'pie', value: 'pie'},
                    {label: 'funnel', value: 'funnel'},
                ], 'com.fcChart.chartTypes'),
                control: [
                    {
                        value: ['line', 'area', 'bar'],
                        condition: 'in',
                        rule: [
                            {
                                type: 'switch',
                                field: 'showAverageLine',
                                title: t('com.fcChart.props.showAverageLine'),
                            }
                        ]
                    },
                ]
            },
            {
                type: 'radio',
                title: t('com.fcChart.props.dataSource'),
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
                                    to: 'props.chartData'
                                }
                            }
                        ]
                    },
                    {
                        value: 2,
                        rule: [
                            {
                                type: 'Struct',
                                field: 'chartData',
                                props: {
                                    defaultValue: defaultChartData
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
                                    to: 'props.chartData'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: 'input',
                field: 'chartName',
            },
            {
                type: 'input',
                field: 'chartDescription',
            },
            {
                type: 'input',
                field: 'valueFormat',
                value: '{value}',
            },
            {
                type: 'switch',
                field: 'stack',
            },
            {
                type: 'switch',
                field: 'smooth',
            },
            {
                type: 'switch',
                field: 'showSymbol',
                value: true,
            },
            {
                type: 'switch',
                field: 'showLabel',
            },
        ]);
    }
};
