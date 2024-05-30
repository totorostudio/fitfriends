import { Helmet } from "react-helmet-async";
import { AppRoute, DEFAULT_ITEMS_LIMIT } from "../../const";
import { GoBack, Header, TrainingCard, TrainingFilter } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getCoachTrainings, getUser } from "../../store/selectors";
import { fetchTrainingsAction } from "../../store/api-actions";
import { useEffect, useState } from "react";
import { Training } from "../../types";
import { clearEmptyFields } from "../../utils";

export interface Filter {
  priceFrom?: number;
  priceTo?: number;
  caloriesFrom?: number;
  caloriesTo?: number;
}

export function MyTrainingsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const data = useAppSelector((getCoachTrainings));
  const trainings: Training[] = data?.trainings || [];
  const totalItems = data?.totalItems || 0;
  const [visibleItems, setVisibleItems] = useState<number>(DEFAULT_ITEMS_LIMIT);
  const [filter, setFilter] = useState<Filter>({
    priceFrom: 0,
    priceTo: 50000,
    caloriesFrom: 0,
    caloriesTo: 5000,
  }); //TODO бэкенд должен прислать максимумы + переделать rating, тоже должно быть 2 значения

  if (!user || !user.id) {
    return <div>Loading user data...</div>;
  }

  useEffect(() => {
    const cleanFilter = clearEmptyFields<Filter>(filter);
    if (user && user.id) {
      dispatch(fetchTrainingsAction({ storeName: 'coach', limit: visibleItems, coachId: user.id, ...cleanFilter }));
    }
  }, [dispatch, filter, user, user.id, visibleItems]);

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + DEFAULT_ITEMS_LIMIT);
  };

  return (
    <div className="wrapper">
      <Helmet>
        <title>Мои тренировки — FitFriends</title>
      </Helmet>
      <Header />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Мои тренировки</h1>
              <div className="my-training-form">
                <h2 className="visually-hidden">Мои тренировки Фильтр</h2>
                <div className="my-training-form__wrapper">
                  <GoBack url={AppRoute.AccountCoach} />
                  <h3 className="my-training-form__title">фильтры</h3>
                  <TrainingFilter filter={filter} setFilter={setFilter} />
                </div>
              </div>
              <div className="inner-page__content">
                <div className="my-trainings">
                  <ul className="my-trainings__list">
                    {trainings.map((training) => (
                      <li key={training.id} className="my-trainings__item">
                        <TrainingCard training={training} />
                      </li>
                    ))}
                  </ul>
                  <div className="show-more my-trainings__show-more">
                    {visibleItems < totalItems &&
                      <button
                        className="btn show-more__button show-more__button--more"
                        type="button"
                        onClick={handleLoadMore}
                      >
                        Показать еще
                      </button>
                    }
                      <button className="btn show-more__button show-more__button--to-top" type="button">Вернуться в начало</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

