import uniqueId from '@form-create/utils/lib/unique';
import {localeOptions, localeProps} from '../../utils';

const label = '代码展示';
const name = 'fcCodePreview';

const defaultCodes = {
    javascript: 'function hello() {\n  console.log("Hello, World!");\n}',
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>',
    css: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n}',
    json: '{\n  "name": "example",\n  "version": "1.0.0",\n  "description": "A sample JSON"\n}',
    python: 'def hello():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    hello()',
    java: 'public class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    sql: 'SELECT id, name, email\nFROM users\nWHERE status = 1\nORDER BY name ASC\nLIMIT 10;',
    yaml: 'service:\n  name: pmt-api\n  replicas: 3\n  enabled: true',
    plaintext: 'Hello, World!',
};

function getDefaultCode(language) {
    return defaultCodes[language] || '';
}

function updateChartData(api, rule, code) {
    rule.props.chartData = code;
    api.setValue('formCreateProps>chartData', code);
}

function syncChartData(rule, code) {
    rule.props.chartData = code;
}

export default {
    menu: 'aide',
    icon: 'icon-html',
    label,
    name,
    input: true,
    mask: true,
    event: ['change'],
    watch: {
        language({value, api, rule}) {
            if (rule.props._dataType === 1) {
                return;
            }
            updateChartData(api, rule, getDefaultCode(value));
        },
        chartData({value, rule}) {
            syncChartData(rule, value);
        },
        'formCreateProps>chartData'({value, rule}) {
            syncChartData(rule, value);
        }
    },
    rule({t}) {
        return {
            type: name,
            field: uniqueId(),
            title: t('com.fcCodePreview.name'),
            info: '',
            $required: false,
            props: {
                language: '',
                chartData: '',
                chartName: '',
                chartDescription: '',
                editable: false,
                copyable: true,
                formattable: true,
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
                field: 'language',
                options: localeOptions(t, [
                    {label: 'javascript', value: 'javascript'},
                    {label: 'html', value: 'html'},
                    {label: 'css', value: 'css'},
                    {label: 'json', value: 'json'},
                    {label: 'python', value: 'python'},
                    {label: 'java', value: 'java'},
                    {label: 'sql', value: 'sql'},
                    {label: 'yaml', value: 'yaml'},
                    {label: 'plaintext', value: 'plaintext'},
                ], 'com.fcCodePreview.languages')
            },
            {
                type: 'radio',
                title: t('com.fcCodePreview.props.dataSource'),
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
                                type: 'input',
                                title: t('com.fcCodePreview.props.chartData'),
                                field: 'formCreateProps>chartData',
                                modelEmit: false,
                                props: {
                                    type: 'textarea',
                                    rows: 8,
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
                type: 'switch',
                field: 'editable',
            },
            {
                type: 'switch',
                field: 'copyable',
                value: true,
            },
            {
                type: 'switch',
                field: 'formattable',
                value: true,
            },
        ]);
    }
};
