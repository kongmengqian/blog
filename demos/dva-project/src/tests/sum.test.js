// import { sum } from "./sum";
const sum = require("./sum");

test("adds 1+2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
test("浮点数相加", () => {
  expect(sum(1.1, 2.1)).toBeCloseTo(3.2);
});
