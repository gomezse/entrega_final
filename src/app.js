//express
import express from "express";
import {__dirname} from "./utils/utils.js"
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import session from "express-session";
//router
import productsRouter from './routing/products.router.js';
import cartsRouter from './routing/carts.router.js';
import sessionsRouter from './routing/sessions.router.js';
import viewsRouter from './routing/views.router.js';
import usersRouter from './routing/users.router.js';
import ticketsRouter from './routing/tickets.router.js';
import messagesRouter from './routing/messages.router.js';
//managers
import { messagesManager } from "./dao/models/mongoose/MessagesManager.js";
import { productsManager } from "./dao/models/mongoose/ProductsManager.js";
//DB
import "./utils/configDB.js";
import MongoStore from "connect-mongo";
//cookie
import cookieParser from "cookie-parser";
//passport
import passport from "passport";
import "./utils/passport.js";

import config from "./utils/config.js";
import cors from "cors"
import { errorMiddleware } from "./middlewares/errors.middleware.js";

import { swaggerSetup } from "./utils/swagger.js";
import swaggerUi from "swagger-ui-express";



//configuracion del servidor
const app = express();

app.use(
  session({
     store: new MongoStore({
      mongoUrl:config.mongoUrl,
    }),
    secret: "secretSession",
    cookie: { maxAge: 90000 },
  })
);



// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(passport.initialize());

// handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "views");
app.set("view engine", "handlebars");

// routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions",sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/messages",messagesRouter);
app.use("/", viewsRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

app.use(errorMiddleware);

const httpServer= app.listen(config.port, () => {
    console.log(`Escuchando al puerto ${config.port}`);
});


// Crear un servidor de sockets (Socket.io) y asociarlo al servidor HTTP
const socketServer = new Server(httpServer);


// Gestionar eventos de conexión de clientes
socketServer.on("connection", async (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  const productsList = await productsManager.findAll();  
  socketServer.emit("listProducts", productsList);

  socket.on("message", async (infoMessage) => {
    
    await messagesManager.createOne(infoMessage);
    const messages = await messagesManager.getMessages();
    socketServer.emit("chat", messages);
  });

  socket.on("newUser", (user) => {
    socket.broadcast.emit("userConnected", user);
    socket.emit("connected");
  });
  
});



