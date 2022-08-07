const filterList = [
  'all',
  'mine',
  'development',
  'sales',
  'design',
  'marketing',
];

export default function ProjectFilter({ currentFilter, updateFilter }) {
  const handleClick = (newFilter) => {
    updateFilter(newFilter);
  };

  return (
    <div className="project-filter">
      <nav>
        <p>Filter by:</p>
        {filterList.map((f) => (
          <button
            key={f}
            onClick={() => handleClick(f)}
            className={currentFilter === f ? 'active' : ''}
          >
            {f}
          </button>
        ))}
      </nav>
    </div>
  );
}
