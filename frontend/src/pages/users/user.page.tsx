import { useEffect } from "react";
import { CoachInfo, CustomerInfo } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getCoachTrainings, getUser } from "../../store/selectors";
import { fetchTrainingsAction, fetchUserAction } from "../../store/api-actions";
import { useParams } from "react-router-dom";
import { UserRole } from "../../types";

export function UserPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const trainingsData = useAppSelector((getCoachTrainings));
  const trainings = trainingsData?.trainings || [];

  useEffect(() => {
    if (id) {
      console.log('Страница тренировки с id:', id)
      dispatch(fetchUserAction(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchTrainingsAction({ storeName: 'coach', coachId: id }));
    }
  }, [dispatch, id]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <>
      {user.role === UserRole.Coach ? <CoachInfo user={user} trainings={trainings} /> : <CustomerInfo user={user} />}
    </>
  );
}
