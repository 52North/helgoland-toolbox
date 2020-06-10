module.exports = {
  name: 'selector',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/selector',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
