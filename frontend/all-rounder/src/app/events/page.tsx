"use client";

import { useEventStore } from '@/context/useEventStore';
import EventsClient from './_components/EventsClient';

export default function EventsPage() {
  const { events } = useEventStore();

  return (
    <>
      <EventsClient events={events} />
    </>
  );
}