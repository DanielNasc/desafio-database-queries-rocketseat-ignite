import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .select("game")
      .from(Game, "game")
      .where("LOWER(game.title) LIKE LOWER(:param)", { param: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(*) FROM "games"`); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // Esse método deve receber o Id de um game e retornar uma lista de todos os usuários que possuem o game do Id informado.

    const users = await this.repository
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .innerJoin("user.games", "game")
      .where("game.id = :id", { id })
      .getMany();

    return users;
  }
}
