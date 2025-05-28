function calculateDuration(sleepTime: string, wakeTime: string) {
  const [sleepH, sleepM] = sleepTime.split(":").map(Number);
  const [wakeH, wakeM] = wakeTime.split(":").map(Number);

  let sleepMinutes = sleepH * 60 + sleepM;
  let wakeMinutes = wakeH * 60 + wakeM;
  if (wakeMinutes <= sleepMinutes) wakeMinutes += 24 * 60;
  return (wakeMinutes - sleepMinutes) / 60;
}

export default calculateDuration;
