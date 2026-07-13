"use client";

import { useMemo, useState } from "react";

import { selectChannelManager, toggleChannelManager } from "./channel-routing.mjs";

type Availability = "free" | "lunch" | "break" | "offline";

type Manager = {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: Availability;
  assignedToday: number;
  lastAssignedMinute: number;
};

type Channel = "Telegram" | "WhatsApp" | "Instagram" | "MAX";

type Lead = {
  id: number;
  customer: string;
  channel: Channel;
  preview: string;
  wait: string;
  time: string;
};

type Assignment = {
  id: number;
  customer: string;
  channel: Lead["channel"];
  manager: string;
  time: string;
};

const INITIAL_MANAGERS: Manager[] = [
  {
    id: "panichkina",
    name: "Паничкина Елена",
    initials: "ЕП",
    color: "#dfe9ff",
    status: "free",
    assignedToday: 9,
    lastAssignedMinute: 639,
  },
  {
    id: "popkov",
    name: "Попков Сергей",
    initials: "СП",
    color: "#d9f2e7",
    status: "free",
    assignedToday: 8,
    lastAssignedMinute: 635,
  },
  {
    id: "turchina",
    name: "Шубина-Турчина Алина",
    initials: "АШ",
    color: "#ffeadb",
    status: "free",
    assignedToday: 8,
    lastAssignedMinute: 631,
  },
  {
    id: "pyankov",
    name: "Пьянков Николай",
    initials: "НП",
    color: "#eee3ff",
    status: "lunch",
    assignedToday: 7,
    lastAssignedMinute: 612,
  },
  {
    id: "sofonova",
    name: "Софонова Алёна",
    initials: "АС",
    color: "#ffe1e8",
    status: "offline",
    assignedToday: 5,
    lastAssignedMinute: 590,
  },
];

const CHANNELS: Channel[] = ["Telegram", "WhatsApp", "Instagram", "MAX"];

const INITIAL_CHANNEL_MANAGERS: Record<Channel, string[]> = {
  Telegram: ["panichkina", "popkov", "turchina"],
  WhatsApp: ["popkov"],
  Instagram: ["panichkina", "turchina"],
  MAX: ["turchina"],
};

const STATUS_NAMES: Record<Availability, string> = {
  free: "Свободен",
  lunch: "На обеде",
  break: "Перерыв",
  offline: "Офлайн",
};

const INITIAL_QUEUE: Lead[] = [
  {
    id: 1,
    customer: "Марина С.",
    channel: "Telegram",
    preview: "Здравствуйте! Подбираю нож мужу в подарок, сможете помочь?",
    wait: "1 мин",
    time: "10:41",
  },
  {
    id: 2,
    customer: "Дмитрий К.",
    channel: "WhatsApp",
    preview: "Подскажите, есть ли сейчас в наличии модель Шторм?",
    wait: "3 мин",
    time: "10:39",
  },
  {
    id: 3,
    customer: "Олег Р.",
    channel: "Instagram",
    preview: "Можно ли сделать гравировку и успеть к следующей пятнице?",
    wait: "5 мин",
    time: "10:37",
  },
];

const NEW_LEADS: Lead[] = [
  {
    id: 4,
    customer: "Антон Б.",
    channel: "MAX",
    preview: "Хочу подобрать универсальный нож для охоты. Что посоветуете?",
    wait: "только что",
    time: "10:43",
  },
  {
    id: 5,
    customer: "Екатерина Л.",
    channel: "Telegram",
    preview: "Добрый день! Есть подарочная упаковка и доставка по Москве?",
    wait: "только что",
    time: "10:44",
  },
  {
    id: 6,
    customer: "Роман П.",
    channel: "WhatsApp",
    preview: "Нужна консультация по стали и заточке перед заказом.",
    wait: "только что",
    time: "10:45",
  },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: 101, customer: "Ирина М.", channel: "Telegram", manager: "Паничкина Елена", time: "10:39" },
  { id: 102, customer: "Александр Г.", channel: "MAX", manager: "Шубина-Турчина Алина", time: "10:35" },
  { id: 103, customer: "Вадим Т.", channel: "WhatsApp", manager: "Попков Сергей", time: "10:31" },
  { id: 104, customer: "Наталья В.", channel: "Instagram", manager: "Паничкина Елена", time: "10:27" },
];

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function channelClass(channel: Lead["channel"]) {
  return `channel channel-${channel.toLowerCase()}`;
}

function managerCountLabel(count: number) {
  if (count === 1) return "1 менеджер";
  if (count >= 2 && count <= 4) return `${count} менеджера`;
  return `${count} менеджеров`;
}

export default function Home() {
  const [managers, setManagers] = useState(INITIAL_MANAGERS);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [clockMinute, setClockMinute] = useState(642);
  const [leadCursor, setLeadCursor] = useState(0);
  const [freshManager, setFreshManager] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel>("Telegram");
  const [channelManagers, setChannelManagers] = useState(INITIAL_CHANNEL_MANAGERS);

  const availableManagers = useMemo(
    () => managers.filter((manager) => manager.status === "free"),
    [managers],
  );

  const activeLead = queue[0] ?? null;

  const nextManagerId = useMemo(() => {
    if (!activeLead) return null;
    return selectChannelManager(
      channelManagers[activeLead.channel],
      availableManagers.map((manager) => manager.id),
      Object.fromEntries(managers.map((manager) => [manager.id, manager.lastAssignedMinute])),
    );
  }, [activeLead, availableManagers, channelManagers, managers]);

  const nextManager = managers.find((manager) => manager.id === nextManagerId) ?? null;
  const selectedManagerIds = channelManagers[selectedChannel];

  const assignedToday = managers.reduce((sum, manager) => sum + manager.assignedToday, 0);

  function distributeNext() {
    if (!nextManager || queue.length === 0) return;

    const lead = queue[0];
    const nextMinute = clockMinute + 1;
    setClockMinute(nextMinute);
    setQueue((current) => current.slice(1));
    setManagers((current) =>
      current.map((manager) =>
        manager.id === nextManager.id
          ? {
              ...manager,
              assignedToday: manager.assignedToday + 1,
              lastAssignedMinute: nextMinute,
            }
          : manager,
      ),
    );
    setAssignments((current) => [
      {
        id: Date.now(),
        customer: lead.customer,
        channel: lead.channel,
        manager: nextManager.name,
        time: formatTime(nextMinute),
      },
      ...current,
    ].slice(0, 6));
    setFreshManager(nextManager.id);
    window.setTimeout(() => setFreshManager(null), 900);
  }

  function addLead() {
    const nextLead = NEW_LEADS[leadCursor % NEW_LEADS.length];
    setLeadCursor((cursor) => cursor + 1);
    setQueue((current) => [...current, { ...nextLead, id: Date.now() }]);
  }

  function updateStatus(managerId: string, status: Availability) {
    setManagers((current) => current.map((manager) => (manager.id === managerId ? { ...manager, status } : manager)));
  }

  function toggleManagerForChannel(managerId: string) {
    setChannelManagers((current) => ({
      ...current,
      [selectedChannel]: toggleChannelManager(current[selectedChannel], managerId),
    }));
  }

  return (
    <main className="crm-shell">
      <aside className="sidebar">
        <div className="brand-mark">DK</div>
        <nav className="side-nav" aria-label="Основная навигация">
          <button className="nav-item" aria-label="Главная"><span>⌂</span></button>
          <button className="nav-item active" aria-label="Диалоги"><span>◌</span><b>3</b></button>
          <button className="nav-item" aria-label="Заказы"><span>▤</span></button>
          <button className="nav-item" aria-label="Клиенты"><span>♙</span></button>
          <button className="nav-item" aria-label="Аналитика"><span>⌁</span></button>
        </nav>
        <button className="nav-item nav-settings" aria-label="Настройки"><span>⚙</span></button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumbs"><span>Продажи</span><i>/</i><strong>Распределение диалогов</strong></div>
          <div className="top-actions">
            <button className="search-button" aria-label="Поиск">⌕</button>
            <button className="notification-button" aria-label="Уведомления">♢<b>2</b></button>
            <div className="profile-avatar">АЗ</div>
          </div>
        </header>

        <div className="content">
          <div className="title-row">
            <div>
              <h1>Распределение диалогов</h1>
              <p>Сегодня, 13 июля</p>
            </div>
            <div className="title-actions">
              <div className="work-status"><span className="pulse-dot" />08:00–22:00 · работает</div>
              <a className="channel-settings-link" href="#channel-rules">Каналы и менеджеры</a>
              <button className="secondary-button" onClick={addLead}><span>＋</span> Новый диалог</button>
            </div>
          </div>

          <section className="metric-grid" aria-label="Сводка">
            <article className="metric-card metric-primary">
              <span>В очереди</span>
              <strong>{queue.length}</strong>
              <small>{queue.length ? `Первый ждёт ${queue[0].wait}` : "Очередь пуста"}</small>
            </article>
            <article className="metric-card">
              <span>Свободны сейчас</span>
              <strong>{availableManagers.length}<em> / {managers.length}</em></strong>
              <small>online + статус «Свободен»</small>
            </article>
            <article className="metric-card">
              <span>Назначено сегодня</span>
              <strong>{assignedToday}</strong>
              <small>По каналу и статусу доступности</small>
            </article>
            <article className="metric-card next-card">
              <div>
                <span>Следующий по правилу</span>
                <strong>{nextManager ? nextManager.name : activeLead ? "Канал ожидает" : "Очередь пуста"}</strong>
                <small>
                  {activeLead && nextManager
                    ? `${activeLead.channel} · выбран для этого канала`
                    : activeLead
                      ? `Нет свободных получателей ${activeLead.channel}`
                      : "Нет новых обращений"}
                </small>
              </div>
              {nextManager && <div className="mini-avatar" style={{ background: nextManager.color }}>{nextManager.initials}</div>}
            </article>
          </section>

          <section className="main-grid">
            <article className="panel queue-panel">
              <header className="panel-header">
                <div>
                  <h2>Очередь</h2>
                  <span>Новые обращения</span>
                </div>
                <button className="dots-button" aria-label="Меню очереди">•••</button>
              </header>

              <div className="queue-list">
                {queue.length === 0 ? (
                  <div className="empty-state"><div>✓</div><strong>Все диалоги распределены</strong><span>Новые обращения появятся здесь</span></div>
                ) : queue.map((lead, index) => (
                  <div className={`lead-card ${index === 0 ? "lead-card-active" : ""}`} key={lead.id}>
                    <div className="lead-topline">
                      <div className="customer-avatar">{lead.customer.slice(0, 1)}</div>
                      <div className="lead-identity">
                        <strong>{lead.customer}</strong>
                        <span className={channelClass(lead.channel)}>{lead.channel}</span>
                      </div>
                      <time>{lead.time}</time>
                    </div>
                    <p>{lead.preview}</p>
                    <div className="lead-footer">
                      <span className={index === 0 ? "wait-alert" : "wait-normal"}><i />{lead.wait}</span>
                      {index === 0 && (
                        <button className="assign-button" onClick={distributeNext} disabled={!nextManager}>
                          {nextManager ? `Назначить ${nextManager.name.split(" ")[0]}` : "Нет доступного менеджера"}<span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel managers-panel">
              <header className="panel-header">
                <div>
                  <h2>Менеджеры</h2>
                  <span>{availableManagers.length} готовы принимать диалоги</span>
                </div>
                <div className="live-label"><i /> В реальном времени</div>
              </header>

              <div className="manager-head">
                <span>Менеджер</span><span>Сегодня</span><span>Статус</span>
              </div>
              <div className="manager-list">
                {managers.map((manager) => (
                  <div className={`manager-row ${freshManager === manager.id ? "manager-fresh" : ""}`} key={manager.id}>
                    <div className="manager-main">
                      <div className="manager-avatar" style={{ background: manager.color }}>
                        {manager.initials}
                        <i className={manager.status === "offline" ? "offline-dot" : "online-dot"} />
                      </div>
                      <div>
                        <strong>{manager.name}</strong>
                        <span>{manager.status === "offline" ? "Не в системе" : `Последний лид ${formatTime(manager.lastAssignedMinute)}`}</span>
                      </div>
                    </div>
                    <strong className="today-count">{manager.assignedToday}</strong>
                    <label className={`status-select status-${manager.status}`}>
                      <i />
                      <select
                        value={manager.status}
                        onChange={(event) => updateStatus(manager.id, event.target.value as Availability)}
                        aria-label={`Статус ${manager.name}`}
                      >
                        <option value="free">Свободен</option>
                        <option value="lunch">На обеде</option>
                        <option value="break">Перерыв</option>
                        <option value="offline">Офлайн</option>
                      </select>
                    </label>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="panel channel-routing-panel" id="channel-rules" aria-labelledby="channel-routing-title">
            <header className="panel-header channel-routing-header">
              <div>
                <h2 id="channel-routing-title">Распределение по каналам</h2>
                <span>Выберите одного или нескольких менеджеров для каждого канала</span>
              </div>
              <div className="rule-state">Изменения применяются сразу</div>
            </header>

            <div className="channel-routing-body">
              <div className="rule-group">
                <span className="rule-label">Канал</span>
                <div className="channel-chip-list" role="tablist" aria-label="Каналы обращений">
                  {CHANNELS.map((channel) => (
                    <button
                      className={`channel-rule-chip ${selectedChannel === channel ? "channel-rule-chip-active" : ""}`}
                      key={channel}
                      type="button"
                      role="tab"
                      aria-selected={selectedChannel === channel}
                      aria-controls="channel-manager-picker"
                      onClick={() => setSelectedChannel(channel)}
                    >
                      <span>
                        <strong>{channel}</strong>
                        <small>{managerCountLabel(channelManagers[channel].length)}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rule-group" id="channel-manager-picker" role="tabpanel">
                <div className="manager-picker-heading">
                  <div>
                    <span className="rule-label">Менеджеры</span>
                    <strong>{selectedChannel}</strong>
                  </div>
                  <span className="selected-count">
                    Выбрано: {selectedManagerIds.length}
                  </span>
                </div>

                <div className="manager-chip-list">
                  {managers.map((manager) => {
                    const isSelected = selectedManagerIds.includes(manager.id);
                    return (
                      <button
                        className={`manager-rule-chip ${isSelected ? "manager-rule-chip-selected" : ""}`}
                        key={manager.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleManagerForChannel(manager.id)}
                      >
                        <span className="manager-chip-name">{manager.name}</span>
                        <span className={`manager-chip-status chip-status-${manager.status}`}>
                          {STATUS_NAMES[manager.status]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="channel-rule-note">
                  <strong>
                    {selectedManagerIds.length === 1
                      ? "Все обращения канала идут выбранному менеджеру."
                      : "Обращения распределяются по кругу между выбранными менеджерами."}
                  </strong>
                  <span>Статусы «На обеде», «Перерыв» и «Офлайн» временно исключают менеджера. Последний выбранный чип отключить нельзя.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="panel history-panel">
            <header className="panel-header">
              <div>
                <h2>Последние назначения</h2>
                <span>Сегодня</span>
              </div>
              <button className="text-button">Все назначения <span>→</span></button>
            </header>
            <div className="history-table">
              <div className="history-head"><span>Клиент</span><span>Канал</span><span>Менеджер</span><span>Время</span><span /></div>
              {assignments.map((assignment, index) => (
                <div className={`history-row ${index === 0 && assignment.id > 1000 ? "history-new" : ""}`} key={assignment.id}>
                  <strong>{assignment.customer}</strong>
                  <span className={channelClass(assignment.channel)}>{assignment.channel}</span>
                  <span>{assignment.manager}</span>
                  <time>{assignment.time}</time>
                  <span className="assigned-status"><i /> Назначен</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
