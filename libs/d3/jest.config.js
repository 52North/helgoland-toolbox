module.exports = {
  name: 'd3',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/d3',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
