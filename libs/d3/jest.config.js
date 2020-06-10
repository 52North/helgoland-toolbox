module.exports = {
  name: 'd3',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/d3',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
