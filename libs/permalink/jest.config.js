module.exports = {
  name: 'permalink',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/permalink',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
