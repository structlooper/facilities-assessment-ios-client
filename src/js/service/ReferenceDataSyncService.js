import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import _ from "lodash";
import {post} from "../framework/http/requests";
import facilityAssessmentMapper from "../mapper/facilityAssessmentMapper";
import BatchRequest from "../framework/http/BatchRequest";
import ChecklistService from "./ChecklistService";
import checkpointScoreMapper from "../mapper/checkpointScoreMapper";
import FacilityAssessmentService from "./FacilityAssessmentService";
import SettingsService from "./SettingsService";
import EntitySyncStatusService from "./EntitySyncStatusService";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import ConventionalRestClient from "../framework/http/ConventionalRestClient";
import Logger from "../framework/Logger";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import EntityService from "./EntityService";
import moment from "moment";

@Service("referenceDataSyncService")
class ReferenceDataSyncService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
    }

    init() {
        this.entitySyncStatusService = this.getService(EntitySyncStatusService);
        this.conventionalRestClient = new ConventionalRestClient(this.getService(SettingsService));
        this.entityService = this.getService(EntityService);
        this.serverURL = this.getService(SettingsService).getServerURL();
    }

    syncMetaData(cb) {
        this.pullData(EntitiesMetaData.referenceEntityTypes, () => {
            Logger.logInfo('ReferenceDataSyncService', 'Sync completed!');
            cb();
        }, (error) => {
            Logger.logError('ReferenceDataSyncService', error);
        });
    }

    pullData(unprocessedEntityMetaData, onComplete, onError) {
        const entityMetaData = unprocessedEntityMetaData.pop();
        if (_.isNil(entityMetaData)) {
            onComplete();
            return;
        }

        Logger.logDebug('ReferenceDataSyncService', entityMetaData.entityName);
        const entitySyncStatus = this.entitySyncStatusService.get(entityMetaData.entityName);
        Logger.logInfo('ReferenceDataSyncService', `${entitySyncStatus.entityName} was last loaded up to "${entitySyncStatus.loadedSince}"`);
        this.conventionalRestClient.loadData(entityMetaData, entitySyncStatus.loadedSince, 0,
            unprocessedEntityMetaData,
            (resourcesWithSameTimeStamp, entityModel) => this.persist(resourcesWithSameTimeStamp, entityModel),
            (workingAllEntitiesMetaData) => this.pullData(workingAllEntitiesMetaData, onComplete, onError),
            [], onError);
    }

    persist(resourcesWithSameTimeStamp, entityMetaData) {
        resourcesWithSameTimeStamp.forEach((resource) => {
            // Logger.logDebug(`ReferenceDataSyncService ${entityMetaData.entityName}`, JSON.stringify(resource));
            const entity = entityMetaData.mapFromResource(resource);
            let savedEntity = this.getService(entityMetaData.serviceClass).save(entityMetaData.entityClass, entity);
            if (!_.isNil(entityMetaData.parentClass)) {
                const parentEntity = entityMetaData.parentClass.associateChild(entity, entityMetaData.entityClass, resource, this.entityService);
                this.save(entityMetaData.parentClass)(parentEntity);
            }
        });

        const currentEntitySyncStatus = this.entitySyncStatusService.get(entityMetaData.entityName);
        const entitySyncStatus = new EntitySyncStatus();
        entitySyncStatus.name = entityMetaData.entityName;
        entitySyncStatus.uuid = currentEntitySyncStatus.uuid;
        entitySyncStatus.loadedSince = moment(resourcesWithSameTimeStamp[0]["lastModifiedDate"]).toDate();
        this.entitySyncStatusService.save(EntitySyncStatus)(entitySyncStatus);
    }
}

export default ReferenceDataSyncService;