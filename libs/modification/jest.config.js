module.exports = {
  name: 'modification',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/modification',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
