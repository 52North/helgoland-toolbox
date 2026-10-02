module.exports = {
  source: ["!package.json", "projects/**"],
  // Indent used in package.json files
  indent: "  ",
  versionGroups: [{
    // Published libraries declare a broad peer range, so consumers on any Angular 20.x
    // share their single Angular instance. Must stay before the build version pin below.
    "label": "Peer ranges of published @helgoland libraries",
    "dependencies": ["@angular/**", "@helgoland/**"],
    "dependencyTypes": ["peer"],
    "pinVersion": "^20.0.0",
    "packages": ["@helgoland/**"],
  }, {
    // Everything else in the repo (e.g. helgoland-common) builds against this version.
    "label": "Angular build version",
    "dependencies": ["@angular/**"],
    "pinVersion": "^20.3.33",
    "packages": ["**"],
  }]
};
