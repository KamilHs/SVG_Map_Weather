export const checkDigits = (n: number): string => (n < 10 ? '0' : '') + n;

export const formatDate = (d: string): string => {
    let date = new Date(d);
    return `${date.getFullYear()}-${checkDigits(date.getMonth() + 1)}-${checkDigits(date.getDate())}T${checkDigits(date.getHours())}:${checkDigits(date.getMinutes())}`
}