// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { getLatestNotification } from './src/utils/utils';

// // incorrect initial state
// const initialState = {
//   notifications: [],
//   displayDrawer: true,
// };

// const API_BASE_URL = 'http://localhost:5173';
// const ENDPOINTS = {
//   notifications: `${API_BASE_URL}/notifications.json`,
// };

// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async () => {
//     const response = await axios.get(ENDPOINTS.notifications);
//     const latestNotif = {
//       id: 3,
//       type: 'urgent',
//       html: { __html: getLatestNotification() },
//     };

//     const currentNotifications = response.data.notifications;
//     const indexToReplace = currentNotifications.findIndex(
//       (notification) => notification.id === 3
//     );

//     const updatedNotifications = [...currentNotifications];
//     if (indexToReplace !== -1) {
//       updatedNotifications[indexToReplace] = latestNotif;
//     } else {
//       updatedNotifications.push(latestNotif);
//     }

//     return updatedNotifications;
//   }
// );

// const notificationsSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     markNotificationAsRead: (state, action) => {
//       const notificationId = action.payload;
//       state.notifications = state.notifications.filter(
//         (notification) => notification.id !== notificationId
//       );
//     },
//     showDrawer: (state) => {
//       state.displayDrawer = true;
//     },
//     hideDrawer: (state) => {
//       state.displayDrawer = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchNotifications.fulfilled, (state, action) => {
//       state.notifications = action.payload;
//     });
//   },
// });

// export const { markNotificationAsRead, showDrawer, hideDrawer } = notificationsSlice.actions;
// export default notificationsSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { getLatestNotification } from './src/utils/utils';

// const initialState = {
//   notifications: [],
//   displayDrawer: true,
// };

// const API_BASE_URL = 'http://localhost:5173';
// const ENDPOINTS = {
//   notifications: `${API_BASE_URL}/notifications.json`,
// };

// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async () => {
//     const response = await axios.get(ENDPOINTS.notifications);
//     const latestNotif = {
//       id: 3,
//       type: 'urgent',
//       html: { __html: getLatestNotification() },
//     };

//     const currentNotifications = response.data.notifications;
//     const indexToReplace = currentNotifications.findIndex(
//       (notification) => notification.id === 3
//     );

//     const updatedNotifications = [...currentNotifications];
//     if (indexToReplace !== -1) {
//       updatedNotifications[indexToReplace] = latestNotif;
//     } else {
//       updatedNotifications.push(latestNotif);
//     }

//      // incorrect: returns an empty array instead of updatedNotifications
//     return [];
//   }
// );

// const notificationsSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     markNotificationAsRead: (state, action) => {
//       const notificationId = action.payload;
//       state.notifications = state.notifications.filter(
//         (notification) => notification.id !== notificationId
//       );
//     },
//     showDrawer: (state) => {
//       state.displayDrawer = true;
//     },
//     hideDrawer: (state) => {
//       state.displayDrawer = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchNotifications.fulfilled, (state, action) => {
//       state.notifications = action.payload;
//     });
//   },
// });

// export const { markNotificationAsRead, showDrawer, hideDrawer } = notificationsSlice.actions;
// export default notificationsSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { getLatestNotification } from './src/utils/utils';

// const initialState = {
//   notifications: [],
//   displayDrawer: true,
// };

// const API_BASE_URL = 'http://localhost:5173';
// const ENDPOINTS = {
//   notifications: `${API_BASE_URL}/notifications.json`,
// };

// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async () => {
//     const response = await axios.get(ENDPOINTS.notifications);
//     const latestNotif = {
//       id: 3,
//       type: 'urgent',
//       html: { __html: getLatestNotification() },
//     };

//     const currentNotifications = response.data.notifications;
//     const indexToReplace = currentNotifications.findIndex(
//       (notification) => notification.id === 3
//     );

//     const updatedNotifications = [...currentNotifications];
//     if (indexToReplace !== -1) {
//       updatedNotifications[indexToReplace] = latestNotif;
//     } else {
//       updatedNotifications.push(latestNotif);
//     }

//     return updatedNotifications;
//   }
// );

// const notificationsSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     markNotificationAsRead: (state, action) => {
//       const notificationId = action.payload;
//       state.notifications = state.notifications.filter(
//          // incorrect: keeps the notification instead of removing it
//         (notification) => notification.id === notificationId
//       );
//     },
//     showDrawer: (state) => {
//       state.displayDrawer = true;
//     },
//     hideDrawer: (state) => {
//       state.displayDrawer = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchNotifications.fulfilled, (state, action) => {
//       state.notifications = action.payload;
//     });
//   },
// });

// export const { markNotificationAsRead, showDrawer, hideDrawer } = notificationsSlice.actions;
// export default notificationsSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { getLatestNotification } from './src/utils/utils';

// const initialState = {
//   notifications: [],
//   displayDrawer: true,
// };

// const API_BASE_URL = 'http://localhost:5173';
// const ENDPOINTS = {
//   notifications: `${API_BASE_URL}/notifications.json`,
// };

// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async () => {
//     const response = await axios.get(ENDPOINTS.notifications);
//     const latestNotif = {
//       id: 3,
//       type: 'urgent',
//       html: { __html: getLatestNotification() },
//     };

//     const currentNotifications = response.data.notifications;
//     const indexToReplace = currentNotifications.findIndex(
//       (notification) => notification.id === 3
//     );

//     const updatedNotifications = [...currentNotifications];
//     if (indexToReplace !== -1) {
//       updatedNotifications[indexToReplace] = latestNotif;
//     } else {
//       updatedNotifications.push(latestNotif);
//     }

//     return updatedNotifications;
//   }
// );

// const notificationsSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     markNotificationAsRead: (state, action) => {
//       const notificationId = action.payload;
//       state.notifications = state.notifications.filter(
//         (notification) => notification.id !== notificationId
//       );
//     },
//     showDrawer: (state) => {
//       // incorrect: sets displayDrawer to false instead of true
//       state.displayDrawer = true; 
//     },
//     hideDrawer: (state) => {
//       state.displayDrawer = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchNotifications.fulfilled, (state, action) => {
//       state.notifications = action.payload;
//     });
//   },
// });

// export const { markNotificationAsRead, showDrawer, hideDrawer } = notificationsSlice.actions;
// export default notificationsSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getLatestNotification } from './src/utils/utils';

const initialState = {
  notifications: [],
  displayDrawer: true,
};

const API_BASE_URL = 'http://localhost:5173';
const ENDPOINTS = {
  notifications: `${API_BASE_URL}/notifications.json`,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await axios.get(ENDPOINTS.notifications);
    const latestNotif = {
      id: 3,
      type: 'urgent',
      html: { __html: getLatestNotification() },
    };

    const currentNotifications = response.data.notifications;
    const indexToReplace = currentNotifications.findIndex(
      (notification) => notification.id === 3
    );

    const updatedNotifications = [...currentNotifications];
    if (indexToReplace !== -1) {
      updatedNotifications[indexToReplace] = latestNotif;
    } else {
      updatedNotifications.push(latestNotif);
    }

    return updatedNotifications;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(
         // incorrect: keeps the notification instead of removing it
        (notification) => notification.id === notificationId
      );
    },
    showDrawer: (state) => {
      state.displayDrawer = true;
    },
    hideDrawer: (state) => {
      state.displayDrawer = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
  },
});

export const { markNotificationAsRead, showDrawer, hideDrawer } = notificationsSlice.actions;
export default notificationsSlice.reducer;