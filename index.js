const express = require('express');
const { generate } = require('@365dots/svg');
const camelCase = require('lodash.camelcase');

const app = express();
const cache = {};

app.get('/', (req, res) => {
    let image = cache[req.path];
    if (!image) {
        const qs = req.query;
        const options = {};
        Object.keys(qs).forEach(key => {
            options[camelCase(key)] = qs[key];
        });
        image = generate(options);
        cache[req.path] = image;
    }

    res.header('cache-control', 'max-age=43200');
    res.type('image/svg+xml');
    res.send(image);

});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}`));

