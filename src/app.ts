import 'reflect-metadata';

function logType(target: any, key: string): void {
  const t = Reflect.getMetadata('design:type', target, key);
  console.log(`${key} type: ${t.name}`);
}

function logParamTypes(target: any, key: string): void {
  const types = Reflect.getMetadata('design:paramtypes', target, key);
  const s = types.map(a => a.name).join();
  console.log(`${key} param types: ${s}`);
}

function logReturnType(target: any, key): void {
  const type = Reflect.getMetadata('design:returntype', target, key);

  console.log(`${key} return type: ${type.name}`);
}

class Foo {}

class Person {
  @logType
  public name: string;

  @logReturnType
  @logParamTypes
  doSomething(
    param1: string,
    param2: number,
    param3: Foo,
    param4: { test: string },
    param5: {},
    param6: Function,
    param7: (a: number) => void,
  ): number {
    return 1;
  }
}
