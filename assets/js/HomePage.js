import { VRisingDBService } from "./VRisingDBService.js";
import { createItemCardElement } from "./createItemCardElement.js";

export class HomePage {
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

  /**
   * @param {string} language
   */
  async run(language = "en") {
    const appEl = document.querySelector("#app");

    const controleEl = document.createElement("div");
    controleEl.classList.add("controle");
    const searchInputEl = document.createElement("input");

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

    controleEl.append(searchInputEl, languageSelectEl);

    languageSelectEl.addEventListener("change", (e) => {
      e.preventDefault();
      if (e.target.value !== language) {
        window.location.href = "?language=" + e.target.value;
      }
    });

    const vrisingDBService = new VRisingDBService(language);
    const items = await vrisingDBService.getItems();

    const itemListEl = document.createElement("div");
    itemListEl.classList.add("card-container");

    const categoryItems = items.reduce((acc, item) => {
      if (item.recipes.length < 1) return acc;

      const categoryName = item.subTitle || "";
      const itemCardEl = createItemCardElement(item, language);

      const categoryItem = acc.find(
        (category) => category.name === categoryName
      );

      if (!categoryItem) {
        const categoryEl = document.createElement("h2");
        categoryEl.textContent = categoryName;
        acc.push({
          name: categoryName,
          element: categoryEl,
          items: [
            {
              item: item,
              element: itemCardEl,
            },
          ],
        });

        acc.sort((a, b) => a.name.localeCompare(b.name));
        return acc;
      }

      categoryItem.items.push({ item: item, element: itemCardEl });
      categoryItem.items.sort((a, b) => a.item.name.localeCompare(b.item.name));

      return acc;
    }, []);

    categoryItems.forEach(({ element, items }) => {
      // items.forEach(({ element, item }) => {
      //   element.addEventListener("click", () => {
      //     console.table([item.name].concat(item.recipes));
      //   });
      // });

      itemListEl.append(element, ...items.map((item) => item.element));
    });

    appEl.append(controleEl, itemListEl);

    searchInputEl.addEventListener("input", (e) => {
      e.preventDefault();

      const value = e.target.value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      while (itemListEl.firstChild) {
        itemListEl.removeChild(itemListEl.firstChild);
      }

      if (!e.target.value) {
        categoryItems.forEach(({ element, items }) => {
          itemListEl.append(element, ...items.map((item) => item.element));
        });
      }

      categoryItems.forEach(({ element, items }) => {
        const filteredItem = items.filter(({ item }) => {
          const isKeywordMatch = item.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(value);

          const isCategoryMatch = item.categories.some((category) =>
            category.toLowerCase().includes(value)
          );

          return isKeywordMatch || isCategoryMatch;
        });

        if (filteredItem.length) {
          itemListEl.append(
            element,
            ...filteredItem.map((item) => item.element)
          );
        }
      });

      if (itemListEl.firstChild === null) {
        const el = document.createElement("p");
        el.textContent =
          language === "fr"
            ? "Aucune recette trouvé correspondant à votre recherche."
            : "No recipes found matching your search.";
        el.style.fontSize = "17px";
        itemListEl.append(el);
      }
    });
  }
}
