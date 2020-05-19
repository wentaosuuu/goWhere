// 如果timestamp不传的话, 我们就认为是处理当天. 于是就有 timestamp = Date.now()
export function h0(timestamp = Date.now()) {
  // 把timestamp转成Date对象
  const target = new Date(timestamp);

  target.setHours(0);
  target.setMinutes(0);
  target.setSeconds(0);
  target.setMilliseconds(0);

  return target.getTime();
}
