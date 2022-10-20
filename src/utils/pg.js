const { Pool } = require('pg')


const pool = new Pool({
    // host: 'localhost',
    // port: 5432,
    // database: 'masanov',
    // user: 'postgres',
    // password: 'masanov3167'
    connectionString: 'postgres://kwwcipkz:zQRDcELogIk9M3WCrLQz9HJTVHnOqoBo@heffalump.db.elephantsql.com/kwwcipkz'
})

  class PostgreSql{
    async sqlData (SQL, ...params){
        const client = await pool.connect()
        try {
            const { rows } = await client.query(SQL, params.length ? params : null)
            return rows
        } finally {
            client.release()
        }
    }
  }

  module.exports = new PostgreSql;