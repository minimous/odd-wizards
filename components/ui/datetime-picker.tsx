'use client';

import * as React from 'react';
import { format, parse } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export const dateTimeSchema = z.string().refine(
  (value) => {
    try {
      parse(value, 'yyyy-MM-dd h:mm a', new Date());
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Invalid datetime format' }
);

interface DateTimePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeDateTime?: (value: string) => void;
}

export function DateTimePicker({
  value,
  onChange,
  onChangeDateTime,
  name,
  className,
  disabled,
  ...props
}: DateTimePickerProps) {
  const [isTimeInvalid, setIsTimeInvalid] = React.useState(false);

  // Parse the existing value or use current date/time as default
  const currentDateTime =
    value && typeof value === 'string'
      ? parse(value as string, 'yyyy-MM-dd h:mm a', new Date())
      : new Date();

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const formattedTime = format(currentDateTime, 'h:mm a');
      const combinedDateTime =
        format(newDate, 'yyyy-MM-dd') + ' ' + formattedTime;

      // Call both onChange and onChangeDateTime if provided
      if (onChange) {
        (onChange as React.ChangeEventHandler<HTMLInputElement>)({
          target: { name, value: combinedDateTime }
        } as React.ChangeEvent<HTMLInputElement>);
      }

      if (onChangeDateTime) {
        onChangeDateTime(combinedDateTime);
      }
    }
  };

  const handleTimeChange = (newTime: string) => {
    setIsTimeInvalid(false);

    try {
      const updatedDateTime =
        format(currentDateTime, 'yyyy-MM-dd') + ' ' + newTime;
      parse(updatedDateTime, 'yyyy-MM-dd h:mm a', new Date());

      // Call both onChange and onChangeDateTime if provided
      if (onChange) {
        (onChange as React.ChangeEventHandler<HTMLInputElement>)({
          target: { name, value: updatedDateTime }
        } as React.ChangeEvent<HTMLInputElement>);
      }

      if (onChangeDateTime) {
        onChangeDateTime(updatedDateTime);
      }
    } catch (error) {
      setIsTimeInvalid(true);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
          // {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value && typeof value === 'string' ? (
            format(currentDateTime, 'PPP h:mm a')
          ) : (
            <span>{props.placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={currentDateTime}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="flex items-center space-x-2 border-t p-3">
          <Clock className="h-4 w-4" />
          <Input
            type="text"
            value={format(currentDateTime, 'h:mm')}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':');
              const newHours = hours
                ? Math.min(Math.max(parseInt(hours), 1), 12).toString()
                : '';
              const newMinutes = minutes
                ? Math.min(Math.max(parseInt(minutes), 0), 59)
                    .toString()
                    .padStart(2, '0')
                : '00';
              const newTime = `${newHours}:${newMinutes} ${format(
                currentDateTime,
                'a'
              )}`;
              handleTimeChange(newTime);
            }}
            placeholder="hh:mm"
            disabled={disabled}
            className={cn('w-[4.5rem]', isTimeInvalid && 'border-red-500')}
          />
          <Select
            value={format(currentDateTime, 'a')}
            onValueChange={(newPeriod) => {
              const currentTime = format(currentDateTime, 'h:mm');
              handleTimeChange(`${currentTime} ${newPeriod}`);
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-[4.5rem]">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
      <Input type="hidden" name={name} value={value as string} {...props} />
    </Popover>
  );
}
