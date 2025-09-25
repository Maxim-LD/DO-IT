import app from "./app";
import { config } from "./config";
import { DataBaseConnection } from "./database/connection";
import { logger } from "./utils/logger";

const startServer = async (): Promise<void> => { // It doesn’t give back a value - just runs startup logic
    try {
        const dbConnection = DataBaseConnection.getInstance()
        await dbConnection.connect()
        logger.info('Database connected successfully')

        // Start the server
        const server = app.listen(config.port, () => {
            logger.info(`Server is running on http://localhost:${config.port}`);
            logger.info(`Current environment is ${config.nodeEnv}`);        
        })
        
        // Graceful shutdown
        const shutdown = async (signal: string) => {
            logger.info(`${signal} received. Shutting down gracefully...`)

            server.close(async () => {
                logger.info('HTTP server closed')

                try {
                    await dbConnection.disconnect()
                    process.exit(0) // Success
                } catch (error) {
                    logger.error('Error during database shutdown:', error);
                    process.exit(1); // Error
                }
            })
        }

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1)
    }

}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer()


