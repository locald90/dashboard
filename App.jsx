import React, { useMemo, useState } from 'react';
import {
  Search, CalendarDays, Newspaper, StickyNote, ChevronRight, ChevronLeft,
  ChevronDown, MoreHorizontal, UserRound, Moon, Sun, Bell, Settings,
  CircleHelp, ClipboardList, Paperclip, CheckCircle2, Clock3, AlertCircle,
  X, LayoutDashboard, Plus, ArrowUpRight
} from 'lucide-react';

const initialColumns = [
  { id: 'new', title: 'Новые заявки', count: 3, tone: 'blue', status: 'Новая' },
  { id: 'work', title: 'В работе', count: 4, tone: 'orange', status: 'В работе' },
  { id: 'waiting', title: 'Ожидает ответа', count: 3, tone: 'purple', status: 'Ожидает ответа' },
  { id: 'done', title: 'Закрыты сегодня', count: 3, tone: 'green', status: 'Готова' },
  { id: 'late', title: 'Просроченные', count: 6, tone: 'red', status: 'Срочно' }
];

const initialTasks = [
  { id: 1, status: 'Новая', company: 'Cybsparkle', title: 'Разработка новой дизайн-системы', phone: '+1 (234) 567-89-10' },
  { id: 2, status: 'В работе', company: 'Cybsparkle', title: 'Разработка новой дизайн-системы', phone: '+1 (234) 567-89-10' },
  { id: 3, status: 'Ожидает ответа', company: 'Cybsparkle', title: 'Разработка новой дизайн-системы', phone: '+1 (234) 567-89-10' },
  { id: 4, status: 'Готова', company: 'Cybsparkle', title: 'Разработка новой дизайн-системы', phone: '+1 (234) 567-89-10' },
  { id: 5, status: 'Срочно', company: 'Cybsparkle', title: 'Разработка новой дизайн-системы', phone: '+1 (234) 567-89-10' }
];

const people = ['Елизавета Тарасова', 'Сергей Гурелёв', 'Виталий Кутасевич', 'Анастасия Холодная'];
const actionDescriptions = [
  'Создана новая заявка',
  'Изменён статус обращения',
  'Назначен новый исполнитель',
  'Добавлен комментарий'
];
const taskNames = [
  'Проверить заявку №1024',
  'Проработать просроченные обращения',
  'Ответить на обращение клиента'
];

const toneByStatus = {
  'Новая': 'blue',
  'В работе': 'orange',
  'Ожидает ответа': 'purple',
  'Готова': 'green',
  'Срочно': 'red'
};

function Pill({ tone = 'blue', children, icon }) {
  return <span className={`pill ${tone}`}>{icon}{children}</span>;
}

function Avatar({ small = false }) {
  return <span className={`avatar ${small ? 'avatar-small' : ''}`}><UserRound size={small ? 13 : 17} /></span>;
}

function Pager({ pages = 3 }) {
  const [page, setPage] = useState(1);
  return (
    <div className="pager">
      <button aria-label="Предыдущая страница" onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft size={14} /></button>
      {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 3).map(n => (
        <button key={n} className={page === n ? 'current' : ''} onClick={() => setPage(n)}>{n}</button>
      ))}
      <button aria-label="Следующая страница" onClick={() => setPage(Math.min(pages, page + 1))}><ChevronRight size={14} /></button>
    </div>
  );
}

function SummaryCard({ item, onClick }) {
  return (
    <button className={`summary-card ${item.tone}`} onClick={onClick}>
      <span className="summary-count">{item.count}</span>
      <span className="summary-title">{item.title}</span>
      <span className="details"><CircleHelp size={12} /> Подробнее</span>
      <span className="summary-foot">450/450</span>
    </button>
  );
}

function RequestCard({ task, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const tone = toneByStatus[task.status] || 'blue';
  const nextStatus = task.status === 'Новая' ? 'В работе'
    : task.status === 'В работе' ? 'Ожидает ответа'
    : task.status === 'Ожидает ответа' ? 'Готова'
    : 'В работе';

  return (
    <article className="request-card">
      <div className="card-top">
        <Pill tone={tone}><span className="status-dot" />{task.status}</Pill>
        <button className="icon-button" aria-label="Дополнительные действия" onClick={() => setExpanded(!expanded)}>
          <MoreHorizontal size={17} />
        </button>
      </div>
      <div className="person-row"><Avatar /><b>{task.company}</b></div>
      <p className="request-description"><strong>Задача:</strong> {task.title}</p>
      <p className="request-phone"><strong>Контакты:</strong> {task.phone}</p>
      <div className="updated">Обновлено сегодня</div>
      {expanded && (
        <div className="expanded-info">
          <div>Исполнитель: Команда поддержки</div>
          <div>Приоритет: Стандартный</div>
        </div>
      )}
      <div className="card-actions">
        <button className="action-primary" onClick={() => onStatusChange(task.id, nextStatus)}>
          <Paperclip size={12} /> Кнопка
        </button>
        <button className="action-secondary" onClick={() => setExpanded(!expanded)}>
          <Paperclip size={12} /> Кнопка
        </button>
      </div>
    </article>
  );
}

function Sidebar() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('Задачи');
  const [showAll, setShowAll] = useState(false);
  const links = [
    ['Задачи', ClipboardList], ['Новости', Newspaper],
    ['Заметки', StickyNote], ['Другое', ChevronDown]
  ];

  return (
    <aside className="sidebar panel">
      <div className="search-box">
        <Search size={14} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Создать" aria-label="Поиск" />
        {query && <button onClick={() => setQuery('')} aria-label="Очистить поиск"><X size={13} /></button>}
      </div>
      <div className="result-label">Найдено 10 результатов:</div>
      <nav className="quick-links">
        {links.map(([label, Icon]) => (
          <button key={label} className={active === label ? 'selected' : ''} onClick={() => setActive(label)}>
            <Icon size={13} />{label}
          </button>
        ))}
      </nav>

      <div className="feed-heading"><Pill tone="orange">Ожидает</Pill><MoreHorizontal size={15} /></div>
      <div className="feed-card blue-feed"><b>Создать разработку Дизайн системы за июнь</b></div>

      <div className="feed-heading"><Pill tone="green">Выполнено 29.06.25</Pill><MoreHorizontal size={15} /></div>
      <div className="feed-card">Создать 5 заявок Можай до конца июня.</div>

      <div className="feed-heading"><Pill tone="blue">Новости</Pill><MoreHorizontal size={15} /></div>
      <div className="feed-card news-card">
        <b>Плановые технические работы:</b><br />
        Сообщаем, что в ночь с пятницы на субботу, 15–16 июня 2026 года, на нашей платформе пройдут плановые технические работы. Приносим извинения за временные неудобства.
        <small>Обновлено 15.06.26</small>
      </div>
      {showAll && <div className="feed-card">Новые материалы и обновления системы.</div>}
      <button className="open-all" onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Свернуть' : 'Открыть все'} <ChevronRight size={13} />
      </button>
    </aside>
  );
}

function RecentActivity() {
  const [page, setPage] = useState(1);
  return (
    <section className="bottom-panel activity-panel">
      <h2>Последние действия</h2>
      <div className="activity-list">
        {people.map((person, i) => (
          <div className="activity-item" key={person}>
            <Avatar />
            <div className="activity-copy"><b>{person}</b><span>{actionDescriptions[i]}</span></div>
            <button className="icon-button" aria-label="Действия"><MoreHorizontal size={16} /></button>
          </div>
        ))}
      </div>
      <div className="pager">
        <button onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft size={14} /></button>
        {[1, 2, '…', 20].map(n => <button key={n} className={page === n ? 'current' : ''} onClick={() => typeof n === 'number' && setPage(n)}>{n}</button>)}
        <button onClick={() => setPage(Math.min(20, page + 1))}><ChevronRight size={14} /></button>
      </div>
    </section>
  );
}

function MyTasks() {
  const [checked, setChecked] = useState([]);
  return (
    <section className="bottom-panel my-tasks-panel">
      <h2>Мои задачи</h2>
      <div className="my-task-list">
        {taskNames.map((name, i) => (
          <button className={`my-task ${checked.includes(i) ? 'task-done' : ''}`} key={name} onClick={() => setChecked(old => old.includes(i) ? old.filter(x => x !== i) : [...old, i])}>
            <Pill tone={i === 1 ? 'red' : 'orange'}>{i === 1 ? 'Срочно' : 'В работе'}</Pill>
            <span>{name}</span>
            {checked.includes(i) && <CheckCircle2 className="task-check" size={14} />}
          </button>
        ))}
      </div>
      <Pager pages={3} />
    </section>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('dashboard-theme') === 'dark';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('dashboard-theme', dark ? 'dark' : 'light');
    } catch {
      // Тема продолжит работать в рамках текущего сеанса, даже если storage недоступен.
    }
  }, [dark]);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [filter, setFilter] = useState('Все');
  const [showCreate, setShowCreate] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = useMemo(() => filter === 'Все' ? tasks : tasks.filter(t => t.status === filter), [tasks, filter]);

  const updateStatus = (id, status) => {
    setTasks(current => current.map(task => task.id === id ? { ...task, status } : task));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks(current => [...current, {
      id: Date.now(), status: 'Новая', company: 'Cybsparkle',
      title: newTaskTitle.trim(), phone: '+1 (234) 567-89-10'
    }]);
    setNewTaskTitle('');
    setShowCreate(false);
    setFilter('Все');
  };

  return (
    <main className={`app-shell ${dark ? 'dark' : ''}`}>
      <div className="dashboard">
        <Sidebar />

        <section className="main-content">
          <header className="topbar">
            <nav className="main-nav">
              {[
                ['Заявки', ClipboardList], ['Dashboard', LayoutDashboard],
                ['Новости', Newspaper], ['Заметки', StickyNote]
              ].map(([label, Icon]) => (
                <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => setActiveNav(label)}>
                  <Icon size={13} />{label}
                </button>
              ))}
            </nav>
            <div className="top-actions">
              <button className="round-button theme-toggle" onClick={() => setDark(!dark)} aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"} title={dark ? "Светлая тема" : "Тёмная тема"}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
              <button className="round-button" aria-label="Настройки"><Settings size={15} /></button>
              <button className="round-button" aria-label="Уведомления"><Bell size={15} /></button>
              <button className="round-button user-button" aria-label="Профиль"><UserRound size={15} /></button>
            </div>
          </header>

          <section className="summary-grid">
            {initialColumns.slice(0, 3).map(item => (
              <SummaryCard key={item.id} item={item} onClick={() => setFilter(item.status)} />
            ))}
          </section>

          <section className="request-grid" aria-label="Карточки заявок">
            {filteredTasks.map(task => <RequestCard key={task.id} task={task} onStatusChange={updateStatus} />)}
            {filteredTasks.length === 0 && <div className="empty-state">В этой категории пока нет заявок.</div>}
          </section>
          <div className="grid-pagers">
            <Pager pages={3} /><Pager pages={3} /><Pager pages={3} />
          </div>

          <section className="summary-grid lower-summaries">
            {initialColumns.slice(3).map(item => (
              <SummaryCard key={item.id} item={item} onClick={() => setFilter(item.status)} />
            ))}
          </section>
          <div className="grid-pagers lower-pagers"><Pager pages={3} /><Pager pages={3} /></div>

          <section className="bottom-area">
            <RecentActivity />
            <MyTasks />
            <button className="back-to-work" onClick={() => { setFilter('В работе'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <AlertCircle size={16} /> Вернуться к работе
            </button>
          </section>
        </section>
      </div>

      <button className="floating-add" onClick={() => setShowCreate(true)} aria-label="Создать заявку"><Plus size={19} /></button>

      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <form className="create-modal" onSubmit={addTask} onClick={e => e.stopPropagation()}>
            <div className="modal-heading"><h2>Новая заявка</h2><button type="button" className="icon-button" onClick={() => setShowCreate(false)}><X size={18} /></button></div>
            <label htmlFor="task-title">Название задачи</label>
            <input id="task-title" autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Например, подготовить макет" />
            <div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowCreate(false)}>Отмена</button><button className="submit-button" type="submit">Создать заявку</button></div>
          </form>
        </div>
      )}
    </main>
  );
}
