import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {User} from "../../../users/entities/User";
import {CreateStatementUseCase} from "../createStatement/CreateStatementUseCase";
import {GetStatementOperationUseCase} from "./GetStatementOperationUseCase";
import {GetStatementOperationError} from "./GetStatementOperationError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Statement operation", ()=> {

  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory,statementsRepositoryInMemory);
  })

  it("Should be able to get a statement", async ()=> {
    let user: User = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    const createdStatement = await createStatementUseCase.execute({
      // @ts-ignore
      user_id: user.id,
      amount: 900,
      type: OperationType.DEPOSIT,
      description: "deposit"
    })

    const getStatement = await getStatementOperationUseCase.execute(
      {user_id: createdStatement.user_id,
        // @ts-ignore
        statement_id: createdStatement.id}
    );

    expect(getStatement).toHaveProperty("id");
    expect(getStatement).toHaveProperty("user_id");
    expect(getStatement).toHaveProperty("type");
    expect(getStatement).toHaveProperty("amount");
    expect(getStatement).toHaveProperty("description")
  })
  it("Should not be able to get a statement with invalid id", async ()=> {
    let user: User = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    await expect(async () => {

      await getStatementOperationUseCase.execute(
        {
          // @ts-ignore
          user_id: user.id,
          statement_id: "123"
        }
      );
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it("Should not be able to get a statement with invalid user", async ()=> {
    let user: User = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    await expect(async () => {

      await getStatementOperationUseCase.execute(
        {
          // @ts-ignore
          user_id: user.id,
          statement_id: "123"
        }
      );
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
