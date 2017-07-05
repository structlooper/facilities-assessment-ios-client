import BaseService from "./BaseService";
import Service from "../framework/bean/Service";
import StateService from "./StateService";
import EntitiesMetaData from "../models/entityMetaData/EntitiesMetaData";
import Logger from "../framework/Logger";
import EntitySyncStatus from "../models/sync/EntitySyncStatus";
import EntityMetaData from "../models/entityMetaData/EntityMetaData";
import EntitySyncStatusService from "./EntitySyncStatusService";
import ReferenceDataSyncService from "./ReferenceDataSyncService";
import LocalReferenceDataSyncService from "./LocalReferenceDataSyncService";

@Service("seedDataService")
class SeedDataService extends BaseService {
    constructor(db, beanStore) {
        super(db, beanStore);
        this.create = this.create.bind(this);
    }

    /*var a = function(number) {
     var i = 0;
     var message = "[";
     for (; i <= number; i++) {
     message += `require('../../config/${i}.json'), `;
     }
     message += "];";
     console.log(message);
     };

     a(72);*/

    postInit() {
        if (this.isNotSeeded()) {
            const files = [require('../../config/0.json'), require('../../config/1.json'), require('../../config/2.json'), require('../../config/3.json'), require('../../config/4.json'), require('../../config/5.json'), require('../../config/6.json'), require('../../config/7.json'), require('../../config/8.json'), require('../../config/9.json'), require('../../config/10.json'), require('../../config/11.json'), require('../../config/12.json'), require('../../config/13.json'), require('../../config/14.json'), require('../../config/15.json'), require('../../config/16.json'), require('../../config/17.json'), require('../../config/18.json'), require('../../config/19.json'), require('../../config/20.json'), require('../../config/21.json'), require('../../config/22.json'), require('../../config/23.json'), require('../../config/24.json'), require('../../config/25.json'), require('../../config/26.json'), require('../../config/27.json'), require('../../config/28.json'), require('../../config/29.json'), require('../../config/30.json'), require('../../config/31.json'), require('../../config/32.json'), require('../../config/33.json'), require('../../config/34.json'), require('../../config/35.json'), require('../../config/36.json'), require('../../config/37.json'), require('../../config/38.json'), require('../../config/39.json'), require('../../config/40.json'), require('../../config/41.json'), require('../../config/42.json'), require('../../config/43.json'), require('../../config/44.json'), require('../../config/45.json'), require('../../config/46.json'), require('../../config/47.json'), require('../../config/48.json'), require('../../config/49.json'), require('../../config/50.json'), require('../../config/51.json'), require('../../config/52.json'), require('../../config/53.json'), require('../../config/54.json'), require('../../config/55.json'), require('../../config/56.json'), require('../../config/57.json'), require('../../config/58.json'), require('../../config/59.json'), require('../../config/60.json'), require('../../config/61.json'), require('../../config/62.json'), require('../../config/63.json'), require('../../config/64.json'), require('../../config/65.json'), require('../../config/66.json'), require('../../config/67.json'), require('../../config/68.json'), require('../../config/69.json'), require('../../config/70.json'), require('../../config/71.json'), require('../../config/72.json'), require('../../config/73.json'), require('../../config/74.json'), require('../../config/75.json'), require('../../config/76.json'), require('../../config/77.json'), require('../../config/78.json'), require('../../config/79.json'), require('../../config/80.json'), require('../../config/81.json'), require('../../config/82.json'), require('../../config/83.json'), require('../../config/84.json'), require('../../config/85.json'), require('../../config/86.json'), require('../../config/87.json'), require('../../config/88.json'), require('../../config/89.json'), require('../../config/90.json'), require('../../config/91.json'), require('../../config/92.json'), require('../../config/93.json'), require('../../config/94.json'), require('../../config/95.json'), require('../../config/96.json'), require('../../config/97.json'), require('../../config/98.json'), require('../../config/99.json'), require('../../config/100.json'), require('../../config/101.json'), require('../../config/102.json'), require('../../config/103.json'), require('../../config/104.json'), require('../../config/105.json'), require('../../config/106.json'), require('../../config/107.json'), require('../../config/108.json'), require('../../config/109.json'), require('../../config/110.json'), require('../../config/111.json'), require('../../config/112.json'), require('../../config/113.json'), require('../../config/114.json'), require('../../config/115.json'), require('../../config/116.json'), require('../../config/117.json'), require('../../config/118.json'), require('../../config/119.json'), require('../../config/120.json'), require('../../config/121.json'), require('../../config/122.json'), require('../../config/123.json'), require('../../config/124.json'), require('../../config/125.json'), require('../../config/126.json'), require('../../config/127.json'), require('../../config/128.json'), require('../../config/129.json'), require('../../config/130.json'), require('../../config/131.json'), require('../../config/132.json'), require('../../config/133.json'), require('../../config/134.json'), require('../../config/135.json'), require('../../config/136.json'), require('../../config/137.json'), require('../../config/138.json'), require('../../config/139.json'), require('../../config/140.json'), require('../../config/141.json'), require('../../config/142.json'), require('../../config/143.json'), require('../../config/144.json'), require('../../config/145.json'), require('../../config/146.json'), require('../../config/147.json'), require('../../config/148.json'), require('../../config/149.json'), require('../../config/150.json'), require('../../config/151.json'), require('../../config/152.json'), require('../../config/153.json'), require('../../config/154.json'), require('../../config/155.json'), require('../../config/156.json'), require('../../config/157.json'), require('../../config/158.json'), require('../../config/159.json'), require('../../config/160.json'), require('../../config/161.json'), require('../../config/162.json'), require('../../config/163.json'), require('../../config/164.json'), require('../../config/165.json'), require('../../config/166.json'), require('../../config/167.json'), require('../../config/168.json'), require('../../config/169.json'), require('../../config/170.json'), require('../../config/171.json'), require('../../config/172.json'), require('../../config/173.json'), require('../../config/174.json'), require('../../config/175.json'), require('../../config/176.json'), require('../../config/177.json'), require('../../config/178.json'), require('../../config/179.json'), require('../../config/180.json'), require('../../config/181.json'), require('../../config/182.json'), require('../../config/183.json'), require('../../config/184.json'), require('../../config/185.json'), require('../../config/186.json'), require('../../config/187.json'), require('../../config/188.json'), require('../../config/189.json'), require('../../config/190.json'), require('../../config/191.json'), require('../../config/192.json'), require('../../config/193.json'), require('../../config/194.json'), require('../../config/195.json'), require('../../config/196.json'), require('../../config/197.json'), require('../../config/198.json'), require('../../config/199.json'), require('../../config/200.json'), require('../../config/201.json'), require('../../config/202.json'), require('../../config/203.json'), require('../../config/204.json'), require('../../config/205.json'), require('../../config/206.json'), require('../../config/207.json'), require('../../config/208.json'), require('../../config/209.json'), require('../../config/210.json'), require('../../config/211.json'), require('../../config/212.json'), require('../../config/213.json'), require('../../config/214.json'), require('../../config/215.json'), require('../../config/216.json'), require('../../config/217.json'), require('../../config/218.json'), require('../../config/219.json'), require('../../config/220.json'), require('../../config/221.json'), require('../../config/222.json'), require('../../config/223.json'), require('../../config/224.json'), require('../../config/225.json'), require('../../config/226.json'), require('../../config/227.json'), require('../../config/228.json'), require('../../config/229.json'), require('../../config/230.json'), require('../../config/231.json'), require('../../config/232.json'), require('../../config/233.json'), require('../../config/234.json'), require('../../config/235.json'), require('../../config/236.json'), require('../../config/237.json'), require('../../config/238.json'), require('../../config/239.json'), require('../../config/240.json'), require('../../config/241.json'), require('../../config/242.json'), require('../../config/243.json'), require('../../config/244.json'), require('../../config/245.json'), require('../../config/246.json'), require('../../config/247.json'), require('../../config/248.json'), require('../../config/249.json'), require('../../config/250.json'), require('../../config/251.json'), require('../../config/252.json'), require('../../config/253.json'), require('../../config/254.json'), require('../../config/255.json'), require('../../config/256.json'), require('../../config/257.json'), require('../../config/258.json'), require('../../config/259.json'), require('../../config/260.json'), require('../../config/261.json'), require('../../config/262.json'), require('../../config/263.json'), require('../../config/264.json'), require('../../config/265.json'), require('../../config/266.json'), require('../../config/267.json'), require('../../config/268.json'), require('../../config/269.json'), require('../../config/270.json'), require('../../config/271.json'), require('../../config/272.json'), require('../../config/273.json'), require('../../config/274.json'), require('../../config/275.json'), require('../../config/276.json'), require('../../config/277.json'), require('../../config/278.json'), require('../../config/279.json'), require('../../config/280.json'), require('../../config/281.json'), require('../../config/282.json'), require('../../config/283.json'), require('../../config/284.json'), require('../../config/285.json'), require('../../config/286.json'), require('../../config/287.json'), require('../../config/288.json'), require('../../config/289.json'), require('../../config/290.json'), require('../../config/291.json'), require('../../config/292.json'), require('../../config/293.json'), require('../../config/294.json'), require('../../config/295.json'), require('../../config/296.json'), require('../../config/297.json')];

            let localReferenceDataSyncService = new LocalReferenceDataSyncService(this.db, this.beanStore, this.getService(ReferenceDataSyncService));
            localReferenceDataSyncService.syncMetaDataFromLocal(files);
        }
    }

    isNotSeeded() {
        let allStates = this.getService(StateService).getAllStates();
        return allStates.length === 0;
    }

    createAll() {
        [
            {
                "service": SettingsService,
                "method": "saveSettings",
                "entity": settings
            },
            {
                "service": FacilitiesService,
                "method": "saveFacilityType",
                "entity": facilityTypes
            },
            {
                "service": StateService,
                "method": "saveState",
                "entity": states
            },
            {
                "service": ChecklistAssessmentService,
                "method": "saveAssessmentTool",
                "entity": assessmentTools
            },
            {
                "service": DepartmentService,
                "method": "saveDepartment",
                "entity": departments
            },
            {
                "service": ChecklistAssessmentService,
                "method": "saveAreaOfConcern",
                "entity": areasOfConcern
            },
            {
                "service": ChecklistService,
                "method": "saveChecklist",
                "entity": checklists
            },
            {
                "service": ChecklistService,
                "method": "saveCheckpoint",
                "entity": checkpoints
            },
            {
                "service": ChecklistAssessmentService,
                "method": "saveAssessmentType",
                "entity": assessmentTypes
            }
        ].map(this.create);
    }

    create(seedEntity) {
        let serviceInstance = this.getService(seedEntity.service);
        return seedEntity.entity.map((e) => serviceInstance[seedEntity.method](e));
    }

    deleteAllData() {
        const db = this.db;
        let entitiesToDelete = EntitiesMetaData.referenceEntityTypes;
        entitiesToDelete.push(new EntityMetaData(EntitySyncStatus));
        entitiesToDelete.forEach((entityMetaData) => {
            if (entityMetaData.isMappedToDb) {
                Logger.logDebug('SeedDataService', `Deleting all data from ${entityMetaData.entityName}`);
                db.write(() => {
                    const objects = db.objects(entityMetaData.entityName);
                    db.delete(objects);
                });
            } else {
                Logger.logDebug('SeedDataService', `Skipping as not mapped to db - ${entityMetaData.entityName}`);
            }
        });
        this.getService(EntitySyncStatusService).setup(EntitiesMetaData.referenceEntityTypes);
    }
}

export default SeedDataService;