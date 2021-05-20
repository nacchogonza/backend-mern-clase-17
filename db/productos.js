import knexFun from 'knex';

class ProductosDB {
  constructor(config){

    this.knex = knexFun(config);
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('productos')
    .then(() => {
      return this.knex.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.string('title', 50).notNullable();
        table.float('price');
        table.string('thumbnail', 150).notNullable();
      })
    })
  }

  insertarProducto(producto) {
    return this.knex('productos').insert(producto);
  }

  listarProductos() {
    return this.knex('productos').select();
  }

  listarProductoPorId(id) {
    return this.knex('productos').where('id', id).select();
  }

  actualizarProductoPorId(newProduct, id) {
    return this.knex('productos').where('id', id).update({ title: newProduct.title, price: newProduct.price, thumbnail: newProduct.thumbnail });
  }

  borrarProductoPorId(id) {
    return this.knex('productos').where('id', id).del()
  }

  cerrar() {
    return this.knex.destroy()
  }

}

export default ProductosDB;