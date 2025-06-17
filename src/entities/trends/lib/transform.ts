export function formatTraffic(traffic: string) {
  if (traffic.includes('0000')) {
    return traffic.replace('0000', '') + '만';
  }
  if (traffic.includes('000')) {
    return traffic.replace('000', '') + '천';
  }
  return traffic;
}
