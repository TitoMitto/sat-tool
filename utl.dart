import 'package:flutter/foundation.dart';
import 'package:provider/provider.dart';
import 'package:solutech_sat/helpers/appointment_checkin_manager.dart';
import 'package:solutech_sat/helpers/appointments_manager.dart';
import 'package:solutech_sat/helpers/assets_manager.dart';
import 'package:solutech_sat/helpers/availability_manager.dart';
import 'package:solutech_sat/helpers/banking_manager.dart';
import 'package:solutech_sat/helpers/brands_manager.dart';
import 'package:solutech_sat/helpers/competitor_activities_manager.dart';
import 'package:solutech_sat/helpers/contact_checkin_manager.dart';
import 'package:solutech_sat/helpers/contact_manager.dart';
import 'package:solutech_sat/helpers/daily_plan_manager.dart';
import 'package:solutech_sat/helpers/deliveries_manager.dart';
import 'package:solutech_sat/helpers/expense_requests_manager.dart';
import 'package:solutech_sat/helpers/expenses_manager.dart';
import 'package:solutech_sat/helpers/feedback_manager.dart';
import 'package:solutech_sat/helpers/free_of_cost_manager.dart';
import 'package:solutech_sat/helpers/general_activitites_manager.dart';
import 'package:solutech_sat/helpers/general_photos_manager.dart';
import 'package:solutech_sat/helpers/general_tasks_manager.dart';
import 'package:solutech_sat/helpers/inventory_manager.dart';
import 'package:solutech_sat/helpers/lead_manager.dart';
import 'package:solutech_sat/helpers/marketing_request_manager.dart';
import 'package:solutech_sat/helpers/monthly_plan_manager.dart';
import 'package:solutech_sat/helpers/orders_manager.dart';
import 'package:solutech_sat/helpers/payments_manager.dart';
import 'package:solutech_sat/helpers/posm_manager.dart';
import 'package:solutech_sat/helpers/price_compliance_manager.dart';
import 'package:solutech_sat/helpers/printer_manager.dart';
import 'package:solutech_sat/helpers/product_availability_manager.dart';
import 'package:solutech_sat/helpers/product_detail_manager.dart';
import 'package:solutech_sat/helpers/project_checkin_manager.dart';
import 'package:solutech_sat/helpers/project_manager.dart';
import 'package:solutech_sat/helpers/route_plans_manager.dart';
import 'package:solutech_sat/helpers/session_inventory_manager.dart';
import 'package:solutech_sat/helpers/session_manager.dart';
import 'package:solutech_sat/helpers/skip_records_manager.dart';
import 'package:solutech_sat/helpers/sod_manager.dart';
import 'package:solutech_sat/helpers/sos_manager.dart';
import 'package:solutech_sat/helpers/stock_takes_manager.dart';
import 'package:solutech_sat/helpers/task_manager.dart';
import 'package:solutech_sat/helpers/trainings_manager.dart';
import 'package:solutech_sat/services/activations_service.dart';
import 'package:solutech_sat/services/assets_service.dart';
import 'package:solutech_sat/services/expense_service.dart';
import 'package:solutech_sat/services/feedback_service.dart';
import 'package:solutech_sat/services/painter_service.dart';
import 'package:solutech_sat/services/price_index_service.dart';
import 'package:solutech_sat/services/product_update_service.dart';
import 'package:solutech_sat/services/status_update_service.dart';
import 'package:solutech_sat/services/survey_service.dart';
import 'package:solutech_sat/tools/manager.dart';

Map<String, Service> serviceRegister = {
  Module.customers: routePlansManager,
  Module.stocks: inventoryManager,
  Module.skipRecords: skipRecordsManager,
  Module.generalTasks: generalTasksManager,
  Module.orders: ordersManager,
  Module.feedbacks: feedbackService,
  Module.printer: printerManager,
  Module.availability: availabilityManager,
  Module.posm: posmManager,
  Module.productAvailability: productAvailabilityManager,
  Module.competitorActivities: competitorActivitiesManager,
  Module.sos: sosManager,
  Module.sod: sodManager,
  Module.generalPhotos: generalPhotosManager,
  Module.deliveries: deliveriesManager,
  Module.payments: paymentsManager,
  Module.surveys: surveyService,
  Module.stockTakes: stockTakesManager,
  Module.banking: bankingManager,
  Module.expenses: expensesManager,
  Module.expenses: expensesService,
  Module.activations: activationsService,
  Module.expensesRequests: expenseRequestsManager,
  Module.assets: assetsService,
  Module.assetsOld: assetsManager,
  Module.checkinCheckout: sessionManager,
  Module.monthlyPlans: monthlyPlanManager,
  Module.dailyPlans: dailyPlanManager,
  Module.priceCompliance: priceComplianceManager,
  Module.productDetails: productDetailManager,
  Module.appointments: appointmentManager,
  Module.leads: leadManager,
  Module.tasks: taskManager,
  Module.projects: projectManager,
  Module.generalActivities: generalActivitiesManager,
  Module.appointments: appointmentManager,
  Module.appointmentCheckins: appointmentCheckinManager,
  Module.feedbacksOld: feedbackManager,
  Module.trainings: trainingsManager,
  Module.projectCheckins: projectCheckinManager,
  Module.contactCheckins: contactCheckinManager,
  Module.freeOfCosts: freeOfCostManager,
  Module.contacts: contactManager,
  Module.marketingRequest: marketingRequestManager,
  Module.brands: brandsManager,
  Module.inventorySessions: sessionInventoryManager,
  Module.priceIndex: priceIndexService,
  Module.painter: painterService,
  Module.productUpdates: productUpdateService,
  Module.statusUpdates: statusUpdateService,
};

class Module {
  static final customers = "customers";
  static final stocks = "stocks";
  static final statusUpdates = "statusUpdates";
  static final skipRecords = "skipRecords";
  static final generalTasks = "generalTasks";
  static final orders = "orders";
  static final feedbacks = "feedbacks";
  static final printer = "printer";
  static final availability = "availability";
  static final posm = "posm";
  static final productAvailability = "productAvailability";
  static final competitorActivities = "competitorActivities";
  static final sos = "sos";
  static final sod = "sod";
  static final generalPhotos = "generalPhotos";
  static final deliveries = "deliveries";
  static final payments = "payments";
  static final surveysOld = "surveysOld";
  static final surveys = "surveys";
  static final stockTakes = "stockTakes";
  static final banking = "banking";
  static final expenses = "expenses";
  static final expenseRequests = "expensesRequests";
  static final activations = "activations";
  static final expensesOld = "expenses";
  static final assets = "assets";
  static final assetsOld = "assetsOld";
  static final checkinCheckout = "checkinCheckout";
  static final monthlyPlans = "monthlyPlans";
  static final dailyPlans = "dailyPlans";
  static final priceCompliance = "priceCompliance";
  static final productDetails = "productDetails";
  static final appointments = "appointments";
  static final leads = "leads";
  static final tasks = "tasks";
  static final projects = "projects";
  static final expensesRequests = "expensesRequests";
  static final generalActivities = "generalActivities";
  static final appointmentsOld = "appointments";
  static final appointmentCheckins = "appointmentCheckins";
  static final feedbacksOld = "feedbacksOld";
  static final trainings = "trainings";
  static final projectCheckins = "projectCheckins";
  static final contactCheckins = "contactCheckins";
  static final freeOfCosts = "freeOfCosts";
  static final contacts = "contacts";
  static final marketingRequest = "marketingRequest";
  static final brands = "brands";
  static final inventorySessions = "inventorySessions";
  static final priceIndex = "priceIndex";
  static final painter = "painter";
  static final productUpdates = "productUpdates";
  static final statusUpdatesOld = "statusUpdates";
}

ChangeNotifierProvider<T> serviceFrom<T extends ChangeNotifier>(T service) {
  var x = ChangeNotifierProvider<T>.value(value: service);
  print("REGISTER $x");
  return x;
}