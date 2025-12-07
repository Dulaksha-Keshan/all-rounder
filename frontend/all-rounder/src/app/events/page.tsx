import { Events } from './_data/events';
import EventsClient from './_components/EventsClient';


export default function EventsPage() {
  return <EventsClient events={Events} />;
}