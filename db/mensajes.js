import knexFun from 'knex';

class MensajesDB {
  constructor(config){

    this.knex = knexFun(config);
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('mensajes')
    .then(() => {
      return this.knex.schema.createTable('mensajes', table => {
        table.increments('id').primary();
        table.string('author', 50).notNullable();
        table.string('date', 50).notNullable();
        table.string('text', 200).notNullable();
      })
    })
  }

  insertarMensaje(mensaje) {
    return this.knex('mensajes').insert(mensaje);
  }

  listarMensajes() {
    return this.knex('mensajes').select();
  }

  cerrar() {
    return this.knex.destroy()
  }

}

export default MensajesDB;