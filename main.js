const http = require("http");
const { App } = require("./api/routes");

const host = 'localhost';
const port = 8001;

const app = new App();
app.get("/hello", hello);
app.post("/bye", bye);
app.get("/hello/:id/:name/all", hello);

function main() {
    const requestListener = async function (req, res) {
        await bodyParser(req);
        
        const uri = req.url;
        const method = req.method.toLowerCase();
        app.exec(uri, method, res, req.body);
    };

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

async function bodyParser(req) {
    let data = '';

    try {
        for await (const chunk of req) {
            data += chunk;
        }
        if (!data) {
            return;
        }
        data = JSON.parse(data);
        req.body = data;
    } catch (error) {
        console.error("Failed to parse body:", error);
    }
}


function hello(params) {
    return `Hello ${params.name}, you are the #${params.id}`;
}

function bye(data) {
    return `Goodbye, ${data.data}`;
}

main();
