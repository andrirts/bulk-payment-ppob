const NodeCache = require('node-cache');

class NodeCacheService {
    constructor() {
        this.cache = new NodeCache({
            stdTTL: 1800,
            checkperiod: 300
        });
    }
    static getInstance() {
        if (!NodeCacheService.instance) {
            NodeCacheService.instance = new NodeCacheService();
        }
        return NodeCacheService.instance;
    }

    static set(key, value) {
        NodeCacheService.getInstance().cache.set(key, value);
    }

    static get(key) {
        return NodeCacheService.getInstance().cache.get(key);
    }

    static del(key) {
        NodeCacheService.getInstance().cache.del(key);
    }

    static keys() {
        return NodeCacheService.getInstance().cache.keys();
    }
}

module.exports = NodeCacheService.getInstance().cache