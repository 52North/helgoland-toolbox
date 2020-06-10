module.exports = {
  name: 'depiction',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/depiction',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
