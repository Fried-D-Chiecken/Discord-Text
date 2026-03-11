const express = require("express")
const { v4: uuidv4 } = require("uuid")

const app = express()

app.use(express.json())
app.use(express.static("public"))

let links = {}

app.post("/create", (req, res) => {
    const webhook = req.body.webhook
    const id = uuidv4()

    links[id] = webhook

    res.json({
        link: `/send.html?id=${id}`
    })
})

app.post("/send/:id", async (req, res) => {

    const webhook = links[req.params.id]
    const message = req.body.message

    if (!webhook) return res.status(404).send("Invalid link")

    await fetch(webhook, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            content: `📩 Anonymous message:\n${message}`
        })
    })

    res.send("Message sent")
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})
