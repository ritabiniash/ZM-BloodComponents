import { AvailableAppointment, Hospital } from "@zm-blood-components/common";
import * as DateUtils from "./DateUtil";
import * as _ from "lodash";

type DonationDay = {
  day: string;
  donationSlots: DonationSlot[];
};

export type DonationSlot = {
  donationStartTimeMillis: number;
  hospital: Hospital;
  appointmentIds: string[];
};

export function groupDonationDays(
  appointments: AvailableAppointment[]
): DonationDay[] {
  return _.chain(appointments)
    .groupBy((appointment) =>
      new Date(appointment.donationStartTimeMillis).toDateString()
    )
    .map((appointmentsInDay, dateString) => {
      const donationSlotsInDay = getDonationSlotsInDay(appointmentsInDay);

      const res: DonationDay = {
        day: DateUtils.ToDateString(new Date(dateString)),
        donationSlots: donationSlotsInDay,
      };

      return res;
    })
    .sortBy((donationDay) => new Date(donationDay.day).getTime())
    .value();
}

function getDonationSlotsInDay(
  appointmentsInDay: AvailableAppointment[]
): DonationSlot[] {
  return _.chain(appointmentsInDay)
    .groupBy(
      (appointment) =>
        appointment.hospital + appointment.donationStartTimeMillis
    )
    .map(appointmentsToDonationSlot)
    .sortBy("donationStartTime")
    .value();
}

function appointmentsToDonationSlot(
  appointmentsInSlot: AvailableAppointment[]
): DonationSlot {
  const arbitraryAppointment = appointmentsInSlot[0];

  return {
    donationStartTimeMillis: arbitraryAppointment.donationStartTimeMillis,
    hospital: arbitraryAppointment.hospital,
    appointmentIds: appointmentsInSlot.map((a) => a.id),
  };
}
