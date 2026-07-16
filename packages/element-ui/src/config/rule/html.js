import {localeProps} from '../../utils';

const label = 'HTML';
const name = 'html';

export default {
    menu: 'aide',
    icon: 'icon-html',
    label,
    name,
    rule() {
        return {
            type: name,
            title: '',
            native: true,
            htmlPreview: false,
            attrs: {
                innerHTML: ''
            },
            style: {
                display: 'block',
                width: '100%',
            },
            children: ['<div style="color:blue;">\n' +
            ' html html html html html html html html html\n' +
            '  </div>'],
        };
    },
    watch: {
        formCreateNative({value, rule}) {
            if (value) {
                rule.title = '';
            }
        },
        formCreateHtmlPreview({rule}) {
            // htmlPreview is a designer-only root field, so form-create does not
            // include it in its default reactive attribute list. Explicitly
            // invalidate this rule's render cache when the switch changes.
            rule.__fc__?.$api?.sync(rule);
        }
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            {
                type: 'switch', field: 'formCreateNative', props: {
                    activeValue: false,
                    inactiveValue: true,
                },
                control: [{value: false, rule: ['formCreateTitle']}]
            }, {
                type: 'input',
                field: 'formCreateTitle',
            }, {
                type: 'switch',
                field: 'formCreateHtmlPreview',
                value: false,
            }, {
                type: 'HtmlEditor',
                field: 'formCreateChild',
            }
        ]);
    }
};
