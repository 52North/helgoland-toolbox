module.exports = {
  name: 'eventing',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/eventing',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
