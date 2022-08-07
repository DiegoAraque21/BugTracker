import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
// components
import Avatar from '../Avatar/Avatar';
// styles
import './OnlineUsers.css';

export default function OnlineUsers() {
  const { documents: users, error } = useCollection('users');
  const { user } = useAuthContext();

  return (
    <div className="user-list">
      <h2>All users</h2>
      {error && <div className="error">{error}</div>}
      {users &&
        users
          .filter((u) => user.uid !== u.id)
          .map((user) => (
            <div key={user.id} className="user-list-item">
              {user.online && <span className="online-user"></span>}
              <span>{user.displayName}</span>
              <Avatar photoURL={user.photoURL} />
            </div>
          ))}
    </div>
  );
}
