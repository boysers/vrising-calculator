/**
 * @typedef {Object} Recipe
 * @property {number} id
 * @property {string} slug
 * @property {string} name
 * @property {string} entityType
 * @property {number} craftDuration
 * @property {Array<Requirement>} requirements
 * @property {Array<Requirement>} outputs
 * @property {Array<Workstation>} workstations
 * @property {Array<string>} recipeCategories
 * @property {string} description
 * @property {string} iconPath
 * @property {string} listingPath
 * @property {string} subTitle
 * @property {any} prefab
 * @property {Array<any>} rewardBlueprints
 * @property {Array<any>} rewardRecipes
 * @property {Array<any>} rewardAbilities
 * @property {Array<any>} techSources
 */

/**
 * @typedef {Object} Workstation
 * @property {number} id
 * @property {string} slug
 * @property {string} name
 * @property {string} listingPath
 * @property {string} entityType
 */

/**
 * @typedef {Object} Requirement
 * @property {number} id
 * @property {number} amount
 * @property {Item} item
 */

/**
 * @typedef {Object} Item
 * @property {number} id
 * @property {string} slug
 * @property {string} name
 * @property {string} iconPath
 * @property {string} listingPath
 * @property {string} subTitle
 * @property {string} entityType
 */

export class RecipePage {
  constructor() {}

  /**
   * @param {Array<any>} options
   */
  createSelectElement(language) {
    const selectEl = document.createElement("select");
    const optionEls = language.map((lang) => {
      const optionEl = document.createElement("option");
      optionEl.textContent = lang;
      return optionEl;
    });
    selectEl.append(...optionEls);
    return selectEl;
  }

  async run(recipeSlug, search, language = "en") {
    const controlEl = document.createElement("div");
    controlEl.classList.add("control");
    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "number");
    inputEl.setAttribute("min", "1");
    inputEl.setAttribute("max", "9999");
    inputEl.value = search;
    const buttonEl = document.createElement("button");
    buttonEl.textContent = "Calculate!";

    const languageSelectEl = this.createSelectElement([
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
    ]);
    languageSelectEl.value = language;
    const controlLanguage = document.createElement("div");
    controlLanguage.classList.add("language-control");
    controlLanguage.append(languageSelectEl);

    languageSelectEl.addEventListener("change", (e) => {
      e.preventDefault();
      if (e.target.value !== language) {
        let query = new URLSearchParams(window.location.search);
        query.set("language", e.target.value);
        window.location.href = "?" + query.toString();
      }
    });

    const bunusLabelEl = document.createElement("label");
    bunusLabelEl.classList.add("bonus");
    const bonusInputEl = document.createElement("input");
    bonusInputEl.setAttribute("type", "checkbox");
    bonusInputEl.checked = new URLSearchParams(location.search).get("bonus");
    bunusLabelEl.append(bonusInputEl, "-25%");

    controlEl.append(inputEl, bunusLabelEl, buttonEl);

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();

      if (isNaN(inputEl.value)) {
        return;
      }

      let query = new URLSearchParams(window.location.search);
      query.set("quantity", inputEl.value);
      if (bonusInputEl.checked) {
        query.set("bonus", 25);
      } else {
        query.delete("bonus");
      }
      window.location.href = "?" + query.toString();
    });

    const linkListEl = document.createElement("div");
    linkListEl.classList.add("link-list");
    const returnBtnEl = document.createElement("a");
    const queries = new URLSearchParams();
    queries.append("language", language);
    returnBtnEl.setAttribute("href", "?" + queries.toString());
    returnBtnEl.textContent = "Recipes";

    linkListEl.append(returnBtnEl);

    let response = await fetch(
      `https://scdn.gaming.tools/vrising/data/${language}/recipe/${recipeSlug}.json`
    );

    /** @type {Recipe} */
    const recipe = await response.json();

    const cardEl = document.createElement("div");

    const iconEl = document.createElement("img");
    const titleEl = document.createElement("h3");

    iconEl.setAttribute(
      "src",
      `https://gtcdn.info/vrising${recipe.iconPath.replace("{height}", 64)}`
    );
    iconEl.setAttribute("alt", `${recipe.name} icon`);

    cardEl.classList.add("card");
    cardEl.append(iconEl, titleEl, controlEl, linkListEl, controlLanguage);

    document.querySelector("#app").appendChild(cardEl);

    response = await fetch(
      `https://scdn.gaming.tools/vrising/data/${language}/recipe.json`
    );

    /** @type {Array<Recipe>} */
    const recipes = (await response.json()).filter(
      (recipe) => !recipe.slug.includes("trader")
    );

    const principalListEl = document.createElement("ul");

    const titleEle = document.createElement("h2");
    titleEle.appendChild(document.createTextNode("Crafting"));
    titleEle.style.fontSize = "22px";

    principalListEl.appendChild(titleEle);

    let quantity = search;

    titleEl.appendChild(
      document.createTextNode("x" + quantity + " " + recipe.name)
    );

    const ressource = {};

    const bonus = new URLSearchParams(window.location.search).get("bonus");

    await test(recipe, principalListEl, quantity);

    const containerRessourceEl = document.createElement("ul");

    const titleElddd = document.createElement("h2");
    titleElddd.appendChild(document.createTextNode("Required"));
    titleElddd.style.fontSize = "22px";
    containerRessourceEl.appendChild(titleElddd);

    for (const r in ressource) {
      const item = ressource[r];

      const containerEl = document.createElement("li");

      const cardEl = document.createElement("div");

      const iconEl = document.createElement("img");
      const titleEl = document.createElement("p");

      containerEl.style.lineHeight = "1.8";
      containerEl.style.listStyle = "none";
      iconEl.style.height = "24px";
      cardEl.style.display = "flex";
      cardEl.style.gap = "6px";
      titleEl.style.margin = "0";

      iconEl.setAttribute(
        "src",
        `https://gtcdn.info/vrising${item.iconPath.replace("{height}", 64)}`
      );
      iconEl.setAttribute("alt", `${item.name} icon`);
      titleEl.appendChild(
        document.createTextNode(`x${item.amount} ${item.name}`)
      );

      cardEl.append(iconEl, titleEl);
      containerEl.appendChild(cardEl);

      containerRessourceEl.appendChild(containerEl);
    }

    const containerItem = document.createElement("div");
    containerItem.style.display = "flex";
    containerItem.style.maxWidth = "750px";

    containerItem.append(principalListEl, containerRessourceEl);
    principalListEl.style.flex = "1";

    document.querySelector("#app").append(containerItem);

    /**
     * @param {Recipe} recipe
     * @param {HTMLElement} element
     * @param {number} quantity
     * @param {boolean} bonus
     */
    async function test(recipe, element, quantity) {
      while (quantity % recipe.outputs[0].amount !== 0) {
        quantity++;
      }

      for (const requirement of recipe.requirements) {
        const containerEl = document.createElement("li");

        const cardEl = document.createElement("div");

        const iconEl = document.createElement("img");
        const titleEl = document.createElement("p");

        const item = requirement.item;

        const searchRecipe = recipes.find(
          (recipe) => recipe.name === item.name
        );

        if (bonus && requirement.amount > 3) {
          requirement.amount = requirement.amount * 0.75;
        }

        let amount = (quantity / recipe.outputs[0].amount) * requirement.amount;

        iconEl.setAttribute(
          "src",
          `https://gtcdn.info/vrising${item.iconPath.replace("{height}", 64)}`
        );
        iconEl.setAttribute("alt", `${item.name} icon`);
        titleEl.appendChild(document.createTextNode(`x${amount} ${item.name}`));

        containerEl.style.lineHeight = "1.6";
        iconEl.style.height = "24px";
        cardEl.style.display = "flex";
        cardEl.style.gap = "6px";
        titleEl.style.margin = "0";

        cardEl.append(iconEl, titleEl);
        containerEl.appendChild(cardEl);

        element.appendChild(containerEl);

        if (searchRecipe) {
          response = await fetch(
            `https://scdn.gaming.tools/vrising/data/${language}/recipe/${searchRecipe.slug}.json`
          );
          const recipe = await response.json();

          const el = document.createElement("ul");
          element.appendChild(el);

          await test(recipe, el, amount);
        } else {
          if (ressource[item.name]) {
            ressource[item.name].amount = ressource[item.name].amount + amount;
          } else {
            ressource[item.name] = {
              amount,
              iconPath: requirement.item.iconPath,
              name: requirement.item.name,
            };
          }
        }
      }
    }
  }
}
