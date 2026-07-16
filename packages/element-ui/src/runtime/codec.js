import formCreate from '../utils/form';

export function serializeRules(value, space) {
    const json = formCreate.toJson(value);
    if (!space) {
        return json;
    }
    return JSON.stringify(JSON.parse(json), null, space);
}

export function deserializeRules(value, options = {}) {
    if (typeof value !== 'string') {
        return value;
    }
    // form-create parseJson 默认会把任意以 `function` 开头的字符串还原为函数。
    // 宿主如 LowCode 会把 preProcessBody/dataParseBody 作为“函数正文字符串”
    // 保存，因此需要可选的 marker-only 模式。第二参为 true 时仍会
    // 解码 form-create marker/$FN/$FNX，但不猜测普通 function 字符串。
    const parsePlainFunctions = options.parsePlainFunctions !== false;
    return formCreate.parseJson(value, !parsePlainFunctions);
}

export const componentCodec = Object.freeze({
    serialize: serializeRules,
    deserialize: deserializeRules,
});
