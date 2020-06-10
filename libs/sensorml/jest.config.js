module.exports = {
  name: 'sensorml',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/sensorml',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  testEnvironment: "jest-environment-jsdom-fourteen"
};
