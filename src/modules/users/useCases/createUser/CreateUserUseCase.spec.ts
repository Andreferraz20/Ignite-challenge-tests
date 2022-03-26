import {CreateUserUseCase} from "./CreateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserError} from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to create a new User", async() => {
    const user = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    })

    expect(user).toHaveProperty("id")
  })

  it("Should not be able to create a new User with email exists", () => {
    expect(async ()=> {
      await createUserUseCase.execute({
        name: "Name Test",
        password: "password",
        email: "emailtest@teste.com"
      })
      await createUserUseCase.execute({
        name: "Name Test2",
        password: "password2",
        email: "emailtest@teste.com"
      })
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
