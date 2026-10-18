const colorMap = {
  green: "#64d583",
  blue: "#91a8f9",
  orange: "#ee955e",
  pink: "#ee92d7",
  purple: "#aa8ef0",
  yellow: "#f5d770",
  default: "#64d583",
};

/**
 * Returns a hexadecimal string corresponding to the provided color name
 * string. If it isn't found in the colorMap object, colorMap.default is
 * returned.
 *
 * @param {string} colorName - The color name to look up.
 * @returns {string} The matching hexadecimal color or the default color.
 */
function stringToHex(colorName) {
  const color = colorMap[colorName];

  return color || colorMap.default;
}

/**
 * Accepts a hexadecimal string and returns the corresponding color name key,
 * if found in colorMap. If a match isn't found, null is returned.
 *
 * @param {string} hexValue - The hexadecimal color to look up.
 * @returns {string|null} The matching color name, or null if none matches.
 */
function hexToString(hexValue) {
  const colorString = Object.keys(colorMap).find((key) => {
    return colorMap[key] === hexValue;
  });

  return colorString || null;
}

/**
 * Accepts an HTML element and removes all BEM "_color_" modifiers from its
 * class list.
 *
 * @param {HTMLElement} element - The element whose color modifiers to remove.
 * @returns {void}
 */
function removeColorClasses(element) {
  [...element.classList].forEach((cls) => {
    if (cls.includes("_color_")) {
      element.classList.remove(cls);
    }
  });
}

export { stringToHex, hexToString, removeColorClasses };
