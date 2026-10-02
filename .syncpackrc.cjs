module.exports = {
  source: ["!package.json", "projects/**"],
  // Indent used in package.json files
  indent: "  ",
  versionGroups: [{
    "dependencies": ["@angular/**"],
    "pinVersion": "^20.3.33",
    "packages": ["**"],
  }]
};
