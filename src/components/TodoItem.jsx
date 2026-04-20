/* Bu component listeleme işlemini temsil eder */
const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <li className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
        <span className={todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
          {todo.text}
        </span>
      </div>
      <div className="flex gap-2 text-sm font-medium">
        <button onClick={() => onEdit(todo)} className="text-amber-600">Düzenle</button>
        <button onClick={() => onDelete(todo.id)} className="text-red-500">Sil</button>
      </div>
    </li>
  );
};
export default TodoItem;