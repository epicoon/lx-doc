[Russian version (Русская версия)](https://github.com/epicoon/lx-doc/blob/master/README-ru.md)

## Service `lx/doc` for lx-platform

It contains the plugin for application package code documentation visualization.<br>
You can add a route in the application configuration:
```yaml
  routes:
    !doc: {service: lx/doc, on-mode: dev}
```
Then the documentation page will be accessible via the path `/doc/parser`.
