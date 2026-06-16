module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '.*\\.css$': '<rootDir>/src/constants/__mocks__/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^test-renderer$': 'react-test-renderer',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
