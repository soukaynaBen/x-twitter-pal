"use client"

import * as React from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { addMonths, format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



export function DatePickerRange({ date, setDate }: { date:  DateRange, setDate: React.Dispatch<React.SetStateAction< DateRange | undefined>>}) {


      return (  
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="custom"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />  
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            endMonth={ addMonths(new Date(), 1)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
   )
    }


export function DatePickerSingle({ date, setDate }: { date: Date , setDate: React.Dispatch<React.SetStateAction<Date | undefined>>}) {

  // const [date, setDate] = React.useState<DateRange | undefined>({
  //   from: new Date(new Date().getFullYear(), 0, 20),
  //   to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  // })

  
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant={"outline"} data-empty={!date} className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground">{date ? format(date, "PPP") : <span>dd/mm/yyyy</span>}<ChevronDownIcon data-icon="inline-end" /></Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  ) 
}
