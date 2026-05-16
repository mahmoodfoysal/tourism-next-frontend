import BookingManagement from "@/components/pages/BookingManagement";

export default function CompletedBookings() {
  return <BookingManagement targetStatus={["C", "CR"]} title="Completed Bookings" />;
}
