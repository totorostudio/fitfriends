import { Helmet } from "react-helmet-async";
import { AppRoute, DEFAULT_ITEMS_LIMIT } from "../../const";
import { GoBack, Header, TrainingCard, TrainingFilter } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getCatalogTrainings, getUser } from "../../store/selectors";
import { fetchTrainingsAction } from "../../store/api-actions";
import { useEffect, useState } from "react";
import { SortDirection, SortTrainings, SortType, Training, TrainingRequest, TrainingTime, UserRole } from "../../types";
import { clearEmptyFields } from "../../utils";

export interface Filter {
  priceFrom?: number;
  priceTo?: number;
  caloriesFrom?: number;
  caloriesTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  trainingTime?: TrainingTime[];
}

export function TrainingsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const data = useAppSelector((getCatalogTrainings));
  const trainings: Training[] = data?.trainings || [];
  const totalItems = data?.totalItems || 0;
  const minPrice = data?.minPrice || 0;
  const maxPrice = data?.maxPrice || 0;
  const minCalories = data?.minCalories || 0;
  const maxCalories = data?.maxCalories || 0;
  const [visibleItems, setVisibleItems] = useState<number>(DEFAULT_ITEMS_LIMIT);
  const [sort, setSort] = useState<SortTrainings>(SortTrainings.Default);
  const [filter, setFilter] = useState<Filter>({
    priceFrom: undefined,
    priceTo: undefined,
    caloriesFrom: undefined,
    caloriesTo: undefined,
    ratingFrom: 0,
    ratingTo: 5,
    trainingTime: [],
  });

  if (!user || !user.id) {
    return <div>Loading user data...</div>;
  }

  useEffect(() => {
    const cleanFilter = clearEmptyFields<Filter>(filter);
    if (user && user.id && user.role === UserRole.Coach) {
      dispatch(fetchTrainingsAction({ storeName: TrainingRequest.Catalog, limit: visibleItems, coachId: user.id, ...cleanFilter }));
    } else if (user && user.id && user.role === UserRole.Customer) {
      let sortType = SortType.Default;
      let sortDirection = SortDirection.Down;

      if (sort === SortTrainings.Cheap || sort === SortTrainings.Expensive) {
        sortType = SortType.Price;
      }

      if (sort === SortTrainings.Cheap) {
        sortDirection = SortDirection.Up;
      }

      dispatch(fetchTrainingsAction({ storeName: TrainingRequest.Catalog, limit: visibleItems, sort: sortDirection, sortType, ...cleanFilter }));
    }
  }, [dispatch, filter, user, user.id, visibleItems, sort]);

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
                  <TrainingFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    minCalories={minCalories}
                    maxCalories={maxCalories}
                    filter={filter}
                    setFilter={setFilter}
                    sort={sort}
                    setSort={setSort}
                    user={user}
                  />
                </div>
              </div>
              <div className="inner-page__content">
                <div className="my-trainings">
                  <ul className="my-trainings__list">
                    {trainings.length === 0 &&
                      <li className="my-trainings__item">
                        <div className="thumbnail-training">
                          <h3 className="thumbnail-training__title">Ничего нет</h3>
                        </div>
                      </li>
                    }
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

