module.exports = {
  name: 'map',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/map',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
