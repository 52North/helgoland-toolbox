module.exports = {
  source: ["!package.json", "projects/**"],
  // Indent used in package.json files
  indent: "  ",
  versionGroups: [{
    "dependencies": ["@angular/**"],
    "pinVersion": "^15.0.0 || ^16.0.0",
    "packages": ["**"],
  }]
};
