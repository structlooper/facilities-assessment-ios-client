import UUID from '../utility/UUID';
import _ from 'lodash';

class FacilityAssessment {
    static schema = {
        name: 'FacilityAssessment',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            facility: 'string',
            assessmentTool: 'string',
            assessmentType: 'string',
            startDate: {type: 'date', default: new Date()},
            endDate: {type: 'date', optional: true},
            dateUpdated: {type: 'date', default: new Date()}
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        obj.dateUpdated = new Date();
        return obj;
    }
}


export default FacilityAssessment;