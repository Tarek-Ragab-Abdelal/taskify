Task Manager

A small React Native task manager built with Expo and TypeScript. The app focuses on simple, smooth task management: add and edit tasks, set due dates and tags, filter by tag or status, and switch between light and dark themes with adjustable font sizes.

Technologies

- Expo
- React Native
- TypeScript
- @react-native-async-storage/async-storage (local persistence)
- react-native-gesture-handler
- react-native-reanimated

Key features

- Add new task
- Select due dates for tasks
- Assign and select tags for tasks
- Filter tasks by tag
- Smooth transitions when toggling a task between complete and active
- Filter tasks by status (all / active / completed)
- Edit existing tasks
- Delete a single task
- Delete all tasks at once
- Dark theme support
- Three font size options

Quick start

1. Clone the repository:

```powershell
git clone https://github.com/Tarek-Ragab-Abdelal/taskify
cd "task-manager"
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server (Expo):

```powershell
npm start
```

4. Test on a device with Expo Go

- Install Expo Go on your device:
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
  - iOS: https://apps.apple.com/app/expo-go/id982107779
- Open Expo Go and scan the QR code from the Metro/Expo DevTools, or use the emulator options shown by `npm start` (press `a` for Android or `i` for iOS when available).

Project structure

Top-level

- `App.tsx`, `index.ts` — app entry points
- `package.json`, `tsconfig.json`, `app.json` — project and Expo configuration

Source (`src/`)

- `components/` — reusable UI components and bottom sheets (Add/Edit task, DateTime picker, Settings)
- `features/tasks/` — task feature module:
  - `components/` — TaskInput, TaskItem, TaskList
  - `hooks/` — `useTasks.ts` (state and logic)
  - `services/` — `taskService.ts`, `tagService.ts` (persistence, tag helpers)
  - `types/` — Task types
- `navigation/` — app navigation (Root and Tab navigators)
- `theme/` — colors, typography, theme context and helpers
- `utils/` — utility functions

Notes

- This project uses Expo for development and testing. Use the Expo Go app to quickly test on physical devices.
