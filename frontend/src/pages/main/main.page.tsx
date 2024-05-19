import { Helmet } from "react-helmet-async";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getFeaturedTrainings, getPopularTrainings, getRelatedTrainings, getUser, getUsers } from "../../store/selectors";
import { FullUser, Training, UserRole } from "../../types";
import { useEffect, useState } from "react";
import { fetchTrainingsAction, fetchUsersAction } from "../../store/api-actions";
import { FeaturedCards, Header, RelatedCard, TrainingCard, UserCard } from "../../components";
import './styles.css';

export function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const relatedData = useAppSelector((getRelatedTrainings));
  const featuredData = useAppSelector((getFeaturedTrainings));
  const popularData = useAppSelector((getPopularTrainings));
  const usersData = useAppSelector((getUsers));
  const relatedTrainings: Training[] = relatedData?.trainings || []; // TODO в бэкенде сделать вывод релевантных тренировок
  const featuredTrainings: Training[] = featuredData?.trainings || []; // TODO в бэкенде сделать вывод тренировок c флагом featured + поле "Старая цена"
  const popularTrainings: Training[] = popularData?.trainings || []; // TODO в бэкенде сделать вывод популярных тренировок
  const readyUsers: FullUser[] = usersData?.users || []; // TODO в бэкенде сделать вывод юзеров готовых к тренировке
  const [currentRelatedIndex, setCurrentRelatedIndex] = useState<number>(0);
  const [currentPopularIndex, setCurrentPopularIndex] = useState<number>(0);
  const [currentUsersIndex, setCurrentUsersIndex] = useState<number>(0);

  const RELATED_ITEMS = 9;
  const RELATED_VISIBLE_ITEMS = 3;
  const FEATURED_ITEMS = 3;
  const POPULAR_ITEMS = 8;
  const POPULAR_VISIBLE_ITEMS = 4;
  const USERS_VISIBLE_ITEMS = 4
  const USERS_ITEMS = 8

  const totalRelatedItems = relatedTrainings.length;
  const totalPopularItems = popularTrainings.length;
  const totalUsersItems = readyUsers.length;

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchTrainingsAction({storeName: 'related', limit: RELATED_ITEMS}));
      dispatch(fetchTrainingsAction({storeName: 'featured', limit: FEATURED_ITEMS}));
      dispatch(fetchTrainingsAction({storeName: 'popular', limit: POPULAR_ITEMS}));
      dispatch(fetchUsersAction({role: UserRole.Customer, limit: USERS_ITEMS}));
    }
  }, [dispatch, user, user?.id]);

  const handleRelatedNext = () => {
    setCurrentRelatedIndex((prevIndex: number) =>
      (prevIndex + RELATED_VISIBLE_ITEMS) < totalRelatedItems
        ? prevIndex + RELATED_VISIBLE_ITEMS
        : prevIndex
    );
  };

  const handleRelatedPrevious = () => {
    setCurrentRelatedIndex((prevIndex: number) =>
      prevIndex - RELATED_VISIBLE_ITEMS >= 0 ? prevIndex - RELATED_VISIBLE_ITEMS : prevIndex
    );
  };

  const handlePopularNext = () => {
    setCurrentPopularIndex((prevIndex: number) =>
      (prevIndex + POPULAR_VISIBLE_ITEMS) < totalPopularItems
        ? prevIndex + POPULAR_VISIBLE_ITEMS
        : prevIndex
    );
  };

  const handlePopularPrevious = () => {
    setCurrentPopularIndex((prevIndex: number) =>
      prevIndex - POPULAR_VISIBLE_ITEMS >= 0 ? prevIndex - POPULAR_VISIBLE_ITEMS : prevIndex
    );
  };

  const handleUsersNext = () => {
    setCurrentUsersIndex((prevIndex: number) =>
      (prevIndex + USERS_VISIBLE_ITEMS) < totalUsersItems
        ? prevIndex + USERS_VISIBLE_ITEMS
        : prevIndex
    );
  };

  const handleUsersPrevious = () => {
    setCurrentUsersIndex((prevIndex: number) =>
      prevIndex - USERS_VISIBLE_ITEMS >= 0 ? prevIndex - USERS_VISIBLE_ITEMS : prevIndex
    );
  };

  useEffect(() => {
    console.log('relatedTrainings', relatedTrainings);
    console.log('featuredTrainings', featuredTrainings[0]);
  } , [relatedTrainings, featuredTrainings]);

  return (
    <div className="wrapper">
      <Helmet>
        <title>Главная — FitFriends</title>
      </Helmet>
      <Header />
      <main>
        <h1 className="visually-hidden">FitFriends — Время находить тренировки, спортзалы и друзей спортсменов</h1>
        <section className="special-for-you">
          <div className="container">
            <div className="special-for-you__wrapper">
              <div className="special-for-you__title-wrapper">
                <h2 className="special-for-you__title">Специально подобрано для вас</h2>
                <div className="special-for-you__controls">
                  <button
                    className="btn-icon special-for-you__control"
                    type="button"
                    aria-label="previous"
                    onClick={handleRelatedPrevious}
                    disabled={currentRelatedIndex === 0}
                  >
                    <svg width="16" height="14" aria-hidden="true">
                      <use xlinkHref="#arrow-left"></use>
                    </svg>
                  </button>
                  <button
                    className="btn-icon special-for-you__control"
                    type="button"
                    aria-label="next"
                    onClick={handleRelatedNext}
                    disabled={currentRelatedIndex + RELATED_VISIBLE_ITEMS >= totalRelatedItems}
                  >
                    <svg width="16" height="14" aria-hidden="true">
                      <use xlinkHref="#arrow-right"></use>
                    </svg>
                  </button>
                </div>
              </div>
              <ul
                className="special-for-you__list"
                style={{ transform: `translateX(-${(currentRelatedIndex / RELATED_VISIBLE_ITEMS) * 100}%)` }}
              >
                {relatedTrainings.map((training) => (
                  <li key={training.id}>
                    <RelatedCard training={training} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        {featuredTrainings && featuredTrainings.length > 0 && (
          <FeaturedCards featuredTrainings={featuredTrainings} />
        )}
        <section className="popular-trainings">
          <div className="container">
            <div className="popular-trainings__wrapper">
              <div className="popular-trainings__title-wrapper">
                <h2 className="popular-trainings__title">Популярные тренировки</h2>
                <button className="btn-flat popular-trainings__button" type="button">
                  <span>Смотреть все</span>
                  <svg width="14" height="10" aria-hidden="true">
                    <use xlinkHref="#arrow-right"></use>
                  </svg>
                </button>
                <div className="popular-trainings__controls">
                  <button
                    className="btn-icon popular-trainings__control"
                    type="button"
                    aria-label="previous"
                    onClick={handlePopularPrevious}
                    disabled={currentPopularIndex === 0}
                  >
                    <svg width="16" height="14" aria-hidden="true">
                      <use xlinkHref="#arrow-left"></use>
                    </svg>
                  </button>
                  <button
                    className="btn-icon popular-trainings__control"
                    type="button"
                    aria-label="next"
                    onClick={handlePopularNext}
                    disabled={currentPopularIndex + POPULAR_VISIBLE_ITEMS >= totalPopularItems}
                  >
                    <svg width="16" height="14" aria-hidden="true">
                      <use xlinkHref="#arrow-right"></use>
                    </svg>
                  </button>
                </div>
              </div>
              <ul className="popular-trainings__list"
                style={{ transform: `translateX(-${(currentPopularIndex / POPULAR_VISIBLE_ITEMS) * 100}%)` }}
              >
                {popularTrainings.map((training) => (
                  <TrainingCard key={training.id} training={training} />
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="look-for-company">
          <div className="container">
            <div className="look-for-company__wrapper">
              <div className="look-for-company__title-wrapper">
                <h2 className="look-for-company__title">Ищут компанию для тренировки</h2>
                <button className="btn-flat btn-flat--light look-for-company__button" type="button"><span>Смотреть все</span>
                  <svg width="14" height="10" aria-hidden="true">
                    <use xlinkHref="#arrow-right"></use>
                  </svg>
                </button>
                <div className="look-for-company__controls">
                  <button
                    className="btn-icon btn-icon--outlined look-for-company__control"
                    type="button"
                    aria-label="previous"
                    onClick={handleUsersPrevious}
                    disabled={currentUsersIndex === 0}
                  >
                    <svg width="16" height="14" aria-hidden="true">
                      <use xlinkHref="#arrow-left"></use>
                    </svg>
                  </button>
                  <button
                    className="btn-icon btn-icon--outlined look-for-company__control"
                    type="button"
                    aria-label="next"
                    onClick={handleUsersNext}
                    disabled={currentUsersIndex + USERS_VISIBLE_ITEMS >= totalUsersItems}
                  >
                    <svg width="16" height="14" aria-hidden="true">
                      <use xlinkHref="#arrow-right"></use>
                    </svg>
                  </button>
                </div>
              </div>
              <ul className="look-for-company__list"
                style={{ transform: `translateX(-${(currentUsersIndex / USERS_VISIBLE_ITEMS) * 100}%)` }}
              >
                {readyUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
