import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {CreateStatementUseCase} from "./CreateStatementUseCase";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {ICreateStatementDTO} from "./ICreateStatementDTO";
import {User} from "../../../users/entities/User";

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
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  })

  it("Should be able to create a Deposit Statement", async ()=> {
    const user: User = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    if(!user.id){
      throw new Error("User without id");
    }

    /* Assim funciona
    const createdStatement = await createStatementUseCase.execute({
      user_id: "123456",
      amount: 900,
      type: OperationType.DEPOSIT,
      description: "deposit"
    })
     */

    const createdStatement = await createStatementUseCase.execute({
      user_id: user.id.toString(),
      amount: 900,
      type: OperationType.DEPOSIT,
      description: "deposit"
    })

  })
})
