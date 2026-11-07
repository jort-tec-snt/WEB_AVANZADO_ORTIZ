"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, parseISO, toISO } from "@/lib/rules";

/** Selector de fecha (Popover + Calendar de shadcn/ui). Trabaja con strings yyyy-mm-dd. */
export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  invalid,
  startYear = 1950,
  endYear = new Date().getFullYear() + 3,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  invalid?: boolean;
  startYear?: number;
  endYear?: number;
  disabled?: (date: Date) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseISO(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={invalid || undefined}
          className="w-full justify-start gap-2 font-normal data-[empty=true]:text-muted-foreground"
          data-empty={!selected}
        >
          <CalendarIcon />
          {selected ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          captionLayout="dropdown"
          startMonth={new Date(startYear, 0)}
          endMonth={new Date(endYear, 11)}
          defaultMonth={selected}
          selected={selected}
          disabled={disabled}
          onSelect={(d) => {
            if (d) onChange(toISO(d));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
