import _ from 'lodash';
import ChecklistService from "../service/ChecklistService";
import AssessmentService from "../service/AssessmentService";

const allAreasOfConcern = function (state, action, beans) {
    const areasOfConcern = beans.get(ChecklistService).getAreasOfConcernsFor(action.checklist.uuid, action.facilityAssessment.selectedThemes);
    const assessmentService = beans.get(AssessmentService);
    let aocProgress = areasOfConcern.map((aoc) =>
        assessmentService.getAreaOfConcernProgress(aoc, action.checklist, action.facilityAssessment));
    return _.assignIn(state, {"areasOfConcern": _.zipWith(areasOfConcern, aocProgress, _.assignIn)});
};

const updateProgress = function (state, action, beans) {
    const assessmentService = beans.get(AssessmentService);
    let updatedProgress = assessmentService.updateAreaOfConcernProgress(action.areaOfConcern, action.checklist, action.facilityAssessment);
    const newAOCs = state.areasOfConcern.map((aoc) => aoc.uuid === action.areaOfConcern.uuid ?
        _.assignIn(aoc, {
            progress: {
                total: updatedProgress.total,
                completed: updatedProgress.completed
            }
        }) : aoc);

    return _.assignIn(state, {"areasOfConcern": newAOCs});
};

export default new Map([
    ["ALL_AREAS_OF_CONCERN", allAreasOfConcern],
    ["UPDATE_AREA_OF_CONCERN_PROGRESS", updateProgress],
    ["REDUCE_AREA_OF_CONCERN_PROGRESS", updateProgress],
]);

export let areasOfConcernInit = {
    areasOfConcern: []
};
