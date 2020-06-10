module.exports = {
  name: 'caching',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/caching',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
