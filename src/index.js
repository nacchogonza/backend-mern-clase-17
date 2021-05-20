import express from 'express';
import { routerApi, productos } from './RouterApi.js';
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import MensajesDB from '../db/mensajes';

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const messages = new MensajesDB({
  client: 'sqlite3',
  connection: {
    filename: "./db/mydb.sqlite",
  },
  useNullAsDefault: true
})

messages.crearTabla().then(() => {
  console.log('tabla mensajes creada')
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use('/api', routerApi);

app.use('/', express.static('public'))

io.on('connection', socket => {
  console.log('Nuevo cliente conectado!')

  socket.emit('productos', productos.listarProductos().then((listado) => { 
    return JSON.parse(JSON.stringify(listado))
  }))

  socket.emit('messages', messages.listarMensajes().then((listado) => { 
    return JSON.parse(JSON.stringify(listado)) 
  }))

  socket.on('new-product', product => {
    productos.insertarProducto(product).then(() => { 
      productos.listarProductos().then((listado) => {
        io.sockets.emit('productos', JSON.parse(JSON.stringify(listado)))
      })
    });
  })

  socket.on('new-message', data => {
      messages.insertarMensaje(data).then((dataResp) => {
        messages.listarMensajes().then((listado) => {
          io.sockets.emit('messages', JSON.parse(JSON.stringify(listado)))
        })
      })
  })
})

app.get('/', (req, res) => {
  const data = productos.listarProductos().then((data) => {
    return JSON.parse(JSON.stringify(data))
  })
  res.render("pages/products", {
    products: data
  })
})

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`)
})

server.on("error", error => console.log(`error en el servidor: ${error.message}`))