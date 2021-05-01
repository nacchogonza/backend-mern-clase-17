import express from 'express';
import { routerApi, productos } from './RouterApi.js';
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use('/api', routerApi);

app.use('/', express.static('public'))

io.on('connection', socket => {
  console.log('Nuevo cliente conectado!')

  socket.emit('productos', productos.getProductos())

  socket.on('new-product', product => {
    productos.postProducto(product);
    io.sockets.emit('productos', productos.getProductos())
  })
})

/* app.get('/productos/vista', (req, res) => {
  const data = productos.getProductos();
  res.render("pages/listProducts", {
    products: data
  });
})

app.get('/productos/agregar', (req, res) => {
  res.render("pages/addProduct");
}) */

app.get('/', (req, res) => {
  const data = productos.getProductos();
  res.render("pages/products", {
    products: data
  })
})

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`)
})

server.on("error", error => console.log(`error en el servidor: ${error.message}`))