import { getUsersById } from "$lib/api/user"
import { getUserCurrentWeekShifts,getUserCurrentMonthShiftsMetric } from "$lib/api/user"
import { authUserStore } from "$lib/stores/authUserStore"

export async function load({cookies}) {

    const token :string = cookies.get('auth_token') as string;
    
    const userId = authUserStore.getUserId();
    
    const apiUserResponse :Response = await getUsersById(token,userId);
    const user = await apiUserResponse.json();

    const apiUserCurrentWeekShiftsResponse :Response = await getUserCurrentWeekShifts(token,userId);
    const currentWeekShifts = await apiUserCurrentWeekShiftsResponse.json();

    const apiUserCurrentMonthShiftsMetricResponse :Response = await getUserCurrentMonthShiftsMetric(token,userId);
    const currentMonthShiftsMetric = await apiUserCurrentMonthShiftsMetricResponse.json();

    return {user,currentWeekShifts,currentMonthShiftsMetric};
}