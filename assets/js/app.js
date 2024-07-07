import { HomePage } from "./HomePage.js";
import { RecipePage } from "./RecipePage.js";

const recipeSlug = new URLSearchParams(window.location.search).get("recipe");

const search = Number(
  new URLSearchParams(window.location.search).get("quantity") ?? 1
);

let language = new URLSearchParams(window.location.search).get("language");
language = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "ko",
  "pl",
  "pt-br",
  "ru",
  "th",
  "tr",
  "zh",
  "zh-tw",
].includes(language)
  ? language
  : "en";

// setTimeout(() => {
//   window.history.pushState({}, "toto", "?toto=1");

//   window.history.replaceState({}, "toto", "?toto=1");
// }, 5000);

if (recipeSlug) {
  const recipePage = new RecipePage();
  recipePage.run(recipeSlug, search, language);
} else {
  const homePage = new HomePage();
  homePage.run(language);
}
