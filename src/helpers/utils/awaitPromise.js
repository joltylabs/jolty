export default async (promise, callback) => {
  await promise;
  callback();
};
