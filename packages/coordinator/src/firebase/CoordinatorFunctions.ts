import firebase from "firebase/app";
import "firebase/functions";
import { FunctionsApi, Hospital } from "@zm-blood-components/common";
import { NewSlots } from "../screens/addAppointments/AddAppointmentsScreenContainer";
import { GetBookedDonationsInHospitalRequest } from "common/src/functions-api";

export async function getCoordinator() {
  const getCoordinatorFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.GetCoordinatorFunctionName);
  const request: FunctionsApi.GetCoordinatorRequest = {};

  const res = await getCoordinatorFunction(request);
  const data = res.data as FunctionsApi.GetCoordinatorResponse;
  return data.coordinator;
}

export async function addNewAppointments(newSlots: NewSlots[]) {
  const addNewAppointmentsFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.AddNewAppointmentsFunctionName);

  const newSlotsRequests: FunctionsApi.NewSlotsRequest[] = newSlots.map(
    (slots) => ({
      hospital: slots.hospital,
      slots: slots.slots,
      donationStartTimeMillis: slots.donationStartTime.getTime(),
    })
  );

  const request: FunctionsApi.AddAppointmentsRequest = {
    slotsRequests: newSlotsRequests,
  };

  await addNewAppointmentsFunction(request);
}

export async function getAppointments(hospital: Hospital) {
  const getAppointmentsFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.GetCoordinatorAppointmentsFunctionName);

  const request: FunctionsApi.GetCoordinatorAppointmentsRequest = {
    hospital,
  };

  const response = await getAppointmentsFunction(request);
  return response.data as FunctionsApi.GetCoordinatorAppointmentsResponse;
}

export function removeDonorFromAppointment(appointmentId: string) {
  const request: FunctionsApi.DeleteAppointmentRequest = {
    appointmentId: appointmentId,
    onlyRemoveDonor: true,
  };

  return callDeleteAppointmentFunction(request);
}

export function deleteAppointment(appointmentId: string) {
  const request: FunctionsApi.DeleteAppointmentRequest = {
    appointmentId: appointmentId,
    onlyRemoveDonor: false,
  };

  return callDeleteAppointmentFunction(request);
}

async function callDeleteAppointmentFunction(
  request: FunctionsApi.DeleteAppointmentRequest
) {
  const deleteAppointmentsFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.DeleteAppointmentsFunctionName);

  deleteAppointmentsFunction(request);
}

export async function getAllDonors() {
  const getDonorsFunction = firebase
    .functions()
    .httpsCallable(FunctionsApi.GetDonorsFunctionName);

  const request: FunctionsApi.GetDonorsRequest = {};

  const response = await getDonorsFunction(request);
  const data = response.data as FunctionsApi.GetDonorsResponse;
  return data.donors;
}

export async function getBookedAppointmentsInHospital(
  request: GetBookedDonationsInHospitalRequest
) {
  const getBookedAppointmentsInHospital = firebase
    .functions()
    .httpsCallable(FunctionsApi.GetBookedDonationsInHospitalFunctionName);

  const response = await getBookedAppointmentsInHospital(request);
  const data =
    response.data as FunctionsApi.GetBookedDonationsInHospitalResponse;
  return data.donationsWithDonorDetails;
}
