export default function field({t}) {
    return [
        {
            type: 'FieldInput',
            field: 'field',
            value: '',
            title: t('form.field'),
            warning: t('warning.field'),
        }, {
            type: 'LanguageInput',
            field: 'title',
            value: '',
            title: t('form.title'),
        }, {
            type: 'LanguageInput',
            field: 'info',
            value: '',
            title: t('form.info'),
        }, {
            type: 'radio',
            field: 'formCreateCol>span',
            value: 24,
            title: t('form.componentWidth'),
            options: [
                {label: '1/4', value: 6},
                {label: '1/3', value: 8},
                {label: '1/2', value: 12},
                {label: '2/3', value: 16},
                {label: '3/4', value: 18},
                {label: t('form.fullWidth'), value: 24},
            ],
            props: {
                type: 'button'
            }
        }, {
            type: 'SizeInput',
            field: 'formCreateWrap>labelWidth',
            value: '',
            title: t('form.labelWidth'),
        }, {
            type: 'Struct',
            field: '_control',
            name: 'control',
            value: [],
            title: t('form.control'),
            warning: t('form.controlDocument', {doc: '<a target="_blank" href="https://view.form-create.com/control" style="color: inherit;text-decoration: underline;">' + t('form.document') + '</a>'}),
            props: {
                placeholder: '[{ value: "value", rule: ["field1", "field2"] }]',
                validate(val) {
                    if (!Array.isArray(val)) return false;
                    if (!val.length) return true;
                    return !val.some(({rule}) => {
                        return !Array.isArray(rule);
                    });
                }
            }
        },
    ];
}
