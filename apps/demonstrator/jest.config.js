module.exports = {
  name: 'demonstrator',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/demonstrator',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
