import { Helmet } from "react-helmet-async";
import { Header, PopupBuy, PopupReview, ReviewCard } from "../../components";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect, useState } from "react";
import { getReview, getTraining, getUser } from "../../store/selectors";
import { fetchReviewsAction, fetchTrainingAction, fetchUserAction } from "../../store/api-actions";
import { Review } from "../../types";
import { AppRoute } from "../../const";

export function TrainingPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const training = useAppSelector((getTraining));
  const coach = useAppSelector((getUser));
  const reviewsData = useAppSelector((getReview));
  const reviews: Review[] = reviewsData.data?.reviews || [];
  const [isPopupBuyVisible, setPopupBuyVisible] = useState(false);
  const [isPopupFeedbackVisible, setPopupFeedbackVisible] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTrainingAction(id));
      //dispatch(fetchReviewsAction({ trainingId: id }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (training?.coachId && (!coach || training.coachId !== coach.id)) {
      dispatch(fetchUserAction(training?.coachId));
    }
  }, [dispatch]);

  const handlePopupBuyClick = () => {
    setPopupBuyVisible(true);
  };

  const handlePopupFeedbackClick = () => {
    setPopupFeedbackVisible(true);
  };

  const handleClosePopup = () => {
    setPopupBuyVisible(false);
    setPopupFeedbackVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!training || !training.id || !coach || !coach.id) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="wrapper">
      <Helmet>
        <title>Карточка тренировки {training.title} — FitFriends</title>
      </Helmet>
      <Header />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Карточка тренировки</h1>
              <aside className="reviews-side-bar">
                <Link to={AppRoute.Main}>
                  <button className="btn-flat btn-flat--underlined reviews-side-bar__back" type="button">
                    <svg width="14" height="10" aria-hidden="true">
                      <use xlinkHref="#arrow-left"></use>
                    </svg><span>Назад</span>
                  </button>
                </Link>
                <h2 className="reviews-side-bar__title">Отзывы</h2>
                <ul className="reviews-side-bar__list">
                  {reviews.length === 0 && <li className="reviews-side-bar__item">Отзывов пока нет</li>}
                  {reviews.map((review) => (
                    <li key={review.id} className="reviews-side-bar__item">
                      <ReviewCard review={review} />
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn--medium reviews-side-bar__button"
                  type="button"
                  onClick={handlePopupFeedbackClick}
                >
                  Оставить отзыв
                </button>
                {isPopupFeedbackVisible && <PopupReview training={training} onClose={handleClosePopup} />}
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
                          <button
                            className="btn training-info__buy"
                            type="button"
                            onClick={handlePopupBuyClick}
                          >
                            Купить
                          </button>
                          {isPopupBuyVisible && <PopupBuy training={training} onClose={handleClosePopup} />}
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
