exports.slugify = function (text) {
  return text.toLowerCase().trim().replace(/&/g, " ").replace(/\s+/g, "-");
};
