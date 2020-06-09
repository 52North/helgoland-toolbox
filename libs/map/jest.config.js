module.exports = {
  name: 'map',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/map',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
