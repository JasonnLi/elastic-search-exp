import ApiClient from "./ApiClient";

const api = new ApiClient(process.env.API_URL);

export interface IPlay {
  Dataline: Number;
  Play: String;
  PlayerLinenumber: Number;
  ActSceneLine: String;
  Player: String;
  PlayerLine: String
}

export interface IAgg {
  Play: String;
  Player: String;
  total_line: Number
}[]

interface IGetPlaysResponse {
  plays: IPlay[];
}

export default class AppApi {
  public static async getPlays(): Promise<IGetPlaysResponse> {
    // @TODO Replace mock data with call to server
    // return Promise.resolve(MockData.getUsers());
    return (await api.GET<IGetPlaysResponse>("/plays")).data;
  }

  public static async getPlayById(playId: string): Promise<IPlay> {
    // static method is used to assigned method to the class instead of the property
    // @TODO Replace mock data with call to server
    // $ command is used to add data id into path as a new path. This is used in front end to reference doc ID in Mongo
    return (await api.GET<IPlay>(`/plays/${playId}`, false)).data;
  }

  public static async getNumPlayersPerPlay(): Promise<IPlay> {
    return (await api.GET<IPlay>("/plays/numPlayersPerPlay")).data;
  }

  public static async getNumLinesPerPlayer(
    play?: string,
  ): Promise<IPlay> {
    return (await api.GET<IPlay>(`/plays/numLinesPerPlayer`)).data;
  }
  // `/users/numLinesPerPlayer/${play}`

  public static async updatePlay(
    playId: string,
    // using partial to make all data be optional value
    dataLine: Partial<IPlay>
  ): Promise<IPlay> {
    // @TODO Replace mock data with call to server
    try{
      await api.PUT<IPlay>(`/plays/${playId}`, dataLine)
    }catch(err) {
      throw (err)
    }
    return
  }

  public static async deletePlay(
    playId: string
  ): Promise<IPlay> {
    // @TODO Replace mock data with call to server
    try{
      await api.DEL<IPlay>(`/plays/${playId}`)
    }catch(err) {
      throw (err)
    }
    return
  }

  public static async createPlays(
    dataLine: Partial<IPlay>,
  ): Promise<IPlay> {
    // @TODO Replace mock data with call to server
    try{
      await api.POST<IPlay>('/plays', dataLine)
    }catch(err) {
      throw (err)
    }
    return
  }

  public static async getAggNumLinesPerPlayer(
    body: {}
  ) {
    try{
      return await api.POST<IAgg[]>('/plays/numLinesPerPlayer', body);
    }catch(err) {
      throw (err)
    }
  }

  // @TODO Implement create user method
}
