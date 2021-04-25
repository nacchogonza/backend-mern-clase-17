import express from 'express';
import handlebars from 'express-handlebars';
import { routerApi, productos } from './RouterApi.js';

const app = express();

app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultLayout: "layout.hbs",
    layoutsDir: "./views",
    partialsDir: "./views/partials",
  })
);

app.set("views", "./views");
app.set("view engine", "hbs");

app.use('/api', routerApi);

app.get('/productos/vista', (req, res) => {
  const data = productos.getProductos();
  res.render("listProducts", {
    products: data
  });
})

app.get('/productos/agregar', (req, res) => {
  res.render("addProduct");
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('public'))

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`)
})

server.on("error", error => console.log(`error en el servidor: ${error.message}`))