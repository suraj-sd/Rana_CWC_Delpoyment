const request = require("supertest");
const app = require("../app.js");
const roleModels = require("../src/component/role/role.model.js");

jest.mock("../src/component/role/role.model.js");

describe("POST /api/roles", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a role successfully", async () => {
    const mockRole = {
      roleCode: "admin",
      roleName: "administrator",
    };

    // Mock save()
    roleModels.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockRole),
    }));

    const res = await request(app).post("/api/roles").send({
      roleCode: "ADMIN",
      roleName: "Administrator",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.roleCode).toBe("admin");
    expect(res.body.data.roleName).toBe("administrator");
  });

  it("should return 500 if DB throws error", async () => {
    roleModels.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("DB Error")),
    }));

    const res = await request(app).post("/api/roles").send({
      roleCode: "ADMIN",
      roleName: "Administrator",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.err).toBe("DB Error");
  });
});
