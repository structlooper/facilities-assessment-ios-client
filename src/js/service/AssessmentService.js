import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import CheckpointScore from "../models/CheckpointScore";
import ChecklistService from "./ChecklistService";
import ChecklistProgress from "../models/ChecklistProgress";
import AreaOfConcernProgress from "../models/AreaOfConcernProgress";
import StandardProgress from "../models/StandardProgress";
import Logger from "../framework/Logger";

// Use when user is doing assessment
@Service("assessmentService")
class AssessmentService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.saveAreaOfConcernProgress = this.save(AreaOfConcernProgress, AreaOfConcernProgress.toDB);
        this.saveStandardProgress = this.save(StandardProgress, StandardProgress.toDB);
        this.saveCheckpoint = this.save(CheckpointScore, CheckpointScore.toDB);
        this.saveChecklistProgress = this.save(ChecklistProgress, ChecklistProgress.toDB);
        this.getChecklistProgress = this.getChecklistProgress.bind(this);
    }

    saveCheckpointScore(checkpoint) {
        return _.assignIn({}, this.saveCheckpoint(checkpoint));
    }

    getCheckpointScore(checkpoint, standard, areaOfConcern, checklist, facilityAssessment) {
        return _.assignIn({}, this.db.objects(CheckpointScore.schema.name)
            .filtered('checkpoint = $0 AND standard = $1 AND areaOfConcern = $2 ' +
                'AND checklist =$3 AND facilityAssessment = $4',
                checkpoint.uuid, standard.uuid, areaOfConcern.uuid, checklist.uuid, facilityAssessment.uuid)[0]);
    }

    existingStandardProgress(standard, areaOfConcern, checklist, facilityAssessment) {
        return _.assignIn({}, this.db.objects(StandardProgress.schema.name)
            .filtered('checklist = $0 AND areaOfConcern= $1 AND facilityAssessment = $2 AND standard = $3',
                checklist.uuid, areaOfConcern.uuid, facilityAssessment.uuid, standard.uuid)[0]);
    }

    getStandardProgress(standard, areaOfConcern, checklist, facilityAssessment) {
        let standardProgress = this.existingStandardProgress(standard, areaOfConcern, checklist, facilityAssessment);
        return {progress: {total: standardProgress.total, completed: standardProgress.completed}};
    }

    updateStandardProgress(standard, areaOfConcern, checklist, facilityAssessment, state) {
        let existingProgress = this.existingStandardProgress(standard, areaOfConcern, checklist, facilityAssessment);
        const totalCheckpoints = () => _.flatten(standard.measurableElements.map((me) => me.checkpoints)).length;
        let updatedProgress = _.assignIn({}, existingProgress, {
            total: _.isNumber(existingProgress.total) ? existingProgress.total : totalCheckpoints(),
            completed: _.isNumber(existingProgress.completed) ? existingProgress.completed + 1 : 1,
            areaOfConcern: areaOfConcern.uuid,
            checklist: checklist.uuid,
            facilityAssessment: facilityAssessment.uuid,
            standard: standard.uuid,
        });
        return _.assignIn({}, this.saveStandardProgress(updatedProgress));
    }

    reduceStandardProgress(standard, areaOfConcern, checklist, facilityAssessment) {
        let existingProgress = this.existingStandardProgress(standard, areaOfConcern, checklist, facilityAssessment);
        const totalCheckpoints = () => _.flatten(standard.measurableElements.map((me) => me.checkpoints)).length;
        let updatedProgress = _.assignIn({}, existingProgress, {
            total: _.isNumber(existingProgress.total) ? existingProgress.total : totalCheckpoints(),
            completed: _.isNumber(existingProgress.completed) ? existingProgress.completed - 1 : 0,
            areaOfConcern: areaOfConcern.uuid,
            checklist: checklist.uuid,
            facilityAssessment: facilityAssessment.uuid,
            standard: standard.uuid,
        });
        return _.assignIn({}, this.saveStandardProgress(updatedProgress));
    }

    getCompletedStandards(areaOfConcern, checklist, facilityAssessment) {
        return areaOfConcern.standards.filter((standard) => {
            const standardProgress = this.getStandardProgress(standard, areaOfConcern, checklist, facilityAssessment);
            return _.isNumber(standardProgress.progress.completed) && standardProgress.progress.completed === standardProgress.progress.total;
        }).length;
    }

    getCompletedAreasOfConcern(checklist, facilityAssessment) {
        return checklist.areasOfConcern.filter((areaOfConcern) => {
            const areaOfConcernProgress = this.getAreaOfConcernProgress(areaOfConcern, checklist, facilityAssessment);
            return _.isNumber(areaOfConcernProgress.progress.completed) &&
                areaOfConcernProgress.progress.completed === areaOfConcernProgress.progress.total;
        }).length;
    }

    getAreaOfConcernProgress(areaOfConcern, checklist, facilityAssessment) {
        let aocProgress = this.existingAOCProgress(areaOfConcern, checklist, facilityAssessment);
        return {progress: {total: aocProgress.total, completed: aocProgress.completed}};
    }

    updateAreaOfConcernProgress(areaOfConcern, checklist, facilityAssessment) {
        let updatedProgress = this.updatedAreaOfConcernProgress(areaOfConcern, checklist, facilityAssessment);
        return _.assignIn({}, this.saveAreaOfConcernProgress(updatedProgress));
    }

    existingAOCProgress(areaOfConcern, checklist, facilityAssessment) {
        return _.assignIn({}, this.db.objects(AreaOfConcernProgress.schema.name)
            .filtered('checklist = $0 AND areaOfConcern= $1 AND facilityAssessment = $2',
                checklist.uuid, areaOfConcern.uuid, facilityAssessment.uuid)[0]);
    }

    updatedAreaOfConcernProgress(areaOfConcern, checklist, facilityAssessment) {
        let existingProgress = this.existingAOCProgress(areaOfConcern, checklist, facilityAssessment);
        const completed = this.getCompletedStandards(areaOfConcern, checklist, facilityAssessment);
        return _.assignIn({}, existingProgress, {
            total: areaOfConcern.standards.length,
            completed: completed,
            areaOfConcern: areaOfConcern.uuid,
            checklist: checklist.uuid,
            facilityAssessment: facilityAssessment.uuid,
        });
    }

    getChecklistProgress(checklist, facilityAssessment) {
        let checklistProgress = _.assignIn({}, this.db.objects(ChecklistProgress.schema.name)
            .filtered('checklist = $0 AND facilityAssessment = $1', checklist.uuid, facilityAssessment.uuid)[0]);
        return {progress: {total: checklistProgress.total, completed: checklistProgress.completed}};
    }

    existingChecklistProgress(checklist, facilityAssessment) {
        return _.assignIn({}, this.db.objects(ChecklistProgress.schema.name)
            .filtered('checklist = $0 AND facilityAssessment = $1',
                checklist.uuid, facilityAssessment.uuid)[0]);
    }

    updateChecklistProgress(checklist, facilityAssessment) {
        let fullChecklist = this.getService(ChecklistService).getChecklist(checklist.uuid, facilityAssessment.selectedThemes);
        const existingProgress = this.existingChecklistProgress(fullChecklist, facilityAssessment);
        const completed = this.getCompletedAreasOfConcern(fullChecklist, facilityAssessment);
        return _.assignIn({}, this.saveChecklistProgress(_.assignIn({}, existingProgress,
            {
                total: checklist.areasOfConcern.length,
                completed: completed,
                checklist: checklist.uuid,
                facilityAssessment: facilityAssessment.uuid,
            })));
    }
}

export default AssessmentService;
