const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const EXPECTED_HOST = "database";
const EXPECTED_DATABASE = "pagador_local";

async function main() {
    if (process.env.DB_HOST !== EXPECTED_HOST || process.env.DB_NAME !== EXPECTED_DATABASE) {
        throw new Error("Bloqueado: este script solo puede ejecutarse contra la base Docker local.");
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    try {
        // El seeder de roles define la columna `tipo` como el identificador
        // logico del rol ("superadministrador"); `nombre` es solo la etiqueta
        // visible ("Super Administrador"). El backend resuelve permisos por
        // `role.tipo`, asi que aqui se busca por esa misma columna.
        const [roles] = await connection.execute(
            "SELECT id FROM role WHERE tipo = ? LIMIT 1",
            ["superadministrador"],
        );

        if (!roles.length) {
            throw new Error("No existe el rol superadministrador en la base local.");
        }

        const passwordHash = await bcrypt.hash("local-demo-only", 10);
        const now = new Date();

        await connection.execute(
            `INSERT INTO usuario (
                id, username, password, fullname, nombre, primer_apellido,
                segundo_apellido, ci, email, direccion, celular, genero,
                is_jefe, activo, estado, avatar, devices, fid_role,
                fecha_creacion, fecha_modificacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                password = VALUES(password),
                fid_role = VALUES(fid_role),
                activo = VALUES(activo),
                estado = VALUES(estado),
                fecha_modificacion = VALUES(fecha_modificacion)`,
            [
                "00000000-0000-0000-0000-00000000d001",
                // En este backend el login "por email" (UsuarioService.findByEmail)
                // compara contra la columna `username`. Por eso el username de la
                // cuenta ficticia debe ser la propia direccion local@demo.invalid.
                "local@demo.invalid",
                passwordHash,
                "Usuario Local de Demostracion",
                "Usuario Local",
                "Demo",
                "",
                "LOCAL-DEMO",
                "local@demo.invalid",
                "Solo entorno local",
                "",
                "NINGUNO",
                true,
                true,
                "ACTIVO",
                "",
                "[]",
                roles[0].id,
                now,
                now,
            ],
        );

        console.log("Cuenta ficticia local creada correctamente.");
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
