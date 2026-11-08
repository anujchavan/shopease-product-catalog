import { useEffect, useRef, useState } from 'react';

/**
 * Keeps an input's text in local state (so typing feels instant), and calls
 * `onCommit` only after the user stops typing for `delay` ms.
 *
 * Used by the search bar and price inputs: we don't want to re-filter
 * the product list on every single keystroke.
 */
export function useDebouncedInput(externalValue, onCommit, delay = 400) {
  const [value, setValue] = useState(externalValue);
  const [prevExternalValue, setPrevExternalValue] = useState(externalValue);
  const timerRef = useRef(null);

  // If the value changes from outside (e.g. "Clear all" or Back button), show it in the input.
  // This is React's recommended "adjust state when a prop changes" pattern (no useEffect needed).
  if (externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue);
    setValue(externalValue);
  }

  // Don't fire a pending commit after the component is gone
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (newValue) => {
    setValue(newValue);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onCommit(newValue), delay);
  };

  // Cancel a pending commit (e.g. when the user presses Enter and we apply the value right away)
  const cancelPending = () => clearTimeout(timerRef.current);

  // Change the text without waiting (e.g. the "×" clear button)
  const setValueNow = (newValue) => {
    cancelPending();
    setValue(newValue);
  };

  return { value, handleChange, cancelPending, setValueNow };
}
