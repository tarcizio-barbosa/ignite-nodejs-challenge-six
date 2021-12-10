import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate a User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate a User", async () => {
    const newUser: ICreateUserDTO = {
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    };

    await createUserUseCase.execute(newUser);

    const response = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password,
    });

    expect(response).toHaveProperty("token");
  });

  it("Should not be able to authenticate a User with the incorrect E-mail", () => {
    const newUser: ICreateUserDTO = {
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    };

    expect(async () => {
      await createUserUseCase.execute(newUser);

      await authenticateUserUseCase.execute({
        email: "incorrect@.io.com.br",
        password: newUser.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a User with the incorrect Password", () => {
    const newUser: ICreateUserDTO = {
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    };

    expect(async () => {
      await createUserUseCase.execute(newUser);

      await authenticateUserUseCase.execute({
        email: newUser.email,
        password: "k9sonwow2%",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
