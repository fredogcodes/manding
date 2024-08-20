class App {
    constructor() {
        this.routes = [];
    }

    get(uri, callback) {
        const paramNames = [];
        const baseUrl = uri.replace(/\/:([^/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '/([^/]+)';
        });

        const regex = new RegExp(`^${baseUrl}$`);

        this.routes.push({
            baseUrl: regex,
            callback,
            method: 'get',
            paramNames
        });
    }

    post(uri, callback) {
        this.routes.push({
            baseUrl: uri,
            callback,
            method: 'post'
        });
    }

    put(uri, callback) {
        this.routes.push({
            baseUrl: uri,
            callback,
            method: 'put'
        });
    }

    delete(uri, callback) {
        const paramNames = [];
        const baseUrl = uri.replace(/\/:([^/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '/([^/]+)';
        });

        const regex = new RegExp(`^${baseUrl}$`);

        this.routes.push({
            baseUrl: regex,
            callback,
            method: 'delete',
            paramNames
        });
    }

    exec(uri, method, res, data = null) {
        for (const route of this.routes) {
            const match = uri.match(route.baseUrl);

            if (match && route.method === method) {

                const params = {};
                if (route.paramNames) {
                    route.paramNames.forEach((paramName, index) => {
                        params[paramName] = match[index + 1];
                    });
                    return res.end(route.callback(params));
                } else if (data) {
                    return res.end(route.callback(data));
                }
            }
        }
        res.end("Page not found");
    }
}

module.exports = { App };
