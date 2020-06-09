module.exports = {
  name: 'time-range-slider',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/time-range-slider',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
