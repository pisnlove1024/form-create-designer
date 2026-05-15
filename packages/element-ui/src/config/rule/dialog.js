import {localeProps} from '../../utils';

const label = '弹窗容器';
const name = 'fcDialog';

export default {
    menu: 'layout',
    icon: 'icon-button',
    label,
    name,
    drag: true,
    inside: false,
    mask: false,
    hiddenBaseField: ['formCreateCol>span', 'formCreateWrap>labelWidth'],
    event: ['open', 'opened', 'close', 'closed'],
    rule({t}) {
        return {
            type: name,
            props: {
                title: t('com.fcDialog.name'),
                modelValue: false,
            },
            style: {
                width: '100%'
            },
            effect: {
                fetch: ''
            },
            children: []
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            {
                type: 'radio',
                title: t('com.fcDialog.props.visibleType'),
                field: '_visibleType',
                value: 1,
                options: [
                    {label: t('com.fcDialog.visibleOptions.static'), value: 1},
                    {label: t('com.fcDialog.visibleOptions.global'), value: 2},
                ],
                props: {
                    type: 'button'
                },
                control: [
                    {
                        value: 1,
                        rule: [
                            {
                                type: 'switch',
                                field: 'modelValue',
                                title: t('com.fcDialog.props.modelValue'),
                            }
                        ]
                    },
                    {
                        value: 2,
                        rule: [
                            {
                                type: 'GlobalDataSelect',
                                field: 'formCreateEffect>globalData',
                                title: t('fetch.optionsType.global'),
                                props: {
                                    to: 'props.modelValue'
                                }
                            }
                        ]
                    }
                ]
            },
            {type: 'input', field: 'title'},
            {type: 'input', field: 'width', value: '50%', props: {placeholder: '支持50%, 600px, 50vw等格式'}},
            {type: 'switch', field: 'fullscreen'},
            {type: 'input', field: 'top'},
            {type: 'switch', field: 'modal', value: true},
            {type: 'switch', field: 'appendToBody'},
            {type: 'switch', field: 'closeOnClickModal', value: true},
            {type: 'switch', field: 'closeOnPressEscape', value: true},
            {type: 'switch', field: 'showClose', value: true},
            {type: 'switch', field: 'destroyOnClose'},
            {type: 'switch', field: 'draggable'},
            {type: 'switch', field: 'alignCenter'},
        ]);
    }
};
