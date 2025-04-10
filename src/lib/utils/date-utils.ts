import moment from "moment";

export const formatDate = (date: Date) =>
  moment(date).format("D-MMM, YYYY, HH:mm");
