const {sqlData} = require('../../utils/pg')

const GET_QUERY = `select * from bank order by id desc`;
const DEL_QUERY = `delete from bank where id = $1`;
const GET_BY_ID_QUERY = `select * from bank where id = $1`
const POST_QUERY = `insert into bank(name, address, mortgage) values($1,$2,$3)`;
const PUT_QUERY = `update bank set name = $1, address = $2, mortgage = $3 where id = $4`

const GET = () => sqlData(GET_QUERY);
const GET_BY_ID = id => sqlData(GET_BY_ID_QUERY,  id-0)
const DEL = id => sqlData(DEL_QUERY, id-0);
const POST = (name, address, mortgage) => sqlData(POST_QUERY, name, address, mortgage )
const PUT = (name, address, mortgage, id) => sqlData(PUT_QUERY, name, address, mortgage, id )

module.exports = {
    GET,
    GET_BY_ID,
    DEL,
    POST,
    PUT
}