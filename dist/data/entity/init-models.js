"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModels = exports.VendorBooking = exports.Packages = exports.OrganisationContact = exports.LineItems = exports.InvoiceDetails = exports.ExpTmsData = exports.ExpResponseData = exports.EventsStage = exports.Events = exports.Documents = exports.ConfigEventsToLobster = exports.AppUsers = exports.Address = exports.AccountsMaster = exports.BvEventsToLobster = void 0;
const BvEventsToLobster_1 = require("./BvEventsToLobster");
Object.defineProperty(exports, "BvEventsToLobster", { enumerable: true, get: function () { return BvEventsToLobster_1.BvEventsToLobster; } });
const AccountsMaster_1 = require("./AccountsMaster");
Object.defineProperty(exports, "AccountsMaster", { enumerable: true, get: function () { return AccountsMaster_1.AccountsMaster; } });
const Address_1 = require("./Address");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return Address_1.Address; } });
const AppUsers_1 = require("./AppUsers");
Object.defineProperty(exports, "AppUsers", { enumerable: true, get: function () { return AppUsers_1.AppUsers; } });
const ConfigEventsToLobster_1 = require("./ConfigEventsToLobster");
Object.defineProperty(exports, "ConfigEventsToLobster", { enumerable: true, get: function () { return ConfigEventsToLobster_1.ConfigEventsToLobster; } });
const Documents_1 = require("./Documents");
Object.defineProperty(exports, "Documents", { enumerable: true, get: function () { return Documents_1.Documents; } });
const Events_1 = require("./Events");
Object.defineProperty(exports, "Events", { enumerable: true, get: function () { return Events_1.Events; } });
const EventsStage_1 = require("./EventsStage");
Object.defineProperty(exports, "EventsStage", { enumerable: true, get: function () { return EventsStage_1.EventsStage; } });
const ExpResponseData_1 = require("./ExpResponseData");
Object.defineProperty(exports, "ExpResponseData", { enumerable: true, get: function () { return ExpResponseData_1.ExpResponseData; } });
const ExpTmsData_1 = require("./ExpTmsData");
Object.defineProperty(exports, "ExpTmsData", { enumerable: true, get: function () { return ExpTmsData_1.ExpTmsData; } });
const InvoiceDetails_1 = require("./InvoiceDetails");
Object.defineProperty(exports, "InvoiceDetails", { enumerable: true, get: function () { return InvoiceDetails_1.InvoiceDetails; } });
const LineItems_1 = require("./LineItems");
Object.defineProperty(exports, "LineItems", { enumerable: true, get: function () { return LineItems_1.LineItems; } });
const OrganisationContact_1 = require("./OrganisationContact");
Object.defineProperty(exports, "OrganisationContact", { enumerable: true, get: function () { return OrganisationContact_1.OrganisationContact; } });
const Packages_1 = require("./Packages");
Object.defineProperty(exports, "Packages", { enumerable: true, get: function () { return Packages_1.Packages; } });
const VendorBooking_1 = require("./VendorBooking");
Object.defineProperty(exports, "VendorBooking", { enumerable: true, get: function () { return VendorBooking_1.VendorBooking; } });
function initModels(sequelize) {
    const BvEventsToLobster = BvEventsToLobster_1.BvEventsToLobster.initModel(sequelize);
    const AccountsMaster = AccountsMaster_1.AccountsMaster.initModel(sequelize);
    const Address = Address_1.Address.initModel(sequelize);
    const AppUsers = AppUsers_1.AppUsers.initModel(sequelize);
    const ConfigEventsToLobster = ConfigEventsToLobster_1.ConfigEventsToLobster.initModel(sequelize);
    const Documents = Documents_1.Documents.initModel(sequelize);
    const Events = Events_1.Events.initModel(sequelize);
    const EventsStage = EventsStage_1.EventsStage.initModel(sequelize);
    const ExpResponseData = ExpResponseData_1.ExpResponseData.initModel(sequelize);
    const ExpTmsData = ExpTmsData_1.ExpTmsData.initModel(sequelize);
    const InvoiceDetails = InvoiceDetails_1.InvoiceDetails.initModel(sequelize);
    const LineItems = LineItems_1.LineItems.initModel(sequelize);
    const OrganisationContact = OrganisationContact_1.OrganisationContact.initModel(sequelize);
    const Packages = Packages_1.Packages.initModel(sequelize);
    const VendorBooking = VendorBooking_1.VendorBooking.initModel(sequelize);
    return {
        BvEventsToLobster: BvEventsToLobster,
        AccountsMaster: AccountsMaster,
        Address: Address,
        AppUsers: AppUsers,
        ConfigEventsToLobster: ConfigEventsToLobster,
        Documents: Documents,
        Events: Events,
        EventsStage: EventsStage,
        ExpResponseData: ExpResponseData,
        ExpTmsData: ExpTmsData,
        InvoiceDetails: InvoiceDetails,
        LineItems: LineItems,
        OrganisationContact: OrganisationContact,
        Packages: Packages,
        VendorBooking: VendorBooking,
    };
}
exports.initModels = initModels;
