module.exports = {
  name: 'open-layers',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/open-layers',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ]
};
