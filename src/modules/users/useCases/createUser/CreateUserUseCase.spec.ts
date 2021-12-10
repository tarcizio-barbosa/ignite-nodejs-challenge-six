import { validate } from "uuid";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new User", async () => {
    const user = await createUserUseCase.execute({
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    });

    expect(user).toHaveProperty("id");
    expect(user.password.length).toEqual(60);
    expect(validate(user.id as string)).toBeTruthy();
    expect(user.email).toMatch(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  });

  it("Should not be able to create a new User with the same e-mail", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Tarcizio One",
        email: "tarcizio@io.com.br",
        password: "k9sonwow1%",
      });

      await createUserUseCase.execute({
        name: "Tarcizio Two",
        email: "tarcizio@io.com.br",
        password: "k9sonwow1%",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
