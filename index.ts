import express from 'express'

const port = 50690

express()
    .get('*', async (req, res) => {
        res.end('wpss - shiro interactive')
    })
    .listen(port, () => console.log(`wpss: listening on ${port}`))