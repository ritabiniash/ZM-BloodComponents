import styles from "./LastDonationDateHeader.module.scss";
import HeaderSection from "../HeaderSection";
import Text from "../basic/Text";
import { DateUtils } from "@zm-blood-components/common";

export interface BookDonationHeaderProps {
  lastDonation?: Date;
  firstName: string;
}

function LastDonationDateHeader({
  firstName,
  lastDonation,
}: BookDonationHeaderProps) {
  return (
    <HeaderSection className={styles.component}>
      <span className={styles.welcomeText}>
        <Text>שמחים לראות אותך</Text>
        &nbsp;
        <Text />
        <Text>{firstName}</Text>
      </span>
      {lastDonation && (
        <>
          <Text>תאריך אחרון בו תרמת טרומבוציטים</Text>
          <Text className={styles.dateText}>
            {DateUtils.ToDateString(lastDonation)}
          </Text>
        </>
      )}
    </HeaderSection>
  );
}

export default LastDonationDateHeader;
