import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import ProjectSummary from './ProjectSummary';
// styles
import './Project.css';
import ProjectComments from './ProjectComments';

export default function Project() {
  const { id } = useParams();
  const { documents, error } = useDocument('projects', id);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!documents) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="project-details" style={{ marginTop: '3rem' }}>
      <ProjectSummary project={documents} />
      <ProjectComments project={documents} />
    </div>
  );
}
