// styles
import './Avatar.css';

export default function Avatar({ photoURL }) {
  return (
    <div className="avatar">
      <img src={photoURL} alt="user avatar" />
    </div>
  );
}
