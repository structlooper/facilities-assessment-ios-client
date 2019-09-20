import ChecklistService from "../service/ChecklistService";
import StateService from "../service/StateService";
import SeedProgressService from "../service/SeedProgressService";
import ReferenceDataSyncService from "../service/ReferenceDataSyncService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";

const modeSelection = function (state, action, beans) {
    const assessmentModes = beans.get(ChecklistService).assessmentModes;
    let seedProgress = beans.get(SeedProgressService).getSeedProgress();
    let newState = clone(state);
    newState.modes = assessmentModes;
    newState.statesAvailableToBeLoaded = seedProgress.numberOfStates < beans.get(StateService).getAllStates().length;
    return newState
};

const clone = function (state) {
    return {modes: state.modes, statesAvailableToBeLoaded: state.statesAvailableToBeLoaded, downloading: state.downloading};
};

const downloadReferenceData = function (state, action, beans) {
    let newState = clone(state);
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    const seedProgressService = beans.get(SeedProgressService);
    const stateService = beans.get(StateService);
    let seedProgress = seedProgressService.getSeedProgress();
    referenceDataSyncService.syncMetaDataNotSpecificToState(() => {
        let states = seedProgress.loadedStates.map((loadedCountryStateStringObj) => stateService.getStateName(loadedCountryStateStringObj.value));
        referenceDataSyncService.syncStateSpecificMetaDataInStateMode(states, EntitiesMetaData.stateSpecificReferenceEntityTypes, action.cb, action.onError);
    }, action.onError);
    newState.downloading = true;
    return newState;
};

const downloadMyAssessments = function (state, action, beans) {
    const referenceDataSyncService = beans.get(ReferenceDataSyncService);
    referenceDataSyncService.syncMyTxData(action.cb, action.onError);
    let newState = clone(state);
    newState.downloading = true;
    return newState;
};

const downloadCompleted = function (state, action, beans) {
    let newState = clone(state);
    newState.downloading = false;
    return newState;
};

export default new Map([
    ["MODE_SELECTION", modeSelection],
    ["DOWNLOAD_REFERENCE_DATA", downloadReferenceData],
    ["DOWNLOAD_COMPLETED", downloadCompleted],
    ["DOWNLOAD_MY_ASSESSMENTS", downloadMyAssessments]
]);

export let modeSelectionInit = {
    modes: [],
    statesAvailableToBeLoaded: undefined,
    downloading: false
};