export type DBParams = {
    username: string;
    password: string;
    database: string;
    publicIpAddress: string;
    port: number;
    connectionName?: string;
};

export const buildDBConfig = (params: DBParams): any => {
    return {
        username: process.env.DB_USER || params.username,
        password: process.env.DB_PASS || params.password,
        database: process.env.DB_NAME || params.database,
        params: {
            host: process.env.DB_HOST || params.publicIpAddress,
            port: process.env.DB_PORT || params.port || 3306,
            dialect: "mysql",
            dialectOptions: {
                connectTimeout: 10_000,
                ssl: {
                    rejectUnauthorized: false,
                },
                decimalNumbers: true,
                supportBigNumbers: true,
                enableKeepAlive: true,
                keepAliveInitialDelay: 10_000,
            },
            logging: false,            // o una fn que mida latencias
            benchmark: true,           // mide ms por consulta
            pool: {
                max: 10,                 // ajusta a tu CPU/DB
                min: 2,                  // evita “cold start”
                idle: 55_000,            // < wait_timeout del server
                acquire: 20_000,         // tiempo para conseguir conexión
                evict: 10_000,           // frecuencia de limpieza del pool
            },            
            timezone: "-04:00",
            lang: "es",
            operatorsAliases: 1,
            define: {
                underscored: true,
                freezeTableName: true,
                timestamps: true,
                paranoid: true,
                createdAt: "fecha_creacion",
                updatedAt: "fecha_modificacion",
                deletedAt: "fecha_eliminacion",
            },
            retry: {
                max: 2,
                match: [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeConnectionAcquireTimeoutError/,
                /ETIMEDOUT/, /ECONNRESET/, /EPIPE/
                ],
            },
        },
    };
};
