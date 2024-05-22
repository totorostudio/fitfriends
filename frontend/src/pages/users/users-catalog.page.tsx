import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header, UserCatalogCard } from "../../components";
import { AppRoute } from "../../const";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getUsers } from "../../store/selectors";
import { UsersFilterParams, fetchUsersAction } from "../../store/api-actions";
import { Level, TrainingType, UserRole } from "../../types";
import { capitalizeFirst, removeNullFields } from "../../utils";

export function UsersPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(getUsers);
  const users = usersData?.users || [];
  const VISIBLE_USERS = 3;
  const [trainingTypes, setTrainingTypes] = useState(Object.values(TrainingType).slice(0, 5));
  const [filter, setFilter] = useState<UsersFilterParams>({
    page: 1,
    limit: VISIBLE_USERS,
    trainingType: undefined,
    level: undefined,
    role: undefined,
  });
  const [showTypes, setShowTypes] = useState(false);
  const totalPages = usersData?.totalPages || 0;

  useEffect(() => {
    const params = removeNullFields<UsersFilterParams>(filter);
    dispatch(fetchUsersAction(params));
  }, [dispatch, filter]);

  const handleLoadMore = () => {
      setFilter(prevFilter => ({
        ...prevFilter,
        limit: (prevFilter.limit || 0) + VISIBLE_USERS,
      }));
      console.log('filter:', filter);
  };

  const handleShowTypes = () => {
    setShowTypes(!showTypes);
    if (showTypes) {
      setTrainingTypes(Object.values(TrainingType).slice(0, 5));
      return;
    }
    setTrainingTypes(Object.values(TrainingType));
  };

  const handleTrainingTypesChange = (type: TrainingType) => {
    setFilter(prevFilter => {
      const newTrainingTypes = prevFilter.trainingType ? [...prevFilter.trainingType] : [];
      if (newTrainingTypes.includes(type)) {
        return {
          ...prevFilter,
          trainingType: newTrainingTypes.filter(t => t !== type),
          limit: VISIBLE_USERS,
        };
      } else {
        return {
          ...prevFilter,
          trainingType: [...newTrainingTypes, type],
          limit: VISIBLE_USERS,
        };
      }
    });
  };

  const handleLevelChange = (level: Level) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      level,
      limit: VISIBLE_USERS,
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      role,
      limit: VISIBLE_USERS,
    }));
  };

  if (!usersData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="wrapper">
      <Helmet>
        <title>Каталог пользователей — FitFriends</title>
      </Helmet>
      <Header />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Каталог пользователей</h1>
              <div className="user-catalog-form">
                <h2 className="visually-hidden">Каталог пользователя</h2>
                <div className="user-catalog-form__wrapper">
                  <Link to={AppRoute.Main}>
                    <button className="btn-flat btn-flat--underlined user-catalog-form__btnback" type="button">
                      <svg width="14" height="10" aria-hidden="true">
                        <use xlinkHref="#arrow-left"></use>
                      </svg>
                      <span>Назад</span>
                    </button>
                  </Link>
                  <h3 className="user-catalog-form__title">Фильтры</h3>
                  <form className="user-catalog-form__form">
                    <div className="user-catalog-form__block user-catalog-form__block--location">
                      <h4 className="user-catalog-form__block-title">Локация, станция метро</h4>
                      <ul className="user-catalog-form__check-list">
                        <li className="user-catalog-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input type="checkbox" value="user-agreement-1" name="user-agreement" checked />
                              <span className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg>
                              </span>
                              <span className="custom-toggle__label">Автово</span>
                            </label>
                          </div>
                        </li>
                        <li className="user-catalog-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input type="checkbox" value="user-agreement-1" name="user-agreement" checked />
                              <span className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg>
                              </span>
                              <span className="custom-toggle__label">Адмиралтейская</span>
                            </label>
                          </div>
                        </li>
                        <li className="user-catalog-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input type="checkbox" value="user-agreement-1" name="user-agreement" checked />
                              <span className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg>
                              </span>
                              <span className="custom-toggle__label">Академическая</span>
                            </label>
                          </div>
                        </li>
                        <li className="user-catalog-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input type="checkbox" value="user-agreement-1" name="user-agreement" />
                              <span className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg>
                              </span>
                              <span className="custom-toggle__label">Балтийская</span>
                            </label>
                          </div>
                        </li>
                        <li className="user-catalog-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input type="checkbox" value="user-agreement-1" name="user-agreement" />
                              <span className="custom-toggle__icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg>
                              </span>
                              <span className="custom-toggle__label">Бухарестская</span>
                            </label>
                          </div>
                        </li>
                      </ul>
                      <button className="btn-show-more user-catalog-form__btn-show" type="button">
                        <span>Посмотреть все</span>
                        <svg className="btn-show-more__icon" width="10" height="4" aria-hidden="true">
                          <use xlinkHref="#arrow-down"></use>
                        </svg>
                      </button>
                    </div>
                    <div className="user-catalog-form__block user-catalog-form__block--spezialization">
                      <h4 className="user-catalog-form__block-title">Специализация</h4>
                      <ul className="user-catalog-form__check-list">
                        {trainingTypes.map((type) => (
                          <li key={type} className="user-catalog-form__check-list-item">
                            <div className="custom-toggle custom-toggle--checkbox">
                              <label>
                                <input
                                  type="checkbox"
                                  value={type}
                                  name={type}
                                  checked={filter.trainingType?.includes(type) || false}
                                  onChange={() => handleTrainingTypesChange(type)}
                                />
                                <span className="custom-toggle__icon">
                                  <svg width="9" height="6" aria-hidden="true">
                                    <use xlinkHref="#arrow-check"></use>
                                  </svg>
                                </span>
                                <span className="custom-toggle__label">{capitalizeFirst(type)}</span>
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {!showTypes &&
                        <button onClick={handleShowTypes} className="btn-show-more user-catalog-form__btn-show" type="button">
                          <span>Посмотреть все</span>
                          <svg className="btn-show-more__icon" width="10" height="4" aria-hidden="true">
                            <use xlinkHref="#arrow-down"></use>
                          </svg>
                        </button>
                      }
                    </div>
                    <div className="user-catalog-form__block user-catalog-form__block--level">
                      <h4 className="user-catalog-form__block-title">Уровень</h4>
                      <div className="custom-toggle-radio">
                        {Object.values(Level).map((level) => (
                          <div className="custom-toggle-radio__block">
                            <label>
                              <input
                                type="radio"
                                name="level"
                                value={level}
                                checked={filter.level === level}
                                onChange={() => handleLevelChange(level)}
                              />
                              <span className="custom-toggle-radio__icon"></span>
                              <span className="custom-toggle-radio__label">{level}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="user-catalog-form__block">
                      <div className="btn-radio-sort">
                        <label>
                          <input
                            type="radio"
                            name="sort"
                            value={UserRole.Coach}
                            checked={filter.role === UserRole.Coach}
                            onChange={() => handleRoleChange(UserRole.Coach)}
                          />
                          <span className="btn-radio-sort__label">Тренеры</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="sort"
                            value={UserRole.Customer}
                            checked={filter.role === UserRole.Customer}
                            onChange={() => handleRoleChange(UserRole.Customer)}
                          />
                          <span className="btn-radio-sort__label">Пользователи</span>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="inner-page__content">
                <div className="users-catalog">
                  <ul className="users-catalog__list">
                    {users.length === 0 && <li className="users-catalog__item">Нет пользователей по заданным критериям</li>}
                    {users.map((user) => (
                      <li key={user.id} className="users-catalog__item">
                        <UserCatalogCard user={user} />
                      </li>
                    ))}
                  </ul>
                  <div className="show-more users-catalog__show-more">
                    {filter.page && filter.page < totalPages &&
                      <button onClick={handleLoadMore} className="btn show-more__button show-more__button--more" type="button">Показать еще</button>
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

