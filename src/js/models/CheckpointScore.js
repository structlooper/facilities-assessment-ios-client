import UUID from '../utility/UUID';
import _ from 'lodash';

class CheckpointScore {
    static schema = {
        name: 'CheckpointScore',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            checklist: 'string',
            facilityAssessment: 'string',
            areaOfConcern: 'string',
            standard: 'string',
            checkpoint: 'string',
            score: {type: 'int', optional: true},
            remarks: {type: 'string', optional: true},
            dateUpdated: {type: 'date', default: new Date()},
            submitted: {type: 'bool', default: false},
            na: {type: 'bool', default: false}
        }
    };

    static toDB(obj) {
        obj.uuid = _.isEmpty(obj.uuid) ? UUID.generate() : obj.uuid;
        obj.dateUpdated = new Date();
        return obj;
    }

    static create(checkpoint, standard, areaOfConcern, checklist, facilityAssessment, existingCheckpoint) {
        return _.assignIn({
            uuid: UUID.generate(),
            facilityAssessment: facilityAssessment.uuid,
            checklist: checklist.uuid,
            areaOfConcern: areaOfConcern.uuid,
            standard: standard.uuid,
            checkpoint: checkpoint,
            score: undefined,
            remarks: undefined,
            dateUpdated: undefined,
            submitted: false,
        }, existingCheckpoint, {checkpoint: checkpoint});
    }

    static getAggregateScore(checkpointScores) {
        return (_.sumBy(checkpointScores, "score") / (checkpointScores.length * 2)) * 100;
    }
}


export default CheckpointScore;
