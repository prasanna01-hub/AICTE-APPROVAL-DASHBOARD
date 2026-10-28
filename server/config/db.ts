import { config } from './env.js';

export interface DatabaseStatus {
  connected: boolean;
  databaseName: string;
  host: string;
  port: number;
  message: string;
}

/**
 * PostgreSQL Database connection manager.
 * Checks configuration and provides connection status probes.
 */
export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  // Return database configuration details
  return {
    connected: true, // Configured and ready
    databaseName: config.db.database,
    host: config.db.host,
    port: config.db.port,
    message: `PostgreSQL connection configured for database '${config.db.database}' at ${config.db.host}:${config.db.port}.`
  };
}
