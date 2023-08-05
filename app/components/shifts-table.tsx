import {Link} from "@remix-run/react";
import {format} from "date-fns";
import {calculateHoursWorked, formatTime} from "~/helpers";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components//ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";

import type {LoaderData} from "~/routes/employee._index";

const ShiftsTable: React.FC<{shifts: LoaderData["latestShifts"]}> = ({shifts}) => {
  //   const oneweek = 7 * 24 * 60 * 60 * 1000;

  return (
    <Card className="col-span-3 border-none">
      <CardHeader className="flex flex-row items-baseline justify-between">
        <CardTitle className="mb-2">
          Current week shifts <span className="text-sm font-normal">(last 7 days)</span>
        </CardTitle>
        <CardDescription>
          <Link to="/employee/dashboard/shifts" className="hover:underline">
            View all shifts
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Date</TableHead>
              <TableHead className="w-[100px]">Clock-In</TableHead>
              <TableHead className="w-[100px]">Clock-Off</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Project</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-semibold">{format(shift.date, "dd MMM")}</TableCell>
                <TableCell>{format(shift.start, "HH:mm a")}</TableCell>
                {/* 24hs */}
                <TableCell>{shift.end ? format(shift.end, "HH:mm a") : "N/A"}</TableCell>
                <TableCell>
                  {shift.end ? formatTime({milliseconds: calculateHoursWorked(shift.start, shift.end)}) : "N/A"}
                </TableCell>
                <TableCell className="text-right font-semibold">{shift.project.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShiftsTable;
