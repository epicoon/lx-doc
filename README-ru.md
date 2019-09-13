[English version (Английская версия)](https://github.com/epicoon/lx-doc/blob/master/README.md)

## Сервис `lx-doc` для lx-платформы

Содержит плагин визуализации документирования кода пакетов приложения.<br>
Можно добавить роут в настройках приложения:
```yaml
  routes:
    !doc: {service: lx/lx-doc, on-mode: dev}
```
Тогда страница документации будет доступна по пути `/doc/parser`.
