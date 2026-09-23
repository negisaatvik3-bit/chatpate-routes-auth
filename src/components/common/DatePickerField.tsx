import { useEffect, useState } from "react";
import "./date-picker-field.css";

type DatePickerFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function formatDisplayDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const [, year, month, day] = match ?? [];
  return year && month && day ? `${day}/${month}/${year.slice(-2)}` : "";
}

function parseDisplayDate(value: string) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(value.trim());
  if (!match) return "";

  const [, dayText, monthText, yearText] = match;
  if (!dayText || !monthText || !yearText) return "";

  const day = Number(dayText);
  const month = Number(monthText);
  const year = yearText.length === 2 ? 2000 + Number(yearText) : Number(yearText);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }

  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  className = "",
}: DatePickerFieldProps) {
  const [displayValue, setDisplayValue] = useState(() => formatDisplayDate(value));

  useEffect(() => {
    setDisplayValue(formatDisplayDate(value));
  }, [value]);

  return (
    <div className={`date-picker-field ${className}`.trim()}>
      <label className="date-picker-label" htmlFor={`${id}-text`}>
        {label}
      </label>
      <div className="date-picker-control">
        <input
          id={`${id}-text`}
          className="date-picker-text"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={10}
          placeholder="dd/mm/yy"
          value={displayValue}
          aria-label={label}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDisplayValue(nextValue);
            onChange(parseDisplayDate(nextValue));
          }}
          onBlur={() => {
            if (displayValue && !parseDisplayDate(displayValue)) {
              setDisplayValue(formatDisplayDate(value));
            }
          }}
        />
        <svg
          className="date-picker-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
          <path d="M8 3.5v4M16 3.5v4M3.5 10h17" />
          <path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" />
        </svg>
        <input
          className="date-picker-native"
          type="date"
          value={value}
          aria-label={`Open ${label.toLowerCase()} calendar`}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
