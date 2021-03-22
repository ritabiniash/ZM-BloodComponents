import styles from "./AddAppointmentsScreen.module.scss";
import AddAppointmentsForm from "./AddAppointmentsForm";
import { NewSlots } from "./AddAppointmentsScreenContainer";
import { Hospital } from "@zm-blood-components/common";
import Button from "../../components/Button";
import { columns, rows } from "./AddAppointmentTableConfig";
import Table from "../../components/Table";
import { NotificationPopup } from "../../components/Popup";

interface AddAppointmentsScreenProps {
  slotsArray: NewSlots[];
  addSlotsRequest: (
    hospital: Hospital,
    donationStartTime: Date,
    slots: number
  ) => void;
  deleteSlotsRequest: (key: string) => void;
  isSaving: boolean;
  onSave: () => void;
  showPopup: boolean;
  closePopup: () => void;
}

export default function AddAppointmentsScreen({
  slotsArray,
  addSlotsRequest,
  deleteSlotsRequest,
  isSaving,
  onSave,
  showPopup,
  closePopup,
}: AddAppointmentsScreenProps) {
  return (
    <div className={styles.component}>
      <AddAppointmentsForm addSlotsRequest={addSlotsRequest} />
      <main className={styles.content}>
        <Table
          hasColumnHeaders
          columns={columns(deleteSlotsRequest)}
          rows={rows(slotsArray)}
          aria-label={"add donation slots table"}
        />
      </main>

      <footer className={styles.footer}>
        {slotsArray.length > 0 && (
          <Button title="שמור והמשך" onClick={onSave} isLoading={isSaving} />
        )}
      </footer>
      <NotificationPopup
        open={showPopup}
        buttonApproveText={"המשך"}
        onClose={closePopup}
        titleFirst="התור התווסף בהצלחה!"
      />
    </div>
  );
}
