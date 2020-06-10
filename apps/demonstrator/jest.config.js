module.exports = {
  name: 'demonstrator',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/demonstrator',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
