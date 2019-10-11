function logProperty(target: any, key: string): void {
  // property value
  let _val = this[key];

  // property getter
  const getter = function(): any {
    console.log(`Get: ${key} => ${_val}`);
    return _val;
  };

  // property setter
  const setter = function(newVal: any): any {
    console.log(`Set: ${key} => ${newVal}`);
    _val = newVal;
  };

  // Delete property.
  // Create new property with getter and setter
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

function logFunction(_target: any, key: string, value: any): any {
  return {
    value: function(...args: any[]): any {
      const a = args.map(a => JSON.stringify(a)).join();
      const result = value.value.apply(this, args);
      const r = JSON.stringify(result);
      console.log(`Call: ${key}(${a}) => ${r}`);
      return result;
    },
  };
}

class Person {
  @logProperty
  public name: string;
  public surname: string;

  constructor(name: string, surname: string) {
    this.name = name;
    this.surname = surname;
  }

  @logFunction
  duplicateAge(age: number): number {
    return age * 2;
  }
}

const me = new Person('Kadenge', 'Yaa');

me.name = 'Jeff';

me.name;

me.duplicateAge(2);
