import express from 'express'
import BrowserWrapper from './browser'

const port = 50690

const browser = new BrowserWrapper()
await browser.init()

express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

    .all('/ss', async (req, res) => {
        let { url, selector, transparent } = req.method === 'POST' ? req.body : req.query

        url = url.replace(/127.0.0.1|localhost|0.0.0.0/g, 'host.docker.internal')

        try {
            const screenshot = await browser.ss(url, selector, transparent)
            res.contentType('png').end(screenshot)
        } catch (error) {
            res.status(500).end(`${error}`)
        }
    })

    .all('*', async (req, res) => {
        res.end('wpss - shiro interactive')
    })
    .listen(port, () => console.log(`wpss: listening on ${port}`))