import { generateProjectToken } from "../helpers/token.helper";
import pool from "./database";

export const seedMockData = async () => {
  const client = await pool.connect();

  try {
    const userCheck = await client.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCheck.rows[0].count) > 0) {
      console.log("⚠️  Mock data already exists, skipping seed...");
      return;
    }
    console.log("🌱 Seeding mock data...");
    const user1 = await client.query(
      `
      INSERT INTO users (name, email, username, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
      ["John Doe", "john@example.com", "johndoe", "password123"]
    );

    const user2 = await client.query(
      `
      INSERT INTO users (name, email, username, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
      ["Jane Smith", "jane@example.com", "janesmith", "password123"]
    );

    const user3 = await client.query(
      `
      INSERT INTO users (name, email, username, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
      ["Bob Wilson", "bob@example.com", "bobwilson", "password123"]
    );

    const userId1 = user1.rows[0].id;
    const userId2 = user2.rows[0].id;
    const userId3 = user3.rows[0].id;

    const token1 = generateProjectToken("1");
    const project1 = await client.query(
      `
      INSERT INTO projects (name, version, owner_id, project_status, projectToken)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
      ["E-Commerce API", "1.0.0", userId1, "ongoing", token1]
    );

    const token2 = generateProjectToken("2");
    const project2 = await client.query(
      `
      INSERT INTO projects (name, version, owner_id, project_status, projectToken)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
      ["Social Media API", "2.1.0", userId2, "completed", token2]
    );

    const token3 = generateProjectToken("3");
    const project3 = await client.query(
      `
      INSERT INTO projects (name, version, owner_id, project_status, projectToken)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
      ["Payment Gateway", "1.5.0", userId1, "not_started", token3]
    );

    const projectId1 = project1.rows[0].id;
    const projectId2 = project2.rows[0].id;
    const projectId3 = project3.rows[0].id;

    await client.query(
      `
      INSERT INTO project_details (project_id, rules_md, schema, version)
      VALUES ($1, $2, $3, $4)
    `,
      [
        projectId1,
        "# E-Commerce Rules\n- All prices must be positive\n- Stock must be tracked",
        JSON.stringify({
          type: "object",
          properties: { product: { type: "string" } },
        }),
        "1.0.0",
      ]
    );

    await client.query(
      `
      INSERT INTO project_details (project_id, rules_md, openapi_file, version)
      VALUES ($1, $2, $3, $4)
    `,
      [
        projectId2,
        "# Social Media Rules\n- Posts must have content\n- Users can follow each other",
        JSON.stringify({ openapi: "3.0.0", info: { title: "Social API" } }),
        "2.1.0",
      ]
    );

    await client.query(
      `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, $3)
    `,
      [projectId1, userId1, "owner"]
    );

    await client.query(
      `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, $3)
    `,
      [projectId1, userId2, "developer"]
    );

    await client.query(
      `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, $3)
    `,
      [projectId2, userId2, "owner"]
    );

    await client.query(
      `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, $3)
    `,
      [projectId2, userId3, "viewer"]
    );

    await client.query(
      `
      INSERT INTO endpoints (project_id, method, path, version, request_format, response_format, endpoint_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        projectId1,
        "GET",
        "/products",
        "1.0.0",
        JSON.stringify({ query: { category: "string" } }),
        JSON.stringify({
          products: [{ id: "number", name: "string", price: "number" }],
        }),
        "completed",
      ]
    );

    await client.query(
      `
      INSERT INTO endpoints (project_id, method, path, version, request_format, response_format, endpoint_status, completed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        projectId1,
        "POST",
        "/products",
        "1.0.0",
        JSON.stringify({
          body: { name: "string", price: "number", stock: "number" },
        }),
        JSON.stringify({ id: "number", message: "string" }),
        "completed",
        new Date(),
      ]
    );

    await client.query(
      `
      INSERT INTO endpoints (project_id, method, path, version, endpoint_status)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [projectId1, "DELETE", "/products/:id", "1.0.0", "ongoing"]
    );

    await client.query(
      `
      INSERT INTO endpoints (project_id, method, path, version, request_format, response_format, endpoint_status, completed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        projectId2,
        "GET",
        "/posts",
        "2.1.0",
        JSON.stringify({ query: { userId: "number", limit: "number" } }),
        JSON.stringify({
          posts: [{ id: "number", content: "string", author: "string" }],
        }),
        "completed",
        new Date(),
      ]
    );

    await client.query(
      `
      INSERT INTO endpoints (project_id, method, path, version, endpoint_status)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [projectId3, "POST", "/payments", "1.5.0", "not_started"]
    );

    console.log("✅ Mock data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding mock data:", error);
    throw error;
  } finally {
    client.release();
  }
};