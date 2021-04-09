"use strict";

const NodeCache = require("node-cache");

const cache = new NodeCache();

module.exports = (duration) => {
    return function cacheRoute(req, res, next) {
        if (req.method !== "GET") {
            console.error("Cannot cache from any non-GET HTTP methods.");
    
            return next();
        }
    
        const key = req.originalUrl;
        const cachedResponse = cache.get(key);
    
        if (cachedResponse) {
            // Cache hit
            res.send(cachedResponse);
        } else {
            // Cache miss
            res.originalSend = res.send;
            res.send = (body) => {
                res.originalSend(body);
    
                cache.set(key, body, duration);
            }
    
            next();
        }
    }
};