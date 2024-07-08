/**
 * @typedef {Object} Item
 * @property {string} name
 * @property {string|undefined} subTitle
 * @property {Array<string>} categories
 * @property {string} slug
 * @property {Icon} icon
 * @property {number} rarity
 * @property {Array<string>} recipes
 */

/**
 * @typedef {Object} Icon
 * @property {string} small
 * @property {string} medium
 * @property {string} large
 */

export class VRisingDBService {
  language;
  #apiPath;
  #iconApiPath;

  #countries = [
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
  ];

  constructor(language = "en") {
    this.language = this.#countries.includes(language) ? language : "en";
    this.#apiPath = `https://scdn.gaming.tools/vrising/data/${language}/`;
    this.#iconApiPath = "https://gtcdn.info/vrising";
  }

  /** @returns {Promise<Array<Item>>} */
  async getItems() {
    const responses = await Promise.all([
      fetch(this.#apiPath + "item.json"),
      fetch(this.#apiPath + "recipe.json"),
    ]);

    const [itemsData, recipesData] = await Promise.all(
      responses.map((response) => response.json())
    );

    return itemsData.map((item) => ({
      name: item.name.replace("\\n", "\n").replace("’", "'"),
      subTitle: item.subTitle,
      categories: item.itemCategories,
      slug: item.slug,
      icon: {
        small: this.#iconApiPath + item.iconPath.replace("{height}", 64),
        medium: this.#iconApiPath + item.iconPath.replace("{height}", 128),
        large: this.#iconApiPath + item.iconPath.replace("{height}", 256),
      },
      rarity: item.rarity ? item.rarity + 1 : 1,
      recipes: recipesData
        .filter(
          (recipe) =>
            recipe.name === item.name &&
            recipe.iconPath === item.iconPath &&
            !recipe.slug.includes("trader")
        )
        .map((recipe) => recipe.slug),
    }));
  }
}
