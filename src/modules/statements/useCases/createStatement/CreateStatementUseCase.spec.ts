import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {CreateStatementUseCase} from "./CreateStatementUseCase";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {ICreateStatementDTO} from "./ICreateStatementDTO";
import {User} from "../../../users/entities/User";
import {Statement} from "../../entities/Statement";
import {CreateStatementError} from "./CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Create Statement", ()=> {

  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  })

  it("Should be able to create a Deposit Statement", async ()=> {
    const user: User = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    const createdStatement = await createStatementUseCase.execute({
      // @ts-ignore
      user_id: user.id.toString(),
      amount: 900,
      type: OperationType.DEPOSIT,
      description: "deposit"
    })

    expect(createdStatement).toBeInstanceOf(Statement)
  })

  it("Should be able to create a Withdraw Statement", async ()=> {
    const user: User = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    await createStatementUseCase.execute({
      // @ts-ignore
      user_id: user.id.toString(),
      amount: 900,
      type: OperationType.DEPOSIT,
      description: "deposit"
    })

    const createdStatement = await createStatementUseCase.execute({
      // @ts-ignore
      user_id: user.id.toString(),
      amount: 200,
      type: OperationType.WITHDRAW,
      description: "deposit"
    })

    expect(createdStatement).toBeInstanceOf(Statement)
  })

  it("Should not be able to create a Withdraw Statement with insuficient founds", async ()=> {
    const user: User = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    await expect(async () => {
      await createStatementUseCase.execute({
        // @ts-ignore
        user_id: user.id.toString(),
        amount: 200,
        type: OperationType.WITHDRAW,
        description: "deposit"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
