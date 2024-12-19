import { AuthedUserContext } from '../../App';
import { useContext } from 'react';

const Dashboard = ({}) => {
  const user = useContext(AuthedUserContext);
  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        Here you will see a list of your saved restaurants. 
      </p>
    </main>
  );
};

export default Dashboard;
