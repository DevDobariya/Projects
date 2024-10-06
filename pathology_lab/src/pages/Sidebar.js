import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Sidebar({ setSelectedDate , selectedDate }){
  return (
    <div>
        <div> <h2> Current Date </h2> </div>
        <Calendar onChange={ newDate => setSelectedDate( newDate ) } value={ selectedDate } />
    </div>
  );
}

export default Sidebar;