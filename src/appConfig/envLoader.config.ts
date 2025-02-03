export const envLoader = () => ({
        jwt_secret: process.env.JWT_SECRET,
        environment: process.env.NODE_ENV,
        port: +process.env.PORT,
        hostApi: process.env.HOST_API,
        database: {
            uri: process.env.DATABASE_URI,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD
        },
        pagination: {
            defaultLimit: +process.env.PAGINATIOS_DEFAULT_LIMIT || 7 
            // Si quiero puedo poner un valor por defecto aca pero va a tener mas fuerza el que configure en el Joi. Obviamente si el valor no viene defenido en la variable de entorno.
        }
})