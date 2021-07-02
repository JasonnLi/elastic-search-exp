import { Request, Response, Router } from "express";
import express from "express";
// import * as querystring from 'querystring';
// import { Client, ApiResponse, RequestParams } from "@elastic/elasticsearch"
import Play, { IPlay } from "../models/playModel";
import { authController } from "./authController";

// handling error message
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_NOT_FOUND = 404;
const HTTP_BAD_REQUEST = 400;

// const client = new Client({ node: 'http://localhost:9200' });

interface ICreatePlayInput {
  Dataline: IPlay["Dataline"];
  Play: IPlay["Play"];
  PlayerLinenumber: IPlay["PlayerLinenumber"];
  ActSceneLine: IPlay["ActSceneLine"];
  Player: IPlay["Player"];
  PlayerLine: IPlay["PlayerLine"];
}

export class PlayerController {
  private router: Router;

  mount(parentRouter: Router) {
    this.router = express.Router();
    this.router.get("/", this.getAllPlays);

    this.router.get("/numPlayersPerPlay", this.numPlayersPerPlay);

    this.router.get("/numLinesPerPlayer", this.numLinesPerPlayer);

    this.router.post("/numLinesPerPlayer", this.numLinesPerPlayer);

    this.router.get("/:id", authController, this.getPlayById);
    this.router.post("/", authController, this.createPlay);
    this.router.put("/:id", authController, this.updatePlay);
    this.router.delete("/:id", authController, this.deletePlay);

    parentRouter.use("/plays", this.router);
  }

  private async getAllPlays(req: Request, res: Response) {
    try {
      const plays = await Play.find();
      return res.send(plays);
    } catch (err) {
      return res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: err });
    }
  }

  private async getPlayById(req: Request, res: Response) {
    try {
      const play = await Play.findById(req.params.id);
      if (!play) {
        return res.status(HTTP_NOT_FOUND).send({ message: "Not Found" });
      }
      res.send(play);
    } catch (err) {
      return res.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
  }

  private async createPlay(req: Request, res: Response) {
    const requiredKeys = [
      "Dataline",
      "Play",
      "PlayerLinenumber",
      "ActSceneLine",
      "Player",
      "PlayerLine",
    ];

    for (let key of requiredKeys) {
      // validate if there is value inside the each key of the request body
      if (!req.body[key]) {
        return res
          .status(HTTP_BAD_REQUEST)
          .send({ message: `Requred body field not found "${key}"` });
      }
    }

    const newPlay = {
      Dataline: req.body.Dataline,
      Play: req.body.Play,
      PlayerLinenumber: req.body.PlayerLinenumber,
      ActSceneLine: req.body.ActSceneLine,
      Player: req.body.Player,
      PlayerLine: req.body.PlayerLine,
    };

    try {
      await Play.create(newPlay);
      res.send(newPlay);
    } catch (err) {
      return res.status(HTTP_BAD_REQUEST).send({ message: err });
    }
  }

  private async updatePlay(req: Request, res: Response) {
    try {
      await Play.updateOne(
        { _id: req.params.id },
        {
          Dataline: req.body.Dataline,
          Play: req.body.Play,
          PlayerLinenumber: req.body.PlayerLinenumber,
          ActSceneLine: req.body.ActSceneLine,
          Player: req.body.Player,
          PlayerLine: req.body.PlayerLine,
        },
        (err, result) => {
          if (err) {
            return res.send(err);
          }
          res.send(result);
        }
      );
    } catch (err) {
      return res.status(HTTP_BAD_REQUEST).send({ message: err });
    }
  }

  private async deletePlay(req: Request, res: Response) {
    try {
      await Play.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
          return res.send(err);
        }
        res.send("successfully delete");
      });
    } catch (err) {
      return res.status(HTTP_BAD_REQUEST).send({ message: err });
    }
  }

  // number of players for each shakespear play
  private async numPlayersPerPlay(req: Request, res: Response) {
    try {
      const playersPerPlay = await Play.aggregate([
        {
          $group: {
            // the first group is to get non unique value count
            _id: { Play: "$Play", Player: "$Player" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            // the second group is to get unique value count of Player
            _id: { Play: "$_id.Play" },
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            count: { $gt: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);
      if (!playersPerPlay) {
        return res.status(HTTP_NOT_FOUND).send({ message: "Not Found" });
      }
      res.send(playersPerPlay);
    } catch (err) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
  }

  // number of play lines per player per play
  private async numLinesPerPlayer(req: Request, res: Response) {
    try {
      /*
      res.writeHead(200, {'Content-Type': 'text/plain'});
      const url = req.url;
      const params = querystring.parse(url).query
      */
      const lines_count = await Play.aggregate([
        {
          $group: {
            _id: {
              Play: "$Play",
              Player: "$Player",
              PlayerLinenumber: "$PlayerLinenumber",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: { Play: "$_id.Play", Player: "$_id.Player" },
            total_line: { $sum: 1 },
          },
        },
        {
          $project: {
            "_id.Play": 1,
            "_id.Player": 1,
            total_line: 1,
          },
        },
        {
          $match: {
            "_id.Play": req.body.Play,
          },
        },
        {
          $limit: 10,
        },
        {
          $sort: {
            total_line: -1,
          },
        },
      ]);
      if (!lines_count) {
        return res.status(HTTP_NOT_FOUND).send({ message: "Not Found" });
      } else {
        let result = [];
        // only output the needed data in JSON format
        for (let i of lines_count) {
          let arr = {
            Play: i._id.Play,
            Player: i._id.Player,
            total_line: i.total_line,
          };
          result.push(arr);
        }
        res.send(result);
      }
    } catch (err) {
      return res.status(HTTP_INTERNAL_SERVER_ERROR).send(err);
    }
  }
}

// loop posting is used to import local Json file into the DB

/*
api.post("/posting", async (req, res) => {
  for (let i of data) {
    const user = await UserController.CreatePlay({
      Dataline: i.Dataline,
      Play: i.Play,
      PlayerLinenumber: i.PlayerLinenumber,
      ActSceneLine: i.ActSceneLine,
      Player: i.Player,
      PlayerLine: i.PlayerLine,
    });
  }
});

Using MongoDB aggregation:
- query is more complicated and harder to understand such as selecion and distinct count
- the output of the pipeline is limited to 16M
*/
