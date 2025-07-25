export function getUtcRangeFromBrDate(dateStr: string) {
    const date = new Date(dateStr);
    const start = new Date(date);
    start.setUTCHours(3, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
}