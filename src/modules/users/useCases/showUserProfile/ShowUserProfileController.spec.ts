import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show a User profile", async () => {
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

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body).toHaveProperty("id");
  });

  it("Should not be able to show a User profile if does not exists", async () => {
    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${process.env.FAKE_TOKEN}`,
      });

    expect(response.status).toBe(404);
  });
});
