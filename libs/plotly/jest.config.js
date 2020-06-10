module.exports = {
  name: 'plotly',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plotly',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
