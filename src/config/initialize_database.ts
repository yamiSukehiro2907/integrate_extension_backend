import pool from "./database";

export const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE status AS ENUM ('completed', 'ongoing', 'not_started');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        version VARCHAR(50) DEFAULT '1.0.0',
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        project_status status DEFAULT 'not_started',
        projectToken TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS project_details (
        id SERIAL PRIMARY KEY,
        project_id INTEGER UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
        rules_md TEXT,
        openapi_file JSONB,
        schema JSONB,
        version VARCHAR(50) DEFAULT '1.0.0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(100),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (project_id, user_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS endpoints (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        method VARCHAR(10) NOT NULL,
        path VARCHAR(255) NOT NULL,
        version VARCHAR(50) DEFAULT '1.0.0',
        request_format JSONB,
        response_format JSONB,
        endpoint_status status DEFAULT 'not_started',
        completed_at TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (project_id, method, path)
      );
    `);

    await client.query(
      `CREATE INDEX IF NOT EXISTS users_name_idx ON users (name);`
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects (owner_id);`
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS projects_status_idx ON projects (project_status);`
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS projects_name_idx ON projects (name);`
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS endpoints_status_idx ON endpoints (endpoint_status);`
    );

    console.log("✅ All tables and indexes created successfully");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    throw error;
  } finally {
    client.release();
  }
};
