import { Connection } from "typeorm";
import createConnection from "../../../../database";
import request from "supertest";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let connection: Connection;

describe("Authenticate a User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate a user", async () => {
    const newUser: ICreateUserDTO = {
      name: "Tarcizio",
      email: "tarcizio@io.com.br",
      password: "k9sonwow1%",
    };

    await request(app).post("/api/v1/users").send(newUser);

    const response = await request(app).post("/api/v1/sessions").send({
      email: newUser.email,
      password: newUser.password,
    });

    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate a User with the incorrect E-mail", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "tarcizio@oi.com.br",
      password: "k9sonwow1%",
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able to authenticate a User with the incorrect Password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "tarcizio@io.com.br",
      password: "k9sonwow1$",
    });

    expect(response.status).toBe(401);
  });
});
