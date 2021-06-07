import FacilityAssessment from "../models/FacilityAssessment";
import Logger from "../framework/Logger";
import FacilityAssessmentService from "../service/FacilityAssessmentService";
import AssessmentSyncService from "../service/AssessmentSyncService";
import AssessmentMetaDataService from "../service/metadata/AssessmentMetaDataService";
import _ from 'lodash';
import AssessmentMetaData from "../models/assessment/AssessmentMetaData";
import EntityService from "../service/EntityService";
import AuthService from "../service/AuthService";

const _areSubmissionDetailsAvailable = function (assessment, beans) {
    let assessmentMetaDataService = beans.get(AssessmentMetaDataService);
    let assessmentMetaDataList = assessmentMetaDataService.getAll();
    return _.reduce(assessmentMetaDataList,
        (available, assessmentMetaData) => FacilityAssessment.fieldChecksPassed(assessmentMetaData, assessment) && available,
        FacilityAssessment.seriesNameCheckPassed(assessment.assessmentTool, assessment));
};

const startSubmitAssessment = function (state, action, beans) {
    const entityService = beans.get(EntityService);

    let assessment = FacilityAssessment.clone(action.facilityAssessment);
    let submissionDetailAvailable = _areSubmissionDetailsAvailable(assessment, beans);
    const assessmentMetaDataList = entityService.findAll(AssessmentMetaData);
    return _.assignIn(state, {
        chosenAssessment: assessment,
        submissionDetailAvailable: submissionDetailAvailable,
        assessmentToolType: assessment.assessmentTool.assessmentToolType,
        assessmentMetaDataList: assessmentMetaDataList
    });
};

const submissionCancelled = function (state, action, beans) {
    return _.assignIn(state, {chosenAssessment: undefined});
};

const syncAssessment = function (state, action, beans) {
    Logger.logInfo('openAssessments', 'syncAssessment');
    const facilityAssessmentService = beans.get(FacilityAssessmentService);
    facilityAssessmentService.saveSubmissionDetails(state.chosenAssessment);

    const assessmentSyncService = beans.get(AssessmentSyncService);
    assessmentSyncService.syncFacilityAssessment(state.chosenAssessment, action.cb, action.errorHandler);
    return state;
};

const markAssessmentUnsubmitted = function (state, action, beans) {
    if (_.isEmpty(action.facilityAssessment.endDate) && !action.facilityAssessment.submitted) return {...state};
    const assessmentService = beans.get(FacilityAssessmentService);
    assessmentService.markUnSubmitted(action.facilityAssessment);
    const assessmentMode = action.mode;
    const openAssessments = assessmentService.getAllOpenAssessments(assessmentMode);
    const submittedAssessments = assessmentService.getAllSubmittedAssessments(assessmentMode);
    return _.assignIn(state, {openAssessments: openAssessments, submittedAssessments: submittedAssessments});
};

const _updateSubmittingAssessment = function (state, updateObject, beans) {
    let newState = {chosenAssessment: _.assignIn({}, state.chosenAssessment, updateObject)};
    newState.submissionDetailAvailable = _areSubmissionDetailsAvailable(newState.chosenAssessment, beans);
    return _.assignIn({}, state, newState);
};

const enterCustomInfo = function (state, action, beans) {
    let newSubmittingAssessment = FacilityAssessment.clone(state.chosenAssessment);
    FacilityAssessment.updateCustomInfo(action.assessmentMetaData, action.valueString, newSubmittingAssessment);
    let newState = {chosenAssessment: newSubmittingAssessment};
    newState.submissionDetailAvailable = _areSubmissionDetailsAvailable(newState.chosenAssessment, beans);
    return _.assignIn({}, state, newState);
};

const enterSeries = function (state, action, beans) {
    if (isNaN(action.series)) return state;
    return _updateSubmittingAssessment(state, {seriesName: action.series}, beans);
};

const generateAssessmentSeries = function (state, action, beans) {
    return _updateSubmittingAssessment(state, {seriesName: FacilityAssessment.generateSeries()}, beans);
};

const assessmentSynced = function (state, action, beans) {
    return _.assignIn(state, {
        chosenAssessment: undefined
    });
};

const login = function (state, action, beans) {
    let newState = _.assignIn(state, {
        callingServer: true
    });
    beans.get(AuthService).login(state.email, state.password).then();
    return newState;
};

const changePassword = function (state, action, beans) {
    return state;
};

const changeLoginDetails = function (state, action, beans) {
    return _.assignIn(state, action);
};

export default new Map([
    ["SYNC_ASSESSMENT", syncAssessment],
    ["START_SUBMIT_ASSESSMENT", startSubmitAssessment],
    ["UPDATE_CHECKPOINT", markAssessmentUnsubmitted],
    ["ASSESSMENT_SYNCED", assessmentSynced],
    ["ENTER_CUSTOM_INFO", enterCustomInfo],
    ["ENTER_ASSESSMENT_SERIES", enterSeries],
    ["GENERATE_ASSESSMENT_SERIES", generateAssessmentSeries],
    ["SUBMISSION_CANCELLED", submissionCancelled],
    ["CHANGE_LOGIN_DETAILS", changeLoginDetails],
    ["LOGIN", login],
    ["CHANGE_PASSWORD", changePassword]]
);

export let submitAssessmentInit = {
    chosenAssessment: undefined,
    assessmentMetaDataList: [],
    submissionDetailAvailable: false,
    loginSessionId: null,
    email: null,
    password: null,
    callingServer: false
};