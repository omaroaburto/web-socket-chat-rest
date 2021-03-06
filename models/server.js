const express =  require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config");
const { createServer} = require("http");
const { socketController } = require("../sockets/socketController");

class Server{
    constructor(){
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = require("socket.io")(this.server); 

        //path rutas
        this.paths = {
            authPath:'/api/auth',
            categoryPath: '/api/category',
            productPath: '/api/product',
            searchPath:'/api/search',
            uploadsPath:'/api/uploads',
            userPath: '/api/usuario' 
        } 
        
        //Middlewares
        this.middlewares();
        //rutas
        this.routes();
        //conexión de base de datos
        this.conectarDB();
        //sockets
        this.sockets();
    }

    middlewares(){
        //cors
        this.app.use(cors());
        //Lectura y parseo del body
        this.app.use(express.json());
        //directorio público
        this.app.use(express.static('public'));
        //file upload - cargar archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    //método de controla las rutas
    routes(){
        this.app.use(this.paths.authPath, require('../routes/auth'));
        this.app.use(this.paths.categoryPath, require('../routes/category'));
        this.app.use(this.paths.productPath, require('../routes/product'));
        this.app.use(this.paths.searchPath, require('../routes/search'));
        this.app.use(this.paths.uploadsPath, require('../routes/uploads'));
        this.app.use(this.paths.userPath, require('../routes/usuarios'));
    }

    sockets(){
        this.io.on('connection', (socket)=> socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.port,()=>{
            console.log("La aplicación está corriendo por el puerto ",this.port);
        })
    }

    async conectarDB(){
        await dbConnection();
    }

}

module.exports = Server;