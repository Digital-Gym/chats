const express = require('express')
const cors = require('cors')
const events = require('events')

const PORT = 6969
const app = express()
const emitter = new events.EventEmitter()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.get('/messages', (req, res)=>{
    emitter.once('newMsg', (msg) => {
        console.log("SENDING TO CLIENT", msg.id)
        res.json(msg)
    })
})

app.post('/message', (req, res) => {
    console.log("GOT MSG FROM CLIENT!", req.body)
    const userMsg = req.body
    emitter.emit('newMsg', userMsg)
    res.status(200)
})

app.listen(PORT, () => console.log(`Polling started on port ${PORT}`))