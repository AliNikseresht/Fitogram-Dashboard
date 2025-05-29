function formatDurationHoursMinutes(duration: number): string {
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  return `${hours}h ${minutes}m`;
}

export default formatDurationHoursMinutes;
