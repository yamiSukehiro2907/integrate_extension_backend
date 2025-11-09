import { type Request, type Response } from "express";
import pool from "../config/database";

export const getAllEndpoints = async (req: Request, res: Response) => {
  try {
    let projectId = req.projectId;
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }


    const client = await pool.connect();

    const query = `
      SELECT 
        e.id,
        e.project_id,
        p.name AS project_name,
        e.method,
        e.path,
        e.version,
        e.request_format,
        e.response_format,
        e.endpoint_status,
        e.completed_at,
        e.created_at
      FROM endpoints e
      LEFT JOIN projects p ON e.project_id = p.id
      WHERE e.project_id = $1
      ORDER BY e.created_at DESC;
    `;

    const result = await client.query(query, [projectId]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No endpoints found for this project",
      });
    }

    const groupedByStatus = result.rows.reduce(
      (acc: Record<string, any[]>, endpoint) => {
        const status = endpoint.endpoint_status || "not_started";
        if (!acc[status]) acc[status] = [];
        acc[status].push(endpoint);
        return acc;
      },
      {}
    );
    return res.status(200).json({
      message: "✅ Endpoints fetched successfully",
      totalCount: result.rows.length,
      groupedByStatus,
    });
  } catch (error: any) {
    console.error("❌ Error getting endpoints:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
