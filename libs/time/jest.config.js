module.exports = {
  name: 'time',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/time',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
