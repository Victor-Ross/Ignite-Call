import { useState } from 'react';
import { CalendarStep } from './CalendarStep/index.page';
import { ConfirmStep } from './ConfirmStep/index.page';

export function Scheduleform() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null);
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
      />
    );
  }
  return <CalendarStep onSelectDateTime={setSelectedDateTime} />;
}