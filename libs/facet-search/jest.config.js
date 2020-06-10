module.exports = {
  name: 'facet-search',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/facet-search',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
