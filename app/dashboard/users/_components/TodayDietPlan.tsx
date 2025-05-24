"use client";

import React from "react";

type Meal = {
  name: string;
  description: string;
  calories: number;
  eaten: boolean;
};

const meals: Meal[] = [
  {
    name: "Breakfast",
    description: "Eggs and whole grain bread",
    calories: 350,
    eaten: false,
  },
  {
    name: "Lunch",
    description: "Brown rice and chicken",
    calories: 600,
    eaten: false,
  },
  {
    name: "Dinner",
    description: "Salad and fish",
    calories: 400,
    eaten: false,
  },
];

export function TodayDietPlan() {
  const [diet, setDiet] = React.useState(meals);

  const toggleEaten = (index: number) => {
    setDiet((prev) =>
      prev.map((meal, i) =>
        i === index ? { ...meal, eaten: !meal.eaten } : meal
      )
    );
  };

  const totalCalories = diet.reduce(
    (acc, meal) => (meal.eaten ? acc + meal.calories : acc),
    0
  );

  return (
    <section className="max-w-md bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-3">
        Today`s Diet Plan
      </h2>
      <div className="space-y-4">
        {diet.map((meal, i) => (
          <div
            key={i}
            className={`flex justify-between items-center p-4 rounded-lg shadow-md cursor-pointer transition ${
              meal.eaten
                ? "bg-green-100 border border-green-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => toggleEaten(i)}
          >
            <div>
              <p className="font-semibold text-lg text-gray-700">{meal.name}</p>
              <p className="text-gray-600">{meal.description}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">{meal.calories} kcal</p>
              <button
                className={`mt-1 px-3 py-1 rounded-full font-semibold text-sm transition ${
                  meal.eaten
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-yellow-400 text-purple-900 hover:bg-yellow-500"
                }`}
              >
                {meal.eaten ? "Eaten ✔" : "Mark as eaten"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 font-bold text-right text-gray-800">
        Calories consumed: {totalCalories} kcal
      </p>
    </section>
  );
}
