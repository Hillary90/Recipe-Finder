// Select elements
const ingredientInput = document.getElementById("ingredientInput");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const recipePopup = document.querySelector(".recipe-popup");
const popupBody = document.querySelector(".popup-body");
const closeBtn = document.querySelector(".close-btn");

// API Base URL
const API_URL = "https://www.themealdb.com/api/json/v1/1/";


function displayRecipe(meal) {
  popupBody.innerHTML = "";  // Clear popup first
  const title = document.createElement("h2");
  title.className = "mb-3";
  title.textContent = meal.strMeal || "Recipe";
  
  // --- Image ---
  const img = document.createElement("img");
  img.src = meal.strMealThumb || "";
  img.alt = meal.strMeal || "Meal image";
  img.className = "img-fluid rounded mb-3";

  // Ingredients
  const ingHeader = document.createElement("h4");
  ingHeader.textContent = "Ingredients:";
  
  const ul = document.createElement("ul");
  ul.className = "ingredients-list";

  // Build array of ingredients
  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ingredient = (meal[`strIngredient${i + 1}`] || "").trim();
    const measure = (meal[`strMeasure${i + 1}`] || "").trim();
    return ingredient ? `${measure ? measure + " " : ""}${ingredient}` : null;
  }).filter(Boolean);

  // Loop with forEach
  ingredients.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });

  // Instructions
  const instHeader = document.createElement("h4");
  instHeader.className = "mt-3";
  instHeader.textContent = "Instructions:";

  const ol = document.createElement("ol");
  ol.className = "instructions-list";

  const raw = meal.strInstructions || "";
  
  // Match sentences ending with ., ! or ?
  const steps = raw.match(/[^.!?]+[.!?]*/g) || [];

  steps
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(s => {
      const li = document.createElement("li"); 
      li.textContent = s;
      ol.appendChild(li);
    });

  // Append everything to popup
  popupBody.append(title, img, ingHeader, ul, instHeader, ol);

  // Show popup
  recipePopup.classList.remove("d-none");
}

// Fetch recipe by ingredient
async function fetchRecipeByIngredient(ingredient) {
  try {
    const response = await fetch(`${API_URL}filter.php?i=${ingredient}`);
    const data = await response.json();

    if (!data.meals) {
      popupBody.innerHTML = `<p>No recipes found for "${ingredient}". Try another ingredient.</p>`;
      recipePopup.classList.remove("d-none");
      return;
    }

    // Pick a random meal from results
    const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];

    // Fetch full details of the meal
    const mealResponse = await fetch(`${API_URL}lookup.php?i=${randomMeal.idMeal}`);
    const mealData = await mealResponse.json();
    displayRecipe(mealData.meals[0]);
  } catch (error) {
    console.error("Error fetching recipe:", error);
  }
}

// Fetch random recipe
async function fetchRandomRecipe() {
  try {
    const response = await fetch(`${API_URL}random.php`);
    const data = await response.json();
    displayRecipe(data.meals[0]);
  } catch (error) {
    console.error("Error fetching random recipe:", error);
  }
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const ingredient = ingredientInput.value.trim();
  if (ingredient) {
    fetchRecipeByIngredient(ingredient);
  }
});

randomBtn.addEventListener("click", fetchRandomRecipe);

closeBtn.addEventListener("click", () => {
  recipePopup.classList.add("d-none");
});
