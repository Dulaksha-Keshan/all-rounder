import { Events } from './_data/events';
import EventsClient from './_components/EventsClient';
import Footer from '../_components/Footer';


export default function EventsPage() {
  return <>
  <EventsClient events={Events} />
  <Footer/>
  </>
  ;
}