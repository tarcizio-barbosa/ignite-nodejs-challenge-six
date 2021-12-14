import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { v4 as uuid } from "uuid";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let getStatementOperationUseCase: GetStatementOperationUseCase;

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get a User statement operation", async () => {
    const newUser = await createUserUseCase.execute({
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    });

    const newStatement = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Emergency Found",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: newUser.id as string,
      statement_id: newStatement.id as string,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
  });

  it("Should not be able to get a statement operation if user does not exists", () => {
    const user_id = uuid();

    const statement_id = uuid();

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a statement operation if does not exists", () => {
    expect(async () => {
      const newUser = await createUserUseCase.execute({
        name: "Tarcizio",
        email: "tarcizio@io.com",
        password: "k9sonwow1%",
      });

      const id = uuid();

      await getStatementOperationUseCase.execute({
        user_id: newUser.id as string,
        statement_id: id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
