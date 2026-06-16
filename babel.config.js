module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: isTest ? ['@react-native/babel-preset'] : ['babel-preset-expo'],
  };
};
