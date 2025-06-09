function calculateDuration(
  sleepH: number,
  sleepM: number,
  wakeH: number,
  wakeM: number
) {
  const sleepMinutes = sleepH * 60 + sleepM;
  let wakeMinutes = wakeH * 60 + wakeM;
  if (wakeMinutes <= sleepMinutes) wakeMinutes += 24 * 60;
  return (wakeMinutes - sleepMinutes) / 60;
}

export default calculateDuration;
