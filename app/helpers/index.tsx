import type {ShiftCompleted} from "@prisma/client";

export const getNameInitials = (fullName: string) => {
  const names = fullName.split(" ");

  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");

  return initials;
};

export const calculateHoursWorked = (startTime: Date, endTime: Date) => {
  // Calculate the time difference in milliseconds
  const totalInMiliseconds = endTime.getTime() - startTime.getTime();

  return totalInMiliseconds;
};

export const getTotalHoursWorkedInInvoice = (shifts: ShiftCompleted[]) => {
  const totalWorkedInMiliseconds = shifts.reduce((acc, shift) => {
    const hoursWorked = calculateHoursWorked(new Date(shift.start), new Date(shift.end));

    return acc + hoursWorked;
  }, 0);

  const totalWorkedInHours = totalWorkedInMiliseconds / 1000 / 60 / 60;

  return totalWorkedInHours;
};

export const formatAsPrice = (num: number) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD",
  });
};

export const formatTime = ({milliseconds}: {milliseconds: number}) => {
  const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const seconds = Math.floor(milliseconds / 1000) % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
