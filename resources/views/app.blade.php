<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CRM Рестораны — Дашборд</title>

    <!-- Font Awesome -->
    <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            rel="stylesheet"
    />
    <!-- Google Fonts -->
    <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
    />
    <style>
        :root {
            --sidebar-width: 280px;
        }
        body { background-color: #f6f7fb!important; }

        /* Layout */
        .app-wrapper { display: grid; grid-template-columns: var(--sidebar-width) 1fr; min-height: 100vh; }
        .app-sidebar { width: var(--sidebar-width); border-right: 1px solid rgba(0,0,0,.06); }
        .app-main { min-width: 0; }

        /* Sidebar */
        .app-brand { padding: 1rem 1.25rem; }
        .app-brand .logo { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg,#7952b3,#4e8ef7); display:inline-flex; align-items:center; justify-content:center; color:#fff; font-weight:700; margin-right:.75rem; }
        .sidebar-heading { font-size: .72rem; letter-spacing:.08em; text-transform:uppercase; color:#6c757d; padding: .75rem 1.25rem 0; }

        /* Spacing between icon and text (fix for your note) */
        .list-group-item .bi { font-size: 1.1rem; margin-right: .75rem; }

        .list-group-item.active,
        .list-group-item.active:hover { background-color:#f0ecff; color:#563d7c; border-color:#e7e0ff; }

        /* Topbar */
        .topbar { background:#fff; border-bottom:1px solid rgba(0,0,0,.06); position:sticky; top:0; z-index:1020; }

        /* Cards */
        .kpi-card .kpi-label { color:#6c757d; font-size:.85rem; }
        .kpi-card .kpi-value { font-weight:700; font-size:1.35rem; }
        .kpi-trend { font-size:.85rem; }

        /* Table */
        .table thead th { background:#fafbff; border-bottom:1px solid rgba(0,0,0,.06); }

        /* Mobile */
        @media (max-width: 992px) {
            .app-wrapper { grid-template-columns: 1fr; }
            .app-sidebar { position: fixed; inset: 0 auto 0 0; transform: translateX(-100%); transition: transform .25s ease; z-index: 1040; }
            .app-sidebar.show { transform: translateX(0); }
            .sidebar-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.35); display:none; z-index:1030; }
            .sidebar-backdrop.show { display:block; }
        }
    </style>
  @viteReactRefresh
  @vite('resources/js/app.jsx')

</head>
<body>
    <div id="app"></div>
</body>
</html>
