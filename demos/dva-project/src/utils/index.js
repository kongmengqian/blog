export const delayed = () => {
  return new Promise((resolve, reject) => {
    console.log("====马上会执行的Promise======");
    setTimeout(() => {
      console.log("=====Promise中的setTimeout=====");
      resolve();
    }, 0);
  });
};
