module.exports = {
  name: 'open-layers',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/open-layers',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ]
};
