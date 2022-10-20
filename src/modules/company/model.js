const {sqlData} = require('../../utils/pg')

const GET_QUERY = `select * from company order by id desc`;
const DEL_QUERY = `delete from company where id = $1`;
const GET_BY_ID_QUERY = `select * from company where id = $1`

const GET = () => sqlData(GET_QUERY);
const GET_BY_ID = id => sqlData(GET_BY_ID_QUERY, id-0)
const DEL = id => sqlData(DEL_QUERY, id-0);

module.exports = {
    GET,
    GET_BY_ID,
    DEL
}