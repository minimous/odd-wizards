'use client';

import * as React from 'react';
import moment from 'moment';
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
    return moment(value, 'YYYY-MM-DD h:mm A', true).isValid();
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
  const [hours, setHours] = React.useState('12');
  const [minutes, setMinutes] = React.useState('00');
  const [isTimeInvalid, setIsTimeInvalid] = React.useState(false);

  // Parse the existing value or use current date/time as default
  const currentDateTime = value && typeof value === 'string'
    ? moment(value, 'YYYY-MM-DD h:mm A')
    : moment();

  // Initialize hours and minutes when component mounts or value changes
  React.useEffect(() => {
    setHours(currentDateTime.format('h'));
    setMinutes(currentDateTime.format('mm'));
  }, [value]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const momentDate = moment(newDate);
      const currentTime = `${hours}:${minutes} ${currentDateTime.format('A')}`;
      const combinedDateTime = momentDate.format('YYYY-MM-DD') + ' ' + currentTime;

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

  const updateTime = (newHours: string, newMinutes: string) => {
    const timeString = `${newHours}:${newMinutes} ${currentDateTime.format('A')}`;
    const updatedDateTime = currentDateTime.format('YYYY-MM-DD') + ' ' + timeString;

    if (moment(updatedDateTime, 'YYYY-MM-DD h:mm A', true).isValid()) {
      setIsTimeInvalid(false);
      
      if (onChange) {
        (onChange as React.ChangeEventHandler<HTMLInputElement>)({
          target: { name, value: updatedDateTime }
        } as React.ChangeEvent<HTMLInputElement>);
      }

      if (onChangeDateTime) {
        onChangeDateTime(updatedDateTime);
      }
    } else {
      setIsTimeInvalid(true);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHours = e.target.value.replace(/\D/g, '');
    if (newHours === '') {
      setHours('');
      return;
    }

    const numericHours = parseInt(newHours);
    if (numericHours > 12) {
      newHours = '12';
    } else if (numericHours < 1) {
      newHours = '1';
    } else {
      newHours = numericHours.toString();
    }

    setHours(newHours);
    updateTime(newHours, minutes);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = e.target.value.replace(/\D/g, '');
    if (newMinutes === '') {
      setMinutes('');
      return;
    }

    const numericMinutes = parseInt(newMinutes);
    if (numericMinutes > 59) {
      newMinutes = '59';
    } else {
      newMinutes = numericMinutes.toString().padStart(2, '0');
    }

    setMinutes(newMinutes);
    updateTime(hours, newMinutes);
  };

  const handleTimeBlur = () => {
    // Format hours and minutes properly when input loses focus
    const formattedHours = hours ? Math.max(1, Math.min(12, parseInt(hours))).toString() : '12';
    const formattedMinutes = minutes ? minutes.padStart(2, '0') : '00';
    
    setHours(formattedHours);
    setMinutes(formattedMinutes);
    updateTime(formattedHours, formattedMinutes);
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
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value && typeof value === 'string' ? (
            currentDateTime.format('MMMM D, YYYY h:mm A')
          ) : (
            <span>{props.placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={currentDateTime.toDate()}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="flex items-center space-x-2 border-t p-3">
          <Clock className="h-4 w-4" />
          <div className="flex items-center">
            <Input
              type="text"
              value={hours}
              onChange={handleHoursChange}
              onBlur={handleTimeBlur}
              placeholder="hh"
              disabled={disabled}
              className={cn('w-[3rem] text-center', isTimeInvalid && 'border-red-500')}
              maxLength={2}
            />
            <span className="mx-1">:</span>
            <Input
              type="text"
              value={minutes}
              onChange={handleMinutesChange}
              onBlur={handleTimeBlur}
              placeholder="mm"
              disabled={disabled}
              className={cn('w-[3rem] text-center', isTimeInvalid && 'border-red-500')}
              maxLength={2}
            />
          </div>
          <Select
            value={currentDateTime.format('A')}
            onValueChange={(newPeriod) => {
              const updatedDateTime = currentDateTime.format('YYYY-MM-DD') + ' ' + `${hours}:${minutes} ${newPeriod}`;
              if (onChange) {
                (onChange as React.ChangeEventHandler<HTMLInputElement>)({
                  target: { name, value: updatedDateTime }
                } as React.ChangeEvent<HTMLInputElement>);
              }
              if (onChangeDateTime) {
                onChangeDateTime(updatedDateTime);
              }
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