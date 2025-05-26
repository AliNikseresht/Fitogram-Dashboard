type GoalType = "gain_weight" | "lose_weight" | "maintain_weight";

export function getSuggestedWorkout(age: number, goal: GoalType): string {
  if (age <= 25 && goal === "gain_weight") return "youth_mass_program";
  if (age > 25 && age <= 40 && goal === "lose_weight")
    return "advanced_fat_loss";
  if (age > 40 && goal === "maintain_weight") return "light_health_program";
  return "basic_fitness_program";
}
