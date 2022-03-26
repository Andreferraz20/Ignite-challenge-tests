import {AuthenticateUserUseCase} from "./AuthenticateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {ICreateUserDTO} from "../createUser/ICreateUserDTO";
import {create} from "domain";
import {CreateUserError} from "../createUser/CreateUserError";
import {IncorrectEmailOrPasswordError} from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", ()=> {

  beforeEach(()=> {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to authenticate an User", async ()=> {
    const user: ICreateUserDTO = {
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    }
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token")
  })

  it("Should not be able to authenticate nonexistent user", async ()=> {
    expect(async ()=> {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "123"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
