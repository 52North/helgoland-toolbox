module.exports = {
  name: 'favorite',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/favorite',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
