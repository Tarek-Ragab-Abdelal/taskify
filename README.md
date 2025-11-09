# SimpleTask - React Native Task Manager

A minimalist Task Manager built with **React Native**, **TypeScript**, and **Expo**. This project demonstrates modern React Native development practices, focusing on **code quality**, **scalable architecture**, and **intuitive UX** while following **SOLID principles** and **clean code structure**.

## Features

### Core Functionality

- **Add Tasks**: Create tasks with titles and optional descriptions
- **Complete Tasks**: Mark tasks as complete with visual feedback
- **Delete Tasks**: Remove tasks with confirmation prompts
- **Task Management**: View all tasks in a clean, scrollable list
- **Persistent Storage**: Tasks are saved locally using AsyncStorage

### Enhanced UX Features

- **Tab Navigation**: Filter between All, Active, and Completed tasks
- **Smooth Animations**: LayoutAnimation for seamless transitions
- **Visual Feedback**: Instant response for all user interactions
- **Task Statistics**: Real-time counters for active and completed tasks
- **Clean Interface**: Native-like design with consistent theming
- **Form Validation**: Input validation with helpful error messages

## Architecture & Code Quality

### Design Principles

- **SOLID Principles**: Single responsibility, open/closed, and dependency inversion
- **DRY (Don't Repeat Yourself)**: Reusable components and utilities
- **Separation of Concerns**: Clear boundaries between UI, logic, and data layers
- **TypeScript First**: Strong typing throughout the application
- **Feature-Based Organization**: Modular folder structure for scalability

### Project Structure

```
src/
├── features/
│   └── tasks/
│       ├── components/           # UI Components
│       │   ├── TaskItem.tsx      # Individual task rendering
│       │   ├── TaskInput.tsx     # Task creation form
│       │   └── TaskList.tsx      # Task list container
│       ├── hooks/
│       │   └── useTasks.ts       # State management & business logic
│       ├── services/
│       │   └── taskService.ts    # Data persistence abstraction
│       ├── types/
│       │   └── Task.ts           # TypeScript interfaces
│       └── index.ts              # Feature exports
├── navigation/
│   ├── RootNavigator.tsx         # Main navigation container
│   └── TabNavigator.tsx          # Tab-based filtering
├── theme/
│   ├── colors.ts                 # Color palette & theming
│   └── typography.ts             # Font styles & spacing
├── utils/
│   └── index.ts                  # Shared utilities
└── App.tsx                       # Application entry point
```

## Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Storage**: AsyncStorage for local persistence
- **Animations**: React Native LayoutAnimation
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Architecture**: Custom hooks + Service layer pattern

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd taskify-chapter1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your device

## Usage

### Adding Tasks

1. Tap the input field at the top
2. Enter a task title (required)
3. Optionally tap the **+** button to add a description
4. Tap **Add Task** to save

### Managing Tasks

- **Complete**: Tap the checkbox or task content to toggle completion
- **Delete**: Tap the red **Delete** button (confirmation required)
- **Filter**: Use the tab bar to view All, Active, or Completed tasks

### Task Statistics

The header displays real-time counters:

- Total number of tasks
- Active (incomplete) tasks
- Completed tasks

## Code Quality Features

### TypeScript Integration

- Comprehensive type definitions for all data models
- Strict typing with interfaces and type guards
- Generic types for reusable components

### State Management

- Custom `useTasks` hook encapsulates all task-related logic
- Optimistic updates with error handling
- Efficient re-rendering with React.memo and useCallback

### Data Layer Abstraction

- `TaskService` class provides clean API for data operations
- Easy to extend for REST API or GraphQL integration
- Validation logic separated from UI components

### Performance Optimizations

- FlatList with optimized rendering for large task lists
- LayoutAnimation for smooth, native-feeling transitions
- Proper key extraction and item layout calculations

## Scalability & Future Enhancements

The architecture supports easy extension for:

### Backend Integration

- Replace TaskService AsyncStorage calls with API endpoints
- Add authentication and user management
- Sync tasks across devices

### Enhanced Features

- Task categories and tags
- Due dates and reminders
- Priority levels
- Search and advanced filtering
- Dark mode support
- Offline-first synchronization

### UI/UX Improvements

- Swipe gestures for quick actions
- Drag and drop reordering
- Rich text descriptions
- File attachments
- Custom themes

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

- Unit tests for utility functions
- Hook testing with React Testing Library
- Component testing with proper mocking
- Service layer testing for data operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for public APIs

## Performance Considerations

- **Memory Usage**: Efficient task storage with minimal memory footprint
- **Rendering**: Optimized FlatList with proper virtualization
- **Animations**: Hardware-accelerated LayoutAnimation
- **Storage**: Batched AsyncStorage operations for better performance

## Browser/Platform Support

- **iOS**: iOS 11.0+
- **Android**: API Level 21+ (Android 5.0)
- **Web**: Modern browsers with Expo Web

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Expo team for the excellent development platform
- React Native community for comprehensive documentation
- TypeScript team for making JavaScript development more robust

---

**SimpleTask** demonstrates enterprise-level React Native development practices in a clean, maintainable codebase that's ready for production deployment and future feature additions.
