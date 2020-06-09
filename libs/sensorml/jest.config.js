module.exports = {
  name: 'sensorml',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/sensorml',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
