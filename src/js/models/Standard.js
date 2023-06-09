import _ from 'lodash';
import MeasurableElements from './MeasurableElement';
import MeasurableElement from './MeasurableElement';
import ResourceUtil from "../utility/ResourceUtil";
import General from "../utility/General";
import BaseEntity from "./BaseEntity";
import EntityMetaData from "./entityMetaData/EntityMetaData";

const standardReference = new RegExp("([A-Z]{1})([0-9]{1,3})");

class Standard {
    static schema = {
        name: 'Standard',
        primaryKey: 'uuid',
        properties: {
            name: 'string',
            uuid: 'string',
            shortName: {type: 'string', optional: true},
            reference: 'string',
            measurableElements: {type: 'list', objectType: 'MeasurableElement'}
        }
    };

    static fromDB(realmObj) {
        realmObj = _.assignIn({}, realmObj);
        realmObj.measurableElements = realmObj.measurableElements.map(MeasurableElements.fromDB);
        return realmObj;
    }

    static getDisplayName(standard) {
        return _.isEmpty(standard.shortName) ? standard.name : standard.shortName;
    }

    static associateChild(childEntity, childEntityClass, childResource, entityService) {
        const schemaName = EntityMetaData.getSchemaName(childEntityClass);
        let standard = entityService.findByUUID(childResource["standardUUID"], Standard.schema.name);
        if (schemaName === MeasurableElement.schema.name) {
            standard = General.pick(standard, ["uuid"], ["measurableElements"]);
            BaseEntity.addOrUpdateChild(standard.measurableElements, childEntity);
        }
        return standard;
    }

    static sortOrder(reference) {
        return parseInt(reference.match(standardReference)[2]);
    }
}

export default Standard;
