module.exports = {
  name: 'caching',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/caching',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
