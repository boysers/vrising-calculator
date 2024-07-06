export function createItemCardElement(item) {
  const recipeCount = item.recipes.length;

  const linkEl = document.createElement("a");

  const recipePath = `/?recipe=${item.recipes[0]}&quantity=1&language=fr`;

  linkEl.setAttribute("href", recipePath);

  const itemCardEl = document.createElement("div");
  itemCardEl.classList.add("card");

  const iconEl = document.createElement("div");
  iconEl.classList.add("card__image");
  const containerImgEl = document.createElement("div");
  if (recipeCount > 1) {
    containerImgEl.setAttribute("data-recipe-count", recipeCount);
  }
  const imgEl = document.createElement("img");
  imgEl.setAttribute("src", item.icon.small);
  imgEl.setAttribute("alt", `${item.name} icon`);

  iconEl.appendChild(containerImgEl);
  containerImgEl.appendChild(imgEl);

  const titleEl = document.createElement("h3");
  titleEl.appendChild(document.createTextNode(item.name));

  const subTitleEl = document.createElement("h4");
  subTitleEl.appendChild(document.createTextNode(item.subTitle));

  const categoriesEl = document.createElement("p");
  categoriesEl.appendChild(document.createTextNode(item.categories.join(", ")));

  itemCardEl.append(iconEl, titleEl, subTitleEl, categoriesEl);

  linkEl.append(itemCardEl);

  return linkEl;
}
