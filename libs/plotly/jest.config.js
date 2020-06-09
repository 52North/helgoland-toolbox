module.exports = {
  name: 'plotly',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plotly',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
