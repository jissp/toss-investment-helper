export function getNumberColorStyle(value: number | string) {
    const _value = Number(value);
    if (isNaN(_value) || _value === 0) {
        return '';
    }

    if (_value > 0) {
        return 'var(--wts-adaptive-red500)';
    }

    return 'var(--wts-adaptive-blue500)';
}
