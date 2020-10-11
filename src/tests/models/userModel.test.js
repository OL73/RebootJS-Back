// TODO transformer en TS
import { User } from '../../models/usersModel';

describe('User functions', () => {
  test('User#changeFirstname', () => {
    const thomas = new User("Thomas", "Falcone", "adresse");

    thomas.changeFirstname("Bernard");

    expect(thomas.firstname).toBe("Bernard");
  });

  test('User#changeLastname', () => {
    const thomas = new User("Thomas", "Falcone", "adresse");

    thomas.changeLastname("Dupont");

    expect(thomas.lastname).toBe("Dupont");
  });
});