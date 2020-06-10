module.exports = {
  name: 'control',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/control',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
