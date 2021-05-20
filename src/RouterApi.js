import express from 'express';
import ProductosDB from '../db/productos';

const productos = new ProductosDB({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'products'
  }
});

productos.crearTabla().then(() => {
  console.log('tabla productos (MariaDB) creada')
});

const routerApi = express.Router();
routerApi.use(express.json())
routerApi.use(express.urlencoded({extended: true}));

routerApi.get('/productos', (req, res) => {
  const data = productos.listarProductos().then((data) => {
    console.log('console /productps', data);
    return data
  })
  if (!data.length) {
    res.json({error: 'no hay productos cargados'})
  }
  res.json(data);
})

routerApi.post('/productos', (req, res) => {
  const data = req.body;
  data.price = parseFloat(data.price);
  const newProduct = productos.insertarProducto({
    title: data.title,
    price: data.price,
    thumbnail: data.thumbnail,
  }).then(() => { console.log(newProduct) })
  // res.json(newProduct);
})

/* routerApi.get('/productos/:id', (req, res) => {
  const filterProduct = productos.getProducto(req.params.id);
  if (!filterProduct) res.json({error: 'producto no encontrado'})
  res.json(filterProduct);
})

routerApi.put('/productos/:id', (req, res) => {
  const updateProduct = productos.putProducto(req.body, req.params.id);
  if (!updateProduct) res.json({error: 'producto no encontrado'})
  res.json(updateProduct);
})

routerApi.delete('/productos/:id', (req, res) => {
  const deleteProduct = productos.deleteProducto(req.params.id);
  if (!deleteProduct) res.json({error: 'producto no encontrado'})
  res.json(deleteProduct);
}) */

export { routerApi, productos };