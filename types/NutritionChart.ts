export interface NutritionChartProps {
  dailyLogs: {
    water_intake: number;
    id: string | number;
  }[];
  sleepLogs: {
    duration: number;
    id: string | number;
  }[];
}
