import './Table.css';

export default function Table({ columns, data, onEdit, onDelete, emptyMessage = '暂无数据' }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.title}
              </th>
            ))}
            {(onEdit || onDelete) && <th style={{ width: '150px' }}>操作</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="action-cell">
                    {onEdit && (
                      <button className="btn-edit" onClick={() => onEdit(row)}>
                        编辑
                      </button>
                    )}
                    {onDelete && (
                      <button className="btn-delete" onClick={() => onDelete(row)}>
                        删除
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

