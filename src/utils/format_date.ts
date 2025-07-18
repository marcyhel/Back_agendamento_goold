const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  const pad2 = (n: number) => n.toString().padStart(2, "0");

  const Y = date.getFullYear();
  const M = pad2(date.getMonth() + 1);
  const D = pad2(date.getDate());
  const h = pad2(date.getHours());
  const m = pad2(date.getMinutes());
  const s = pad2(date.getSeconds());

  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};

export default formatTimestamp;
