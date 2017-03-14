import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';

@Service("cacheService")
class CacheService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.cache = {};
    }

    init() {
    }

    put(key, item) {
        this.cache[key] = item;
    }

    get(key) {
        return this.cache[key];
    }
}

export default CacheService;