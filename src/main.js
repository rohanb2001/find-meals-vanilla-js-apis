const form = document.querySelector("form");
const mealWrapper = document.querySelector(".meal-wrapper");
const modalContainer = document.querySelector(".modal-container");
const modal = document.querySelector(".modal");
const geDetailsBtn = document.querySelector(".get-details");
const mainLoader = document.querySelector(".loading");
const modalLoader = document.querySelector(".loader-container");

// States
let ingredients;

// Functions
function submitForm(e) {
  e.preventDefault();
  getFoodDetails();
}

async function getFoodDetails() {
  try {
    let foodURL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients.trim()}`;
    mainLoader.classList.remove("disable");
    mealWrapper.innerHTML = "";
    let response = await fetch(foodURL);
    let data = await response.json();
    setTimeout(() => {
      showAllFoods(data);
      mainLoader.classList.add("disable");
    }, 2000);
  } catch (error) {
    console.log(error.message);
  }
}

function showAllFoods(data) {
  if (data.meals === null) {
    mealWrapper.innerHTML = `<h3>Oops no result found!!!❌ Enter valid ingredient name...</h3>`;
  } else {
    let str = data.meals.reduce((acc, curr) => {
      return (
        acc +
        `
        <div class="meal-item" data-id="${curr.idMeal}">
        <img src="${curr.strMealThumb}" alt="food" />
        <div class="meal-content">
          <h3>${curr.strMeal}</h3>
          <button class="get-details">Get Recipe</button>
        </div>
      </div>
        `
      );
    }, "");

    mealWrapper.innerHTML = str;
  }
}

function showFoodDetails(e) {
  if (e.target.classList.contains("get-details")) {
    let mealItem = e.target.parentElement.parentElement;
    modalContainer.classList.add("active");
    modal.classList.add("disable");
    modalLoader.classList.remove("disable");
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => recipeModal(data.meals));
  }
}

function recipeModal(meals) {
  let meal = meals[0];
  let str = `
  <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">F${meal.strCategory}</p>
        <div class="recipe-instruct">
          <h3>Instructions:</h3>
          <p>
            ${meal.strInstructions}
          </p>
        </div>
        <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="food" />
        </div>
        <div class = "recipe-link">
        <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>

  `;

  modal.innerHTML = str;
  modalLoader.classList.add("disable");
  modal.classList.remove("disable");
}

function closeModalContainer(e) {
  if (e.target.classList.contains("modal-container")) {
    modalContainer.classList.remove("active");
  }
}

function getFormValues(e) {
  ingredients = e.target.value;
}

// Add Eventlisteners
form.addEventListener("submit", submitForm);
form.addEventListener("change", getFormValues);
mealWrapper.addEventListener("click", showFoodDetails);
modalContainer.addEventListener("click", closeModalContainer);
