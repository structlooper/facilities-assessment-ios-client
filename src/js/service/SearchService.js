import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from 'lodash';
import Checkpoint from "../models/Checkpoint";
import ChecklistService from "./ChecklistService";

@Service("searchService")
class SearchService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        this.checklistService = this.getService(ChecklistService)
    }

    backfillCheckpoint(checkpoint) {
        const measurableElement = {...this.checklistService.getMeasurableElement(checkpoint.measurableElement)};
        const standard = {
            ...this.checklistService
                .getStandardForMeasurableElement(checkpoint.checklist, measurableElement.uuid, [])
        };
        const aoc = {...this.checklistService.getAreaConcernForStandard(checkpoint.checklist, standard.uuid, [])};
        const checklist = {...this.checklistService.getChecklist(checkpoint.checklist, [])};
        return {
            ...checkpoint,
            measurableElement: measurableElement,
            standard: standard,
            areaOfConcern: aoc,
            checklist: checklist
        };
    }

    search(assessmentTool, state, searchText, limit = 20) {
        if (_.isEmpty(searchText)) return [];
        const checklistUUIDs = this.checklistService.getChecklistsFor(assessmentTool, state).map(this.onlyId);
        let checklistCriteria = checklistUUIDs.map((uuid) => `checklist = '${uuid}'`).join(' OR ');
        return this.db.objects(Checkpoint.schema.name)
            .filtered(checklistCriteria)
            .filtered(`name CONTAINS[c] $0 and inactive = false`, searchText, state.uuid)
            .slice(0, limit)
            .map(this.pickKeys(["reference", "measurableElement", "checklist"]))
            .map(this.backfillCheckpoint.bind(this));

    }
}

export default SearchService;
