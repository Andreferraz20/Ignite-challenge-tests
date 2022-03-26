import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {ShowUserProfileUseCase} from "./ShowUserProfileUseCase";
import {ShowUserProfileError} from "./ShowUserProfileError";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {

  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  })

  it("Should be able to show an user profile", async() => {

    const user = await createUserUseCase.execute({
      name: "Name Test",
      password: "password",
      email: "emailtest@teste.com"
    });

    // @ts-ignore
    const profile = await showUserProfileUseCase.execute(user.id);

    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("email");
    expect(profile).toHaveProperty("password");

  })

  it("Should not be able to show an user profile", () => {
    expect(async ()=> {
      await showUserProfileUseCase.execute("123teste")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
