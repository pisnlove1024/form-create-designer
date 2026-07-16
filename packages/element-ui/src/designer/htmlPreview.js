const SOURCE_PREVIEW_CLASS = 'fc-designer-html-source-preview';
const installedTargets = new WeakSet();

function readHtml(children) {
    return typeof children?.default === 'function'
        ? String(children.default() ?? '')
        : '';
}

function modeKey(ctx, mode) {
    const key = ctx.prop?.key ?? ctx.rule?.key ?? ctx.id ?? 'html';
    return `${key}-${mode}`;
}

function renderLiveHtml(content, ctx) {
    const prop = {
        ...ctx.prop,
        key: modeKey(ctx, 'live'),
        props: {
            ...(ctx.prop?.props || {}),
            innerHTML: content,
        },
    };
    delete prop.props.textContent;
    return ctx.vNode.make(prop.props.tag || 'div', prop);
}

function renderHtmlSource(content, ctx) {
    const prop = {
        ...ctx.prop,
        key: modeKey(ctx, 'source'),
        props: {
            ...(ctx.prop?.props || {}),
            textContent: content,
        },
        class: [ctx.prop?.class, SOURCE_PREVIEW_CLASS].filter(Boolean),
    };
    delete prop.props.innerHTML;
    return ctx.vNode.make('pre', prop);
}

/**
 * Keep HTML source isolated on the designer canvas unless a rule explicitly
 * opts into live rendering with `htmlPreview: true`.
 *
 * This only patches the designer factory. The runtime form-create instance and
 * the designer's form preview continue to render the real HTML.
 */
export function installDesignerHtmlPreview(target) {
    if (!target || typeof target.parser !== 'function') {
        throw new TypeError('A form-create designer instance with parser() is required.');
    }
    if (installedTargets.has(target)) {
        return target;
    }

    const htmlParser = target.parser('html');
    if (!htmlParser || typeof htmlParser.render !== 'function') {
        return target;
    }

    installedTargets.add(target);
    target.parser('html', {
        merge: true,
        render(children, ctx) {
            const content = readHtml(children);
            if (ctx.rule?.htmlPreview === true) {
                return renderLiveHtml(content, ctx);
            }
            return renderHtmlSource(content, ctx);
        },
    });
    return target;
}

export {SOURCE_PREVIEW_CLASS};
