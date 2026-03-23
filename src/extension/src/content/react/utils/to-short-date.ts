export function toShortDate(date: string): string {
    const [year, month, day] = date.split('-');

    return `${year.slice(2, 4)}.${month}.${day}`;
}
