export function localTime(options: {
  datetime: string;
  locale: string;
  tz: string;
}): string {
  const { datetime, locale = "zh-CN", tz = "Asia/Shanghai" } = options;
  return new Date(datetime).toLocaleString(locale, { timeZone: tz });
}
