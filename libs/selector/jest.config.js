module.exports = {
  name: 'selector',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/selector',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
