import { useState } from 'react';

export function useBoolean(initValue = false): [boolean, () => void] {
  const [isChecked, setChecked] = useState(initValue);
  const onToggle = () => setChecked(!isChecked);

  return [isChecked, onToggle];
}
