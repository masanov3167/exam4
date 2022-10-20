const {sqlData} = require('../../utils/pg')

const GET_QUERY = `select * from complex order by id desc`;
const DEL_QUERY = `delete from complex where id = $1`;
const GET_BY_ID_QUERY = `select * from complex where id = $1`
const GET_BY_COMPANY_ID_QUERY = `select * from company where id = $1`
const GET_BY_COMPANYID_QUERY = `select * from complex where companyid = $1 order by id desc`;
const POST_QUERY = `insert into complex(name, address, room, roomkv, roomkvsum, companyid) values($1,$2,$3,$4,$5,$6)`;
const PUT_QUERY = `update complex set name = $1, address = $2, room = $3, roomkv = $4, roomkvsum = $5, companyid = $6 where id = $7`

const GET = () => sqlData(GET_QUERY);
const GET_BY_ID = id => sqlData(GET_BY_ID_QUERY,  id-0)
const GET_BY_COMPANY_ID = id => sqlData(GET_BY_COMPANY_ID_QUERY, id-0)
const GET_BY_COMPANYID = id => sqlData(GET_BY_COMPANYID_QUERY, id -0)
const DEL = id => sqlData(DEL_QUERY, id-0);
const POST = (name, address, room, roomkv, roomkvsum, companyid) => sqlData(POST_QUERY, name, address, room, roomkv, roomkvsum, companyid )
const PUT = (name, address, room, roomkv, roomkvsum, companyid, id) => sqlData(PUT_QUERY, name, address, room, roomkv, roomkvsum, companyid, id )

module.exports = {
    GET,
    GET_BY_ID,
    DEL,
    GET_BY_COMPANY_ID,
    POST,
    PUT,
    GET_BY_COMPANYID
}