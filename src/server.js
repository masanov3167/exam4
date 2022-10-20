const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const app = express();
const http = require('http');
const PORT = process.env.PORT || 9000;
const modules = require('./modules');
const routes = require('./routes/routes');
const cors = require('cors')
const path = require('path')

const server =  new ApolloServer({
    modules,
    context:({req}) =>{
        return req.body;
    }
})
app.use(cors())
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


server.applyMiddleware({app});

const httpServer = http.createServer(app);

httpServer.listen(PORT, () =>{
    console.log(PORT + server.graphqlPath);
})