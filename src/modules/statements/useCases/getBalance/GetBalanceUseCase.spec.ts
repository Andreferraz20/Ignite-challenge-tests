import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {User} from "../../../users/entities/User";
import {CreateStatementUseCase} from "../createStatement/CreateStatementUseCase";
import {GetBalanceError} from "./GetBalanceError";
import {GetBalanceUseCase} from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Get balance", ()=> {

  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory,usersRepositoryInMemory)
  })

  it("Should be able to get a balance for an user", async ()=> {
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

    await createStatementUseCase.execute({
      // @ts-ignore
      user_id: user.id,
      amount: 300,
      type: OperationType.WITHDRAW,
      description: "withdraw"
    })

    const getBalance = await getBalanceUseCase.execute({user_id: createdStatement.user_id})

    expect(getBalance).toHaveProperty("balance")
    expect(getBalance.balance).toBeGreaterThan(0)

  })

  it("Should not be able to get a balance for a nonexistent user", async ()=> {
    await expect(async () => {
      await getBalanceUseCase.execute({user_id: "123"})
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
