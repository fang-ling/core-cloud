# `core-cloud`

`core-cloud` is a personal cloud service.

## Additional documentation

### Folder structures

#### web

```
core-cloud-web/src
├── app
├── models
│   ├── user.ts
│   └── ...
├── services
│   ├── user-service.ts
│   └── ...
├── views
│   ├── home/
│   │   ├── content-view.tsx
│   │   └── ...
│   ├── shared/
│   │   ├── toolbar/
│   │   └── ...
│   ├── shared-toolbar.tsx
│   ├── ...
│   ├── ui-image.tsx
│   └── ...
└── view-models
```

##### app

This is the file-system based router for Next.js.

##### models

The `models` folder is an ideal place to store classes and data transfer objects.

##### services

The `services` folder contains codes to handle communication between the web and the server.

##### views

The `views` folder contains the user interface codes.

By convention, codes are organized into subfolders by page, with `content-view.tsx` serving as the entry point. This excludes shared or pure components.
Shared components are prefixed with `shared-`, and may have sub-components stored in `views/shared/[group]`.
Pure components are prefixed with `ui-`.

##### view-models

This is where all of the application logic goes, closely aligned with `views` folder.
