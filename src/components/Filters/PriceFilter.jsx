import { useDebouncedInput } from '@/hooks/useDebouncedInput';
import FilterSection from './FilterSection';
import styles from './Filters.module.css';

/** Min / Max price inputs. The list updates 400ms after the user stops typing. */
function PriceFilter({ min, max, onChange }) {
  const minInput = useDebouncedInput(min, (value) => onChange({ min: value }));
  const maxInput = useDebouncedInput(max, (value) => onChange({ max: value }));

  // Filters still apply as typed (the result is simply empty); we just explain why
  const isInvalid =
    minInput.value !== '' && maxInput.value !== '' && Number(minInput.value) > Number(maxInput.value);

  return (
    <FilterSection title="Price">
      <div className={styles.priceRow}>
        <PriceInput label="Minimum price" placeholder="Min" input={minInput} isInvalid={isInvalid} />
        <span className={styles.muted} aria-hidden="true">–</span>
        <PriceInput label="Maximum price" placeholder="Max" input={maxInput} isInvalid={isInvalid} />
      </div>

      {isInvalid && (
        <p id="price-error" className={styles.error} role="alert">
          Min price is higher than max price.
        </p>
      )}
    </FilterSection>
  );
}

/** One "$ [   ]" input box */
function PriceInput({ label, placeholder, input, isInvalid }) {
  return (
    <label className={`${styles.priceField} ${isInvalid ? styles.priceFieldInvalid : ''}`}>
      <span className="visually-hidden">{label}</span>
      <span className={styles.muted} aria-hidden="true">$</span>
      <input
        type="number"
        min="0"
        inputMode="decimal"
        placeholder={placeholder}
        value={input.value}
        onChange={(event) => input.handleChange(event.target.value)}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? 'price-error' : undefined}
      />
    </label>
  );
}

export default PriceFilter;
