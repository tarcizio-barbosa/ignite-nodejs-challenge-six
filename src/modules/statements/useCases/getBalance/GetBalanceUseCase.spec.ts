import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { v4 as uuid } from "uuid";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let inMemoryStatementsRepository: InMemoryStatementsRepository;

let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to get a User balance", async () => {
    const newUser = await createUserUseCase.execute({
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    });

    const getBalance = await getBalanceUseCase.execute({
      user_id: newUser.id as string,
    });

    expect(getBalance).toHaveProperty("balance");
  });

  it("Should not able able to get a balance if user does not exists", () => {
    const id = uuid();

    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: id,
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
