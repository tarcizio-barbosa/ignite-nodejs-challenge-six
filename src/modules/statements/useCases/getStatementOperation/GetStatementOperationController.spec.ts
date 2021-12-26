import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import request from "supertest";
import { app } from "../../../../app";
import { v4 as uuid } from "uuid";

let connection: Connection;

describe("Get Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get a User statement operation", async () => {
    const newUser: ICreateUserDTO = {
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    };

    await request(app).post("/api/v1/users").send(newUser);

    const newSession = await request(app).post("/api/v1/sessions").send({
      email: newUser.email,
      password: newUser.password,
    });

    const { token } = newSession.body;

    const newStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Emergency found",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id } = newStatement.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
  });

  it("Should not be able to get a statement operation if does not exists", async () => {
    const newUser: ICreateUserDTO = {
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    };

    await request(app).post("/api/v1/users").send(newUser);

    const newSession = await request(app).post("/api/v1/sessions").send({
      email: newUser.email,
      password: newUser.password,
    });

    const { token } = newSession.body;

    const id = uuid();

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });
});
