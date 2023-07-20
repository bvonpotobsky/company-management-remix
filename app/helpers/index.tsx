export const getNameInitials = (fullName: string) => {
  const names = fullName.split(" ");

  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");

  return initials;
};
