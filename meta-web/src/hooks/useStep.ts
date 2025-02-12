import { useState } from "react";

export function useStep() {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = (newValue: number) => setCurrentTab(newValue);

  return { currentTab, handleTabChange };
}