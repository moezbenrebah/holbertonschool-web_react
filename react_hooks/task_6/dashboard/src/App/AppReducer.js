export const APP_ACTIONS = {
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	TOGGLE_DRAWER: 'TOGGLE_DRAWER',
	MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ'
};

export const initialState = {
	displayDrawer: true,
	user: {
		email: '',
		password: '',
		isLoggedIn: false,
	},
	notifications: []
}

export default function appReducer(state = initialState, action) {
	switch (action.type) {
		case APP_ACTIONS.LOGIN:
			return {
				...state,
				user: {
					email: action.payload.email,
					password: action.payload.password,
					isLoggedIn: true
				}
			};

		case APP_ACTIONS.LOGOUT:
			return {
				...state,
				user: {
					email: '',
					password: '',
					isLoggedIn: false
				}
			};

		case APP_ACTIONS.TOGGLE_DRAWER:
			return {
				...state,
				displayDrawer: !state.displayDrawer
			};

		case APP_ACTIONS.MARK_NOTIFICATION_READ:
			return {
				...state,
				notifications: state.notifications.filter(
					notification => notification.id !== action.payload
				)
			};

		default:
			return state;
	}
}
