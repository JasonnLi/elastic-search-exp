import ApiClient from "./ApiClient";

const api = new ApiClient(process.env.API_URL); // what is API_URL stands for

export interface IUser {
  userId: String;
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  last_login_date: Date;
}

// Request intterface here is used for defining the request body type
export interface ILoginRequest {
  email: String;
  password: String;
}

// Response interface here is to specifcy the response type needed from POST and GET
interface ILoginResponse {
  token: string;
}

interface IGetUsersResponse {
  users: IUser[];
}

export default class UserApi {
  public static async createUser(
    email: Partial<IUser>,
  ): Promise<IUser> {
    try{
      await api.POST<IUser>('/users/register', email)
    }catch(err) {
      throw (err)
    }
    return
  }

  public static async login(
    creds: Partial <ILoginRequest>
  ): Promise<ILoginResponse> {
    return (await api.POST<ILoginResponse>("/users/login", creds)).data;
  }
}
 