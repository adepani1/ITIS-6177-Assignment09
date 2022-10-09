const express = require('express');
const app = express();
const port = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const sanitizer = require('express-sanitizer');
const cors = require('cors');
const axios = require('axios').default;

const options = {
    swaggerDefinition: {
        components: {},
        info: {
            title: 'Assignment 08',
            version:'1.0.0',
            description: 'Assignment 08'
        },
        host: '137.184.143.83:3000',
        basePath: '/',
    },
    apis: ['./server.js'],
};
const specs = swaggerJsdoc(options)

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit: 5,
});


app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(sanitizer());
app.use(cors());
app.use(express.json());


app.get('/agents', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        pool.getConnection()
                .then(conn => {
                        conn.query("SELECT * FROM agents")
                                .then((rows) => {
                                        res.send(rows);
                                })
                                .catch(err => {
                                        console.log(err);
                                        conn.end();
                        })
                })
                 .catch(err => {
                        console.log(err);
                });

});

/**
* @swagger
* definitions:
*   Agent:
*    type: object
*    required:
*      - id
*      - name
*      - workarea
*      - commission
*      - phone
*      - country
*    properties:
*      id:
*        type: string
*      name:
*        type: string
*      workarea:
*        type: string
*      commission:
*        type: string
*      phone:
*        type: string
*      country:
*        type: string
*/

/**
 * @swagger
 * /agents:
 *     post:
 *       summary: Creates a new agent.
 *       tags: [Agent]
 *       parameters:
 *         - in: body
 *           name: agent
 *           description: The agent to create.
 *           schema:
 *             $ref: '#/definitions/Agent'
 *       responses:
 *        200:
 *          description: The post was added
 *
 */


app.post('/agents',  (req, res) => {
        pool.getConnection()
                .then(conn => {
                        const id = req.body.id;
                        const name = req.body.name;
                        const workarea = req.body.workarea;
                        const commission = req.body.commission;
                        const phone = req.body.phone;
                        const country = req.body.country;
                        conn.query("INSERT INTO agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) VALUES (?, ?, ?, ?, ?, ?)", [id, name, workarea, commission, phone, country])
                                .then(() => {
                                         res.redirect('/agents');
                                         console.log('Added');
                                })
                                .catch(err => {
                                        console.log(err);
                                        pool.end();
                            })
                })
                .catch(err => {
                        console.log(err);
                })
});

/**
* @swagger
* definitions:
*   AgentDelete:
*    type: object
*    required:
*      - id
*    properties:
*      id:
*        type: string
*/

/**
 * @swagger
 * /agents/{id}:
 *    delete:
 *      summary: removes agent
 *      tags: [Agent]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Agent Code
 *          required: true
 *          schema:
 *            $ref: '#/definitions/AgentDelete'
 *      responses:
 *        200:
 *          description: The post was added
 *
 */

app.delete('/agents/:id', (req, res) => {
    pool.getConnection()
                .then(conn => {
                        const inputId = req.params.id;
                        conn.query("DELETE FROM agents WHERE AGENT_CODE = (?)", [inputId])
                                .then(() => {
                                        res.redirect('/agents');
                                        console.log("Deleted!");
                                })
                                .catch(err => {
                                        console.log(err)
                                        pool.end()
                                })
                })
                .catch(err => {
                        console.log(err)
                })
});


/**
* @swagger
* definitions:
*   UpdateAgent:
*    type: object
*    required:
*      - name
*      - workarea
*      - commission
*      - phone
*      name:
*        type: string
*      workarea:
*        type: string
*      commission:
*        type: string
*      phone:
*        type: string
*      country:
*        type: string
*/

/**
 * @swagger
 * /agents/{id}:
 *     put:
 *       summary: Updates existing agent or createss a new agent.
 *       tags: [Agent]
 *       parameters:
 *         - in: body
 *           name: updatagent
 *           description: The agent to update.
 *           schema:
 *             $ref: '#/definitions/UpdateAgent'
 *         - in: path
 *           name: id
 *           description: Look up agent.
 *           type: string
 *       responses:
 *        200:
 *          description: The post was updated
 *
 */

app.put('/agents/:id', (req, res) => {
        pool.getConnection()
                .then(conn => {
                        const id = req.params.id
                        const name = req.body.name;
                        const workarea = req.body.workarea;
                        const commission = req.body.commission;
                        const phone = req.body.phone;
                        const country = req.body.country;
                                .then((rows) => {
                                        res.redirect('/agents');
                                        console.log("Updated/Inserted");
                                })
                                .catch(err => {
                                        console.log(err)
                                        pool.end()
                                })
                })
                .catch(err => {
                        console.log(err)
                })

});


/**
* @swagger
* definitions:
*   PatchAgent:
*    type: object
*    properties:
*      name:
*        type: string
*      workarea:
*        type: string
*      commission:
*        type: string
*      phone:
*        type: string
*      country:
*        type: string
*/

/**
 * @swagger
 * /agents/{id}:
 *     patch:
 *       summary: Updates existing agent or createss a new agent.
 *       tags: [Agent]
 *       parameters:
 *         - in: body
 *           name: updatagent
 *           description: The agent to update.
 *           schema:
 *             $ref: '#/definitions/PatchAgent'
 *         - in: path
 *           name: id
 *       responses:
 *        200:
 *          description: The post was updated
 *
 */

app.patch('/agents/:id', (req, res) => {
        pool.getConnection()
                .then(conn => {
                        const id = req.params.id
                        const name = req.body.name;
                        const workarea = req.body.workarea;
                        const commission = req.body.commission;
                        const phone = req.body.phone;
                        const country = req.body.country;
                        const row = conn.query("SELECT * FROM agents WHERE AGENT_CODE = (?)", [id])
                                        .then(() => {
                                                console.log("Found row");
                                        })
                                        .catch(err => {
                                                console.log(err)
                                                pool.end()
                                         })
                        console.log(row);
                        if (!name) {
                                name = row.name;
                        }

                        if (!workarea) {
                                workarea = row.workarea
                        }

                        if (!commission) {
                                commission = row.commission
                        }

                        if (!phone) {
                                phone = row.phone
                        }

                        if (!country) {
                                country = row.country
                        }
                                .then(() => {
                                        res.redirect('/agents');
                                        console.log("Updated/Inserted");
                                })
                                .catch(err => {
                                        console.log(err)
                                        pool.end()
                                })
                })
                .catch(err => {

});

app.get('/companies', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        pool.getConnection()
                .then(conn => {
                        conn.query("SELECT * FROM company")
                                .then((rows) => {
                                        res.send(rows);
                                })
                                .catch(err => {
                                        console.log(err)
                                        conn.end()
                                })
                })
                .catch(err => {
                        console.log(err)
                })
});

app.get('/customers', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    pool.getConnection()
                .then(conn => {
                        conn.query("SELECT * FROM customer")
                                .then((rows) => {
                                    res.send(rows);
                                })
                                .catch(err => {
                                    console.log(err)
                                    conn.end()
                                })
                 })
                .catch(err => {
                    console.log(err);
                })
});

const tokenStr = 'NjYzNmFhMzgtY2U1Ny00YTZmLWIzMjEtODJhN2ExZTZiZDY3OmdNWEgyTDc0Wkp3dXhwNlJ1S0tKY3BpMW9OakVzeTlYQ0dWSVRpYUc4OGFoeDVmTXY5YmxmT3dVQVZkVUFSSWQ="'
app.get('/say', (req, res) => {
                const keyword = req.query.keyword;
                console.log(keyword);
                axios.get(`https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-b20e4c0f-08f8-400c-8b44-84e2e733b6e3/default/greetings?keyword=${keyword}` , { headers: {"Authorization" : `Bearer ${tokenStr}`}})
                .then(function(response) {
                        res.send(response.data);
                        console.log("Done");
                })
                .catch(err => {
                        console.log("Didn't work");
                })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
