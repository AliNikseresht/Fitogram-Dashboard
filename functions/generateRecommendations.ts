type BaseLog = {
  id: string | number;
  log_date: string;
};

export type MoodType = "happy" | "neutral" | "sad";

export type MoodLog = BaseLog & {
  mood: MoodType;
};

export type WaterLog = BaseLog & {
  water_intake: number;
};

export type WeightLog = BaseLog & {
  weight: number;
};

interface DailyLog extends BaseLog {
  mood: MoodType;
  water_intake: number;
  weight: number;
}

interface SleepLog {
  id: string | number;
  sleep_date: string;
  duration: number;
  sleep_time: string;
  wake_time: string;
}

export function generateRecommendations(
  dailyLogs: DailyLog[],
  sleepLogs: SleepLog[]
): string[] {
  if (dailyLogs.length === 0 || sleepLogs.length === 0) return [];

  const recommendations: string[] = [];

  const avgWater =
    dailyLogs.reduce((sum, log) => sum + log.water_intake, 0) /
    dailyLogs.length;

  const avgSleep =
    sleepLogs.reduce((sum, log) => sum + log.duration, 0) / sleepLogs.length;

  if (avgWater < 6) {
    recommendations.push(
      "Try to drink more water daily to stay hydrated and maintain good health."
    );
  } else if (avgWater <= 8) {
    recommendations.push("Great job on your hydration! Keep it up.");
  } else {
    recommendations.push(
      "Your water intake is quite high, make sure it's comfortable for you."
    );
  }

  if (avgSleep < 6) {
    recommendations.push(
      "Try to get at least 7 hours of sleep to improve energy and mood."
    );
  } else if (avgSleep <= 8) {
    recommendations.push(
      "Your sleep duration looks healthy. Keep it consistent!"
    );
  } else {
    recommendations.push(
      "You're sleeping quite long; ensure it doesn't affect your daily activities."
    );
  }

  dailyLogs.forEach((log, i) => {
    if (log.mood === "sad") {
      const sleepLog = sleepLogs[i];
      if (sleepLog) {
        const sleepHour = parseInt(sleepLog.sleep_time.split(":")[0], 10);
        if (sleepHour > 1) {
          recommendations.push(
            `Your mood on ${log.log_date} was sad and you slept late at ${sleepLog.sleep_time}. Try going to bed earlier for better rest.`
          );
        } else {
          recommendations.push(
            `Your mood on ${log.log_date} was sad. Consider relaxing activities to improve your day.`
          );
        }
      } else {
        recommendations.push(
          `Your mood on ${log.log_date} was sad. Consider relaxing activities to improve your day.`
        );
      }
    }
  });

  return recommendations;
}
