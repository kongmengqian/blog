declare class Greeter {
  static standardGreeting: string;
  greeting: string;
  constructor(message: string);
  greet(): string;
}
declare let greeter1: Greeter;
declare let greeterMaker: typeof Greeter;
declare let greeter2: Greeter;

type Alias = {
  num: number;
};
interface Interface {
  /**num */
  num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
