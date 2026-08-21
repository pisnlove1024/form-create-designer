import uniqueId from '@form-create/utils/lib/unique';
import {localeOptions, localeProps} from '../../utils';

const label = 'YAML 树编辑器';
const name = 'fcYamlTreeEditor';

const defaultYaml = `service:
  name: pmt
  replicas: 3
  enabled: true
  env:
    - name: LOG_LEVEL
      value: info
`;

export default {
    menu: 'main',
    icon: 'icon-tree',
    label,
    name,
    input: true,
    mask: true,
    event: ['change', 'parseError', 'validationError', 'nodeChange'],
    validate: ['string'],
    rule({t}) {
        return {
            type: name,
            field: uniqueId(),
            title: t('com.fcYamlTreeEditor.name'),
            info: '',
            $required: false,
            props: {
                _dataType: 2,
                yaml: defaultYaml,
                schema: '',
                height: '420px',
                indent: 2,
                readonly: false,
                disabled: false,
                defaultExpandAll: true,
                showHeader: true,
                showFormatHint: true,
                viewMode: 'tree',
            },
            effect: {
                fetch: '',
            },
            style: {
                width: '100%',
            },
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            {
                type: 'radio',
                title: t('com.fcYamlTreeEditor.props.dataSource'),
                field: '_dataType',
                value: 2,
                options: [
                    {label: t('fetch.optionsType.struct'), value: 2},
                    {label: t('fetch.optionsType.fetch'), value: 1},
                    {label: t('fetch.optionsType.global'), value: 3},
                ],
                props: {
                    type: 'button',
                },
                control: [
                    {
                        value: 1,
                        rule: [
                            {
                                type: 'FetchConfig',
                                field: 'formCreateEffect>fetch',
                                props: {
                                    to: 'props.yaml',
                                },
                            },
                        ],
                    },
                    {
                        value: 2,
                        rule: [
                            {
                                type: 'input',
                                title: t('com.fcYamlTreeEditor.props.yaml'),
                                field: 'formCreateProps>yaml',
                                modelEmit: false,
                                props: {
                                    type: 'textarea',
                                    rows: 10,
                                    placeholder: t('com.fcYamlTreeEditor.props.yamlPlaceholder'),
                                },
                            },
                        ],
                    },
                    {
                        value: 3,
                        rule: [
                            {
                                type: 'GlobalDataSelect',
                                field: 'formCreateEffect>globalData',
                                title: t('fetch.optionsType.global'),
                                props: {
                                    to: 'props.yaml',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                type: 'input',
                field: 'schema',
                props: {
                    type: 'textarea',
                    rows: 8,
                    placeholder: t('com.fcYamlTreeEditor.props.schemaPlaceholder'),
                },
            },
            {
                type: 'input',
                field: 'height',
                value: '420px',
            },
            {
                type: 'inputNumber',
                field: 'indent',
                value: 2,
                props: {min: 1, max: 8},
            },
            {
                type: 'switch',
                field: 'readonly',
            },
            {
                type: 'switch',
                field: 'disabled',
            },
            {
                type: 'switch',
                field: 'defaultExpandAll',
                value: true,
            },
            {
                type: 'switch',
                field: 'showHeader',
                value: true,
            },
            {
                type: 'switch',
                field: 'showFormatHint',
                value: true,
            },
            {
                type: 'select',
                field: 'viewMode',
                value: 'tree',
                options: localeOptions(t, [
                    {label: 'tree', value: 'tree'},
                    {label: 'source', value: 'source'},
                    {label: 'split', value: 'split'},
                ], 'com.fcYamlTreeEditor.viewModes'),
            },
        ]);
    },
};
