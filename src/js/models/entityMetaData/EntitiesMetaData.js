import FacilityType from "../FacilityType";
import State from "../State";
import AssessmentTool from "../AssessmentTool";
import AssessmentType from "../AssessmentType";
import AreaOfConcern from "../AreaOfConcern";
import Checkpoint from "../Checkpoint";
import Department from "../Department";
import District from "../District";
import MeasurableElement from "../MeasurableElement";
import Standard from "../Standard";
import EntityMetaData from "./EntityMetaData";
import Facility from "../Facility";
import _ from "lodash";
import ResourceUtil from "../../utility/ResourceUtil";
import Checklist from "../Checklist";
import FacilityAssessment from "../FacilityAssessment";
import CheckpointScore from "../CheckpointScore";
import moment from "moment";
import FacilityAssessmentProgressService from "../../service/FacilityAssessmentProgressService";
import IndicatorDefinition from "../IndicatorDefinition";
import Indicator from "../Indicator";
import ExcludedAssessmentToolStateService from "../../service/ExcludedAssessmentToolStateService";
import ExcludedAssessmentToolState from "../ExcludedAssessmentToolState";
import AssessmentMetaData from "../assessment/AssessmentMetaData";
import FacilityAssessmentDownloadService from "../../service/assessment/FacilityAssessmentDownloadService";
import FacilityAssessmentMapper from "../../mapper/facilityAssessmentMapper";
import CheckpointTheme from "../theme/CheckpointTheme";
import Theme from "../theme/Theme";

class EntitiesMetaData {
    //order is important. last entity with be executed first. parent and referred entity (in case of many to one) should be synced before the child.
    static get _stateSpecificReferenceEntityTypes() {
        return [
            new EntityMetaData({entityType: Facility, parentClass: District, mapper: new FacilityMapper(), syncWeight: 10}),
            new EntityMetaData({entityType: District, parentClass: State, syncWeight: 5}),
            new EntityMetaData({entityType: CheckpointTheme, syncWeight: 3}),
            new EntityMetaData({entityType: Checkpoint, mapper: new CheckpointMapper(), syncWeight: 42}),
            new EntityMetaData({entityType: MeasurableElement, parentClass: Standard, syncWeight: 20}),
            new EntityMetaData({entityType: Standard, parentClass: AreaOfConcern, syncWeight: 10}),
            new EntityMetaData({entityType: AreaOfConcern, syncWeight: 5}),
            new EntityMetaData({entityType: Checklist, mapper: new ChecklistMapper(), syncWeight: 3}),
            new EntityMetaData({entityType: ExcludedAssessmentToolState, serviceClass: ExcludedAssessmentToolStateService, syncWeight: 1}),
            new EntityMetaData({entityType: AssessmentTool, syncWeight: 2})
        ];
    }

    static get _referenceEntityTypes() {
        return [
            new EntityMetaData({entityType: Theme, syncWeight: 5}),
            new EntityMetaData({entityType: IndicatorDefinition, mapper: new IndicatorDefinitionMapper(), syncWeight: 25}),
            new EntityMetaData({entityType: Department, syncWeight: 15}),
            new EntityMetaData({entityType: AssessmentType, syncWeight: 10}),
            new EntityMetaData({entityType: State, syncWeight: 20}),
            new EntityMetaData({entityType: FacilityType, syncWeight: 15}),
            new EntityMetaData({entityType: AssessmentMetaData, syncWeight: 10})
        ];
    }

    static get _txEntityTypes() {
        return [
            new EntityMetaData({entityType: FacilityAssessmentProgress, serviceClass: FacilityAssessmentProgressService, pageSize: 2, syncWeight: 20}),
            new EntityMetaData({entityType: Indicator, mapper: new IndicatorMapper(), syncWeight: 20}),
            new EntityMetaData({entityType: CheckpointScore, mapper: new CheckpointScoreMapper(), syncWeight: 50}),
            new EntityMetaData({entityType: FacilityAssessment, mapper: new FacilityAssessmentMapper(), serviceClass: FacilityAssessmentDownloadService, syncWeight: 10})
        ];
    }

    static getStateSpecificReferenceEntityTypes(syncWeightMultiplier) {
        return this._stateSpecificReferenceEntityTypes.map((x) => {
            let clone = x.clone();
            clone.syncWeight = clone.syncWeight * syncWeightMultiplier;
            return clone;
        });
    }

    static get stateUnspecificReferenceTypes() {
        return this._referenceEntityTypes.map((x) => x.clone());
    }

    static get txEntityTypes() {
        return this._txEntityTypes.map((x) => x.clone());
    }

    static get allEntityTypes() {
        return this._txEntityTypes.concat(this._stateSpecificReferenceEntityTypes).concat(this._referenceEntityTypes).map(_.identity);
    }
}

class FacilityMapper {
    fromResource(resource) {
        resource.facilityType = ResourceUtil.getUUIDFor(resource, 'facilityTypeUUID');
        return resource;
    }
}

class CheckpointMapper {
    fromResource(resource) {
        resource.checklist = resource['checklistUUID'];
        resource.measurableElement = resource['measurableElementUUID'];
        resource.amObservation = resource['assessmentMethodObservation'];
        resource.amStaffInterview = resource['assessmentMethodStaffInterview'];
        resource.amPatientInterview = resource['assessmentMethodPatientInterview'];
        resource.amRecordReview = resource['assessmentMethodRecordReview'];
        return resource;
    }
}

class ChecklistMapper {
    fromResource(resource) {
        resource.department = resource["departmentUUID"];
        resource.assessmentTools = resource["assessmentToolUUIDs"].map((atUUID) => _.assignIn({value: atUUID}));
        resource.areasOfConcern = resource["areasOfConcernUUIDs"]
            .map((aoc) => _.assignIn({value: aoc}));
        resource.state = resource["stateUUID"];
        return resource;
    }
}

class CheckpointScoreMapper {
    fromResource(resource) {
        resource.checklist = ResourceUtil.getUUIDFor(resource, "checklistUUID");
        resource.facilityAssessment = ResourceUtil.getUUIDFor(resource, "facilityAssessmentUUID");
        resource.checkpoint = ResourceUtil.getUUIDFor(resource, "checkpointUUID");
        resource.areaOfConcern = ResourceUtil.getUUIDFor(resource, "areaOfConcernUUID");
        resource.standard = ResourceUtil.getUUIDFor(resource, "standardUUID");
        resource.submitted = true;
        resource.dateUpdated = moment(resource.lastModifiedDate).toDate();
        return resource;
    }
}

class IndicatorDefinitionMapper {
    fromResource(resource) {
        resource.assessmentTool = ResourceUtil.getUUIDFor(resource, "assessmentToolUUID");
        return resource;
    }
}

class IndicatorMapper {
    fromResource(resource) {
        resource.dateValue = resource.dateValue && moment(resource.dateValue).toDate();
        resource.indicatorDefinition = ResourceUtil.getUUIDFor(resource, "indicatorDefinitionUUID");
        resource.facilityAssessment = ResourceUtil.getUUIDFor(resource, "facilityAssessmentUUID");
        return resource;
    }
}

export class FacilityAssessmentProgress {
    static get entityName() {
        return 'FacilityAssessmentProgress';
    }
}

export default EntitiesMetaData;
