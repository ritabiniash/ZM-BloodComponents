import { DbAppointment, DbDonor } from "@zm-blood-components/common";
import { sendEmailToDonor } from "./notifiers/DonorBookAppointmentNotifier";
import { sendBookingEmailToStaff } from "./notifiers/StaffBookAppointmentNotifier";
import { getAppointmentNotificationData } from "./AppointmentNotificationData";
import { getStaffRecipients } from "./StaffEmailRecepientsCalculator";

export const ZM_LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/blood-components.appspot.com/o/Logo_ZM_he.jpg?alt=media&token=aa5e9d8c-d08e-4c80-ad7f-bfd361e36b20";

export async function notifyOnAppointmentBooked(
  bookedAppointment: DbAppointment,
  donor: DbDonor
) {
  if (donor.testUser) {
    console.log("Not sending email to test user");
    return;
  }

  const appointmentNotificationData = getAppointmentNotificationData(
    bookedAppointment,
    donor
  );

  await sendEmailToDonor(donor.email, appointmentNotificationData);

  const staffEmails = await getStaffRecipients(bookedAppointment);
  await sendBookingEmailToStaff(staffEmails, appointmentNotificationData);
}
