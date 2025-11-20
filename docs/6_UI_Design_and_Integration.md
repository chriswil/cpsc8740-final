# 6. User Interface Design and Integration Report

## Design Process

### Phase 1: Wireframing & Low-Fidelity
*   **Goal**: Establish the layout and information architecture without getting distracted by colors or details.
*   **Tools**: Figma (Conceptualization), Whiteboarding.
*   **Outcome**: Defined the core layout:
    *   **Sidebar/Header**: Navigation (Library, Dashboard).
    *   **Main Content Area**: Dynamic view based on selection.
    *   **Modals**: For focused tasks like Flashcards and Quizzes.

### Phase 2: High-Fidelity & Prototyping
*   **Goal**: Create a polished, user-friendly interface that feels modern and approachable.
*   **Design System**:
    *   **Typography**: Sans-serif fonts (Inter/System UI) for readability.
    *   **Color Palette**:
        *   Primary: Blue (`bg-blue-600`) for actions and brand identity.
        *   Secondary: Gray (`text-gray-500`) for metadata.
        *   Accents: Green/Red/Yellow for status and feedback (e.g., Quiz results).
    *   **Components**: Cards for documents, Modals for study tools, Buttons with hover states.

## Technologies Used

1.  **React.js**: The core library for building the UI.
    *   *Usage*: Component-based architecture (`DocumentList`, `FlashcardView`, `Dashboard`) allows for reusable and maintainable code.
2.  **Tailwind CSS**: A utility-first CSS framework.
    *   *Usage*: Rapid styling directly in JSX. Enabled easy implementation of responsive design (e.g., `grid-cols-1 md:grid-cols-3`).
3.  **Recharts**: A composable charting library.
    *   *Usage*: Rendering the "Weekly Progress" bar chart and "Activity Breakdown" pie chart in the Dashboard.
4.  **Lucide React / Heroicons**:
    *   *Usage*: Providing consistent, scalable SVG icons for the UI (Trash can, Flame, Clock, etc.).

## Integration Steps

1.  **Component Structure**:
    *   Created `App.jsx` as the main layout container.
    *   Built `DocumentList.jsx` to fetch and display documents from the backend API.
    *   Developed specialized views: `FlashcardView.jsx`, `QuizView.jsx`, `ChatInterface.jsx`.

2.  **State Management**:
    *   Used React's `useState` and `useEffect` hooks to manage local state (e.g., current flashcard index, chat history).
    *   Lifted state up to `App.jsx` for global concerns like the active tab ("Library" vs "Dashboard").

3.  **API Integration**:
    *   Connected frontend components to FastAPI endpoints using `fetch`.
    *   Implemented **Session Tracking**:
        *   `startSession` called on component mount.
        *   `endSession` called on component unmount using `fetch` with `keepalive: true` to ensure data reliability.

## Challenges & Solutions

*   **Challenge**: **State Synchronization**. Ensuring the Dashboard updates immediately after a study session.
    *   **Solution**: Implemented a refresh trigger mechanism or simply re-fetching data on component mount to ensure fresh stats.

*   **Challenge**: **Reliable Session Ending**. Browsers often kill requests when a tab closes or component unmounts.
    *   **Solution**: Switched from standard `fetch` to `navigator.sendBeacon` (and later `fetch` with `keepalive: true`) to guarantee the "End Session" signal reaches the backend.

*   **Challenge**: **Visualizing Empty States**. Charts look broken without data.
    *   **Solution**: Added conditional rendering to show helpful "No activity yet" messages or placeholder states when data is missing.

## Final UI Screenshots (Placeholders)
*   [Insert Screenshot: Main Document Library with Upload Zone]
*   [Insert Screenshot: Flashcard View in "Review Mode"]
*   [Insert Screenshot: Interactive Chat Interface]
*   [Insert Screenshot: Analytics Dashboard with Charts]
