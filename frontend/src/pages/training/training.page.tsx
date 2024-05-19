import { Helmet } from "react-helmet-async";
import { Header, ReviewCard } from "../../components";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { getReview, getTraining, getUser } from "../../store/selectors";
import { fetchReviewsAction, fetchTrainingAction, fetchUserAction } from "../../store/api-actions";
import { Review } from "../../types";

export function TrainingPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  console.log('Страница тренировки с id:', id)

  const dispatch = useAppDispatch();
  const training = useAppSelector((getTraining));
  const coach = useAppSelector((getUser));
  const reviewsData = useAppSelector((getReview));
  const reviews: Review[] = reviewsData?.reviews || [];

  useEffect(() => {
    if (id) {
      dispatch(fetchTrainingAction(id));
      dispatch(fetchReviewsAction({trainingId: id}));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (training?.coachId) {
      dispatch(fetchUserAction(training?.coachId));
    }
  }, [dispatch, training?.coachId]);

  console.log('Текущее состояние тренировки:', training);
  console.log('Текущее состояние тренера:', coach);
  console.log('Текущее состояние отзывов:', reviews);

  if (!training || !training.id || !coach || !coach.id) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="wrapper">
      <Helmet>
        <title>Карточка тренировки ${id} — FitFriends</title>
      </Helmet>
      <Header />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Карточка тренировки</h1>
              <aside className="reviews-side-bar">
                <button className="btn-flat btn-flat--underlined reviews-side-bar__back" type="button">
                  <svg width="14" height="10" aria-hidden="true">
                    <use xlinkHref="#arrow-left"></use>
                  </svg><span>Назад</span>
                </button>
                <h2 className="reviews-side-bar__title">Отзывы</h2>
                <ul className="reviews-side-bar__list">
                  {reviews.map((review) => (
                    <li key={review.id} className="reviews-side-bar__item">
                      <ReviewCard review={review} />
                    </li>
                  ))}
                  <li className="reviews-side-bar__item">
                    <div className="review">
                      <div className="review__user-info">
                        <div className="review__user-photo">
                          <picture>
                            <source type="image/webp" srcSet="img/content/avatars/users//photo-2.webp, img/content/avatars/users//photo-2@2x.webp 2x" />
                            <img src="img/content/avatars/users//photo-2.png" srcSet="img/content/avatars/users//photo-2@2x.png 2x" width="64" height="64" alt="Изображение пользователя" />
                          </picture>
                        </div>
                        <span className="review__user-name">Дарья</span>
                        <div className="review__rating">
                          <svg width="16" height="16" aria-hidden="true">
                            <use xlinkHref="#icon-star"></use>
                          </svg><span>5</span>
                        </div>
                      </div>
                      <p className="review__comment">Спасибо, классная тренировка! Понятная и&nbsp;интересная, с&nbsp;акцентом на&nbsp;правильную технику, как я&nbsp;люблю.</p>
                    </div>
                  </li>
                  <li className="reviews-side-bar__item">
                    <div className="review">
                      <div className="review__user-info">
                        <div className="review__user-photo">
                          <picture>
                            <source type="image/webp" srcSet="img/content/avatars/users//photo-3.webp, img/content/avatars/users//photo-3@2x.webp 2x" />
                            <img src="img/content/avatars/users//photo-3.png" srcSet="img/content/avatars/users//photo-3@2x.png 2x" width="64" height="64" alt="Изображение пользователя" />
                          </picture>
                        </div><span className="review__user-name">Катерина</span>
                        <div className="review__rating">
                          <svg width="16" height="16" aria-hidden="true">
                            <use xlinkHref="#icon-star"></use>
                          </svg><span>4</span>
                        </div>
                      </div>
                      <p className="review__comment">Хорошая тренировка, но&nbsp;все&nbsp;же не&nbsp;хватило немного динамики. Для меня оказалась слишком легкой.</p>
                    </div>
                  </li>
                  <li className="reviews-side-bar__item">
                    <div className="review">
                      <div className="review__user-info">
                        <div className="review__user-photo">
                          <picture>
                            <source type="image/webp" srcSet="img/content/avatars/users//photo-4.webp, img/content/avatars/users//photo-4@2x.webp 2x" />
                            <img src="img/content/avatars/users//photo-4.png" srcSet="img/content/avatars/users//photo-4@2x.png 2x" width="64" height="64" alt="Изображение пользователя" />
                          </picture>
                        </div><span className="review__user-name">Татьяна</span>
                        <div className="review__rating">
                          <svg width="16" height="16" aria-hidden="true">
                            <use xlinkHref="#icon-star"></use>
                          </svg><span>5</span>
                        </div>
                      </div>
                      <p className="review__comment">Регулярно выполняю эту тренировку дома и&nbsp;вижу результат! Спина стала прямее, появилось больше сил и&nbsp;гибкость тоже стала лучше, хотя упражнения довольно простые.</p>
                    </div>
                  </li>
                  <li className="reviews-side-bar__item">
                    <div className="review">
                      <div className="review__user-info">
                        <div className="review__user-photo">
                          <picture>
                            <source type="image/webp" srcSet="img/content/avatars/users//photo-5.webp, img/content/avatars/users//photo-5@2x.webp 2x" />
                            <img src="img/content/avatars/users//photo-5.png" srcSet="img/content/avatars/users//photo-5@2x.png 2x" width="64" height="64" alt="Изображение пользователя" />
                          </picture>
                        </div><span className="review__user-name">Наталья</span>
                        <div className="review__rating">
                          <svg width="16" height="16" aria-hidden="true">
                            <use xlinkHref="#icon-star"></use>
                          </svg><span>5</span>
                        </div>
                      </div>
                      <p className="review__comment">Ну&nbsp;какой&nbsp;же кайф! Спасибо, крутая программа. С&nbsp;музыкой вообще супер! Действительно, Energy!</p>
                    </div>
                  </li>
                  <li className="reviews-side-bar__item">
                    <div className="review">
                      <div className="review__user-info">
                        <div className="review__user-photo">
                          <picture>
                            <source type="image/webp" srcSet="img/content/avatars/users//photo-1.webp, img/content/avatars/users//photo-1@2x.webp 2x" />
                            <img src="img/content/avatars/users//photo-1.png" srcSet="img/content/avatars/users//photo-1@2x.png 2x" width="64" height="64" alt="Изображение пользователя" />
                          </picture>
                        </div><span className="review__user-name">Никита</span>
                        <div className="review__rating">
                          <svg width="16" height="16" aria-hidden="true">
                            <use xlinkHref="#icon-star"></use>
                          </svg><span>5</span>
                        </div>
                      </div>
                      <p className="review__comment">Эта тренировка для меня зарядка по&nbsp;утрам, помогает проснуться.</p>
                    </div>
                  </li>
                </ul>
                <button className="btn btn--medium reviews-side-bar__button" type="button">Оставить отзыв</button>
              </aside>
              <div className="training-card">
                <div className="training-info">
                  <h2 className="visually-hidden">Информация о тренировке</h2>
                  <div className="training-info__header">
                    <div className="training-info__coach">
                      <div className="training-info__photo">
                        <picture>
                          <source type="image/webp" srcSet={`${coach.avatar}, ${coach.avatar} 2x`} />
                          <img src={coach.avatar} srcSet={`${coach.avatar} 2x`} width="64" height="64" alt="Изображение тренера" />
                        </picture>
                      </div>
                      <div className="training-info__coach-info">
                        <span className="training-info__label">Тренер</span>
                        <span className="training-info__name">{coach.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="training-info__main-content">
                    <form action="#" method="get">
                      <div className="training-info__form-wrapper">
                        <div className="training-info__info-wrapper">
                          <div className="training-info__input training-info__input--training">
                            <label><span className="training-info__label">Название тренировки</span>
                              <input type="text" name="training" value={training.title} disabled />
                            </label>
                            <div className="training-info__error">Обязательное поле</div>
                          </div>
                          <div className="training-info__textarea">
                            <label><span className="training-info__label">Описание тренировки</span>
                              <textarea name="description" disabled>{training.description}</textarea>
                            </label>
                          </div>
                        </div>
                        <div className="training-info__rating-wrapper">
                          <div className="training-info__input training-info__input--rating">
                            <label>
                              <span className="training-info__label">Рейтинг</span>
                              <span className="training-info__rating-icon">
                              <svg width="18" height="18" aria-hidden="true">
                                <use xlinkHref="#icon-star"></use>
                              </svg></span>
                              <input type="number" name="rating" value={training.rating} disabled />
                            </label>
                          </div>
                          <ul className="training-info__list">
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white"><span>#{training.trainingType}</span></div>
                            </li>
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white"><span>#{training.gender}</span></div>
                            </li>
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white"><span>#{training.calories}ккал</span></div>
                            </li>
                            <li className="training-info__item">
                              <div className="hashtag hashtag--white"><span>#{training.trainingTime}</span></div>
                            </li>
                          </ul>
                        </div>
                        <div className="training-info__price-wrapper">
                          <div className="training-info__input training-info__input--price">
                            <label><span className="training-info__label">Стоимость</span>
                              <input type="text" name="price" value={`${training.price} ₽`} disabled />
                            </label>
                            <div className="training-info__error">Введите число</div>
                          </div>
                          <button className="btn training-info__buy" type="button">Купить</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="training-video">
                  <h2 className="training-video__title">Видео</h2>
                  <div className="training-video__video">
                    <div className="training-video__thumbnail">
                      <picture>
                        <source type="image/webp" srcSet={`${training.background}, ${training.background} 2x`} />
                        <img src={training.background} srcSet={`${training.background} 2x`} width="922" height="566" alt="Обложка видео" />
                      </picture>
                    </div>
                    <button className="training-video__play-button btn-reset">
                      <svg width="18" height="30" aria-hidden="true">
                        <use xlinkHref="#icon-arrow"></use>
                      </svg>
                    </button>
                  </div>
                  <div className="training-video__buttons-wrapper">
                    <button className="btn training-video__button training-video__button--start" type="button" disabled>Приступить</button>
                    <button className="btn training-video__button training-video__button--stop" type="button">Закончить</button>
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
