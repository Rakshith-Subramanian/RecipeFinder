import { useState, useEffect } from "react";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState("Arrabiata");
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    getMeals();
  }, []);

  async function getMeals() {
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + meal
      );
      const data = await res.json();
      
      // Sort meals based on the number of ingredients required
      const sortedMeals = data.meals.sort((a, b) => {
        const aIngredients = Object.keys(a)
          .filter(key => key.startsWith('strIngredient') && a[key])
          .length;
        const bIngredients = Object.keys(b)
          .filter(key => key.startsWith('strIngredient') && b[key])
          .length;
        return aIngredients - bIngredients;
      });

      setMeals(sortedMeals);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    getMeals();
  }

  async function saveRecipe(recipe) {
    try {
      const res = await fetch("http://localhost:5000/api/save-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });
      if (res.ok) {
        console.log("Recipe saved successfully");
        // After saving, fetch the updated list of saved recipes
        getSavedRecipes();
      } else {
        console.error("Failed to save recipe");
      }
    } catch (error) {
      console.error("Failed to save recipe:", error);
    }
  }

  async function getSavedRecipes() {
    try {
      const res = await fetch("http://localhost:5000/api/saved-recipes");
      const data = await res.json();
      console.log("Saved recipes:", data);
      // Update state with fetched recipes
      setSavedRecipes(data);
    } catch (error) {
      console.error("Failed to fetch saved recipes:", error);
    }
  }

  return (
    <div style={{ backgroundColor: "#e6e6ff", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ maxWidth: "800px", width: "100%", margin: "auto", padding: "40px 20px", fontFamily: "Arial, sans-serif", background: "#fff", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem", background: "linear-gradient(to right, #a6e3e9, #80d3ef)", color: "#fff", padding: "1rem", borderRadius: "10px 10px 0 0" }}>
          Recipe Finder
        </h1>

        <form style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }} onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search for a food"
            required
            style={{ width: "70%", padding: "0.75rem", border: "2px solid #ccc", borderRadius: "9999px", outline: "none" }}
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
          />
          <button
            type="submit"
            style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "9999px", background: "#ff6e7f", color: "#fff", cursor: "pointer", transition: "background 0.3s" }}
          >
            Search
          </button>
        </form>

        {meals ? (
          <div style={{ display: "grid", gap: "2rem" }}>
            {meals.map((meal) => (
              <article key={meal.idMeal} style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "1rem", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
                  {meal.strMeal}
                  <span style={{ backgroundColor: "#ff6e7f", fontSize: "0.75rem", fontWeight: "normal", padding: "0.25rem 0.5rem", borderRadius: "9999px", marginLeft: "0.5rem", color: "#fff" }}>{meal.strCategory}</span>{" "}
                  <span style={{ backgroundColor: "#80d3ef", fontSize: "0.75rem", fontWeight: "normal", padding: "0.25rem 0.5rem", borderRadius: "9999px", color: "#000" }}>{meal.strArea}</span>
                </h2>

                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }}
                />

                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Ingredients</h3>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {[...Array(20)].map((_, i) => (
                    meal[`strIngredient${i + 1}`] && (
                      <li key={i} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>{meal[`strMeasure${i + 1}`]}</span>
                        <span>{meal[`strIngredient${i + 1}`]}</span>
                      </li>
                    )
                  ))}
                </ul>

                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Instructions</h3>
                <p style={{ marginBottom: "1rem" }}>{meal.strInstructions}</p>

                <ul style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  {meal.strYoutube && (
                    <li>
                      <a
                        href={meal.strYoutube}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: "0.5rem 1rem", backgroundColor: "#ff6e7f", color: "#fff", textDecoration: "none", borderRadius: "9999px", transition: "background 0.3s" }}
                      >
                        Video
                      </a>
                    </li>
                  )}
                  {meal.strSource && (
                    <li>
                      <a
                        href={meal.strSource}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: "0.5rem 1rem", backgroundColor: "#80d3ef", color: "#000", textDecoration: "none", borderRadius: "9999px", transition: "background 0.3s" }}
                      >
                        Source
                      </a>
                    </li>
                  )}

                  {/* Save button */}
                  <li>
                    <button
                      onClick={() => saveRecipe(meal)}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#a6e3e9", color: "#000", border: "none", borderRadius: "9999px", cursor: "pointer", transition: "background 0.3s" }}
                    >
                      Save
                    </button>
                  </li>
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <h2 style={{ fontSize: "1.5rem", textAlign: "center", color: "#333", fontWeight: "bold", marginTop: "2rem" }}>Sorry, we couldn't search for {meal}</h2>
        )}

        {/* View Saved Recipes Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={getSavedRecipes}
            style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "9999px", background: "#80d3ef", color: "#fff", cursor: "pointer", transition: "background 0.3s" }}
          >
            View Saved Recipes
          </button>
        </div>

        {/* Saved Recipes */}
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>Saved Recipes</h2>
          {savedRecipes.length > 0 && (
            <div style={{ display: "grid", gap: "2rem" }}>
              {savedRecipes.map((recipe) => (
                <article key={recipe.idMeal} style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "1rem", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
                    {recipe.strMeal}
                    <span style={{ backgroundColor: "#ff6e7f", fontSize: "0.75rem", fontWeight: "normal", padding: "0.25rem 0.5rem", borderRadius: "9999px", marginLeft: "0.5rem", color: "#fff" }}>{recipe.strCategory}</span>{" "}
                    <span style={{ backgroundColor: "#80d3ef", fontSize: "0.75rem", fontWeight: "normal", padding: "0.25rem 0.5rem", borderRadius: "9999px", color: "#000" }}>{recipe.strArea}</span>
                  </h2>

                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }}
                  />

                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Ingredients</h3>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {[...Array(20)].map((_, i) => (
                      recipe[`strIngredient${i + 1}`] && (
                        <li key={i} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                          <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>{recipe[`strMeasure${i + 1}`]}</span>
                          <span>{recipe[`strIngredient${i + 1}`]}</span>
                        </li>
                      )
                    ))}
                  </ul>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Instructions</h3>
                  <p style={{ marginBottom: "1rem" }}>{recipe.strInstructions}</p>

                  <ul style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    {recipe.strYoutube && (
                      <li>
                        <a
                          href={recipe.strYoutube}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: "0.5rem 1rem", backgroundColor: "#ff6e7f", color: "#fff", textDecoration: "none", borderRadius: "9999px", transition: "background 0.3s" }}
                        >
                          Video
                        </a>
                      </li>
                    )}
                    {recipe.strSource && (
                      <li>
                        <a
                          href={recipe.strSource}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: "0.5rem 1rem", backgroundColor: "#80d3ef", color: "#000", textDecoration: "none", borderRadius: "9999px", transition: "background 0.3s" }}
                        >
                          Source
                        </a>
                      </li>
                    )}

                    {/* Save button */}
                    <li>
                      <button
                        onClick={() => saveRecipe(recipe)}
                        style={{ padding: "0.5rem 1rem", backgroundColor: "#a6e3e9", color: "#000", border: "none", borderRadius: "9999px", cursor: "pointer", transition: "background 0.3s" }}
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </article>
              ))}
            </div>
          )}
          {savedRecipes.length === 0 && <p style={{ textAlign: "center" }}>No saved recipes found</p>}
        </div>
      </div>
    </div>
  );
}
