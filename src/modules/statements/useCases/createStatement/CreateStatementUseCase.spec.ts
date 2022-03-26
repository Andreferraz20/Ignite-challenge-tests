import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {CreateStatementUseCase} from "./CreateStatementUseCase";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {ICreateStatementDTO} from "./ICreateStatementDTO";


let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Create Statement", ()=> {

  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  })

  it("Should be able to create a Deposit Statement", async ()=> {
    const user = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })


    const statement: ICreateStatementDTO = {
      // @ts-ignore
      user_id: user.id,
      amount: 900,
      type: OperationType.DEPOSIT,
      description: "deposit"
    }

    console.log(statement)

    const created_statement = await createStatementUseCase.execute({...statement})

    console.log(created_statement)
  })



})
