import * as functions from "firebase-functions";
import addNewAppointmentsHandler from "./admin/AddNewAppointmentsHandler";
import getCoordinatorAppointmentsHandler from "./admin/GetCoordinatorAppointmentsHandler";
import deleteAppointmentsHandler from "./admin/DeleteAppointmentsHandler";
import saveAdminRequestHandler from "./admin/SaveCoordinatorHandler";
import bookAppointmentHandler from "./donor/BookAppointmentHandler";
import cancelAppointmentHandler from "./donor/CancelAppointmentHandler";
import geDonorHandler from "./donor/GetDonorHandler";
import saveDonorHandler from "./donor/SaveDonorHandler";
import getAvailableAppointmentsHandler from "./donor/GetAvailableAppointmentsHandler";
import getDonorAppointmentsHandler from "./donor/GetDonorAppointmentsHandler";
import getDonorsHandler from "./admin/GetDonorsHandler";
import * as admin from "firebase-admin";
import { handler, unauthenticatedHandler } from "./RequestHandleWrapper";

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

// Coordinator
export const addNewAppointments = handler(addNewAppointmentsHandler);
export const getCoordinatorAppointments = handler(
  getCoordinatorAppointmentsHandler
);
export const deleteAppointments = handler(deleteAppointmentsHandler);
export const saveCoordinator = handler(saveAdminRequestHandler);
export const getDonors = handler(getDonorsHandler);

// Donor
export const bookAppointment = handler(bookAppointmentHandler);
export const cancelAppointment = handler(cancelAppointmentHandler);
export const getDonor = handler(geDonorHandler);
export const saveDonor = handler(saveDonorHandler);
export const getAvailableAppointments = unauthenticatedHandler(
  getAvailableAppointmentsHandler
);
export const getDonorAppointments = handler(getDonorAppointmentsHandler);
