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

function logClass(target: any): void {
  // save a reference to the original constructor
  const original = target;

  // a utility function to generate instances of a class
  function construct(constructor, args): any {
    const c: any = function() {
      return constructor.apply(this, args);
    };
    c.prototype = constructor.prototype;
    return new c();
  }

  // the new constructor behaviour
  const f: any = function(...args) {
    console.log('New: ' + original.name);
    return construct(original, args);
  };

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype;

  // return new constructor (will override original)
  return f;
}

@logClass
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
