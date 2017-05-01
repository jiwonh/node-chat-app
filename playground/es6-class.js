class Person {
  constructor (name, age) {
    this._name = name;
    this._age = age;
  };

  get name () {
    return this._name.toUpperCase();
  };

  set name (value) {
    this._name = value;
  };

};

class Employee extends Person {
  constructor (name, age, job) {
    Employee._counter = (Employee._counter || 0) + 1;
    super(name, age);
    this._id = Employee._counter;
    this._job = job;
  }

  get id () {
    return this._id;
  };

  getAll() {
    return {
      id: this._id,
      name: this._name,
      age: this._age,
      job: this._job
    }
  };

  static count() {
    return Employee._counter;
  };

};

var emp1 = new Employee('Jiwon', 40, 'Developer');
var emp2 = new Employee('Cami', 16, 'Dog');
console.log(Employee.count());
console.log(emp1.getAll());
console.log(emp2.getAll());
