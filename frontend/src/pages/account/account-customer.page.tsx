import { Helmet } from "react-helmet-async";

export function AccountCustomerPage(): JSX.Element {
  return (
    <div className="wrapper">
      <Helmet>
        <title>Личный кабинет пользователя</title>
      </Helmet>
      <header className="header">
        <div className="container"><a className="header__logo" href="index.html" aria-label="Переход на главную">
            <svg width="187" height="70" aria-hidden="true">
              <use xlinkHref="#logo"></use>
            </svg></a>
          <nav className="main-nav">
            <ul className="main-nav__list">
              <li className="main-nav__item"><a className="main-nav__link is-active" href="#" aria-label="На главную">
                  <svg width="18" height="18" aria-hidden="true">
                    <use xlinkHref="#icon-home"></use>
                  </svg></a></li>
              <li className="main-nav__item"><a className="main-nav__link" href="#" aria-label="Личный кабинет">
                  <svg width="16" height="18" aria-hidden="true">
                    <use xlinkHref="#icon-user"></use>
                  </svg></a></li>
              <li className="main-nav__item"><a className="main-nav__link" href="#" aria-label="Друзья">
                  <svg width="22" height="16" aria-hidden="true">
                    <use xlinkHref="#icon-friends"></use>
                  </svg></a></li>
              <li className="main-nav__item main-nav__item--notifications"><a className="main-nav__link" href="#" aria-label="Уведомления">
                  <svg width="14" height="18" aria-hidden="true">
                    <use xlinkHref="#icon-notification"></use>
                  </svg></a>
                <div className="main-nav__dropdown">
                  <p className="main-nav__label">Оповещения</p>
                  <ul className="main-nav__sublist">
                    <li className="main-nav__subitem"><a className="notification is-active" href="#">
                      <p className="notification__text">Катерина пригласила вас на&nbsp;тренировку</p>
                      <time className="notification__time" dateTime="2023-12-23 12:35">23 декабря, 12:35</time></a>
                    </li>
                    <li className="main-nav__subitem"><a className="notification is-active" href="#">
                      <p className="notification__text">Никита отклонил приглашение на&nbsp;совместную тренировку</p>
                      <time className="notification__time" dateTime="2023-12-22 09:22">22 декабря, 09:22</time></a>
                    </li>
                    <li className="main-nav__subitem"><a className="notification is-active" href="#">
                      <p className="notification__text">Татьяна добавила вас в&nbsp;друзья</p>
                      <time className="notification__time" dateTime="2023-12-18 18:50">18 декабря, 18:50</time></a>
                    </li>
                    <li className="main-nav__subitem"><a className="notification" href="#">
                      <p className="notification__text">Наталья приняла приглашение на&nbsp;совместную тренировку</p>
                      <time className="notification__time" dateTime="2023-12-14 08:15">14 декабря, 08:15</time></a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
          <div className="search">
            <form action="#" method="get">
              <label><span className="search__label">Поиск</span>
                <input type="search" name="search" />
                <svg className="search__icon" width="20" height="20" aria-hidden="true">
                  <use xlinkHref="#icon-search"></use>
                </svg>
              </label>
              <ul className="search__list">
                <li className="search__item"><a className="search__link" href="#">Бокс</a></li>
                <li className="search__item"><a className="search__link is-active" href="#">Бег</a></li>
                <li className="search__item"><a className="search__link" href="#">Аэробика</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
                <li className="search__item"><a className="search__link" href="#">Text</a></li>
              </ul>
            </form>
          </div>
        </div>
      </header>
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Личный кабинет</h1>
              <section className="user-info">
                <div className="user-info__header">
                  <div className="input-load-avatar">
                    <label>
                      <input className="visually-hidden" type="file" name="user-photo-1" accept="image/png, image/jpeg" />
                      <span className="input-load-avatar__avatar">
                        <img src="img/content/user-photo-1.png" srcSet="img/content/user-photo-1@2x.png 2x" width="98" height="98" alt="user photo" />
                      </span>
                    </label>
                  </div>
                </div>
                <form className="user-info__form" action="#" method="post">
                  <button className="btn-flat btn-flat--underlined user-info__edit-button" type="button" aria-label="Редактировать">
                    <svg width="12" height="12" aria-hidden="true">
                      <use xlinkHref="#icon-edit"></use>
                    </svg><span>Редактировать</span>
                  </button>
                  <div className="user-info__section">
                    <h2 className="user-info__title">Обо мне</h2>
                    <div className="custom-input custom-input--readonly user-info__input">
                      <label><span className="custom-input__label">Имя</span><span className="custom-input__wrapper">
                          <input type="text" name="name" value="Валерия" disabled /></span>
                      </label>
                    </div>
                    <div className="custom-textarea custom-textarea--readonly user-info__textarea">
                      <label><span className="custom-textarea__label">Описание</span>
                        <textarea name="description" placeholder=" " disabled>Персональный тренер и инструктор групповых программ с опытом  более 4х лет. Специализация: коррекция фигуры и осанки, снижение веса, восстановление после травм, пилатес.</textarea>
                      </label>
                    </div>
                  </div>
                  <div className="user-info__section user-info__section--status">
                    <h2 className="user-info__title user-info__title--status">Статус</h2>
                    <div className="custom-toggle custom-toggle--switch user-info__toggle">
                      <label>
                        <input type="checkbox" name="ready-for-training" checked />
                        <span className="custom-toggle__icon">
                          <svg width="9" height="6" aria-hidden="true">
                            <use xlinkHref="#arrow-check"></use>
                          </svg>
                        </span>
                        <span className="custom-toggle__label">Готов тренировать</span>
                      </label>
                    </div>
                  </div>
                  <div className="user-info__section">
                    <h2 className="user-info__title user-info__title--specialization">Специализация</h2>
                    <div className="specialization-checkbox user-info__specialization">
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="yoga" checked />
                          <span className="btn-checkbox__btn">Йога</span>
                        </label>
                      </div>
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="running" />
                          <span className="btn-checkbox__btn">Бег</span>
                        </label>
                      </div>
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="aerobics" checked />
                          <span className="btn-checkbox__btn">Аэробика</span>
                        </label>
                      </div>
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="boxing" />
                          <span className="btn-checkbox__btn">Бокс</span>
                        </label>
                      </div>
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="power"/>
                          <span className="btn-checkbox__btn">Силовые</span>
                        </label>
                      </div>
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="pilates" checked />
                          <span className="btn-checkbox__btn">Пилатес</span>
                        </label>
                      </div>
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="stretching" checked />
                          <span className="btn-checkbox__btn">Стрейчинг</span>
                        </label>
                      </div>
                      <div className="btn-checkbox">
                        <label>
                          <input className="visually-hidden" type="checkbox" name="specialization" value="crossfit" />
                          <span className="btn-checkbox__btn">Кроссфит</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="custom-select--readonly custom-select user-info__select"><span className="custom-select__label">Локация</span>
                    <div className="custom-select__placeholder">ст. м. Адмиралтейская</div>
                    <button className="custom-select__button" type="button" aria-label="Выберите одну из опций" disabled>
                      <span className="custom-select__text"></span>
                      <span className="custom-select__icon">
                      <svg width="15" height="6" aria-hidden="true">
                        <use xlinkHref="#arrow-down"></use>
                      </svg></span>
                    </button>
                    <ul className="custom-select__list" role="listbox">
                    </ul>
                  </div>
                  <div className="custom-select--readonly custom-select user-info__select"><span className="custom-select__label">Пол</span>
                    <div className="custom-select__placeholder">Женский</div>
                    <button className="custom-select__button" type="button" aria-label="Выберите одну из опций" disabled>
                      <span className="custom-select__text"></span>
                      <span className="custom-select__icon">
                        <svg width="15" height="6" aria-hidden="true">
                          <use xlinkHref="#arrow-down"></use>
                        </svg>
                      </span>
                    </button>
                    <ul className="custom-select__list" role="listbox">
                    </ul>
                  </div>
                  <div className="custom-select--readonly custom-select user-info__select"><span className="custom-select__label">Уровень</span>
                    <div className="custom-select__placeholder">Профессионал</div>
                    <button className="custom-select__button" type="button" aria-label="Выберите одну из опций" disabled>
                      <span className="custom-select__text"></span>
                      <span className="custom-select__icon">
                        <svg width="15" height="6" aria-hidden="true">
                          <use xlinkHref="#arrow-down"></use>
                        </svg>
                      </span>
                    </button>
                    <ul className="custom-select__list" role="listbox">
                    </ul>
                  </div>
                </form>
              </section>
              <div className="inner-page__content">
                <div className="personal-account-user">
                  <div className="personal-account-user__schedule">
                    <form action="#" method="get">
                      <div className="personal-account-user__form">
                        <div className="personal-account-user__input">
                          <label><span className="personal-account-user__label">План на день, ккал</span>
                            <input type="text" name="schedule-for-the-day" value="3 300" />
                          </label>
                        </div>
                        <div className="personal-account-user__input">
                          <label><span className="personal-account-user__label">План на неделю, ккал</span>
                            <input type="text" name="schedule-for-the-week" value="23 100" />
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="personal-account-user__additional-info">
                    <a className="thumbnail-link thumbnail-link--theme-light" href="#">
                      <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                        <svg width="30" height="26" aria-hidden="true">
                          <use xlinkHref="#icon-friends"></use>
                        </svg>
                      </div>
                      <span className="thumbnail-link__text">Мои друзья</span>
                    </a>
                    <a className="thumbnail-link thumbnail-link--theme-light" href="#">
                      <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                        <svg width="30" height="26" aria-hidden="true">
                          <use xlinkHref="#icon-shopping-cart"></use>
                        </svg>
                      </div>
                      <span className="thumbnail-link__text">Мои покупки</span>
                    </a>
                    <div className="thumbnail-spec-gym">
                      <div className="thumbnail-spec-gym__image">
                        <picture>
                          <source type="image/webp" srcSet="img/content/thumbnails/nearest-gym-01.webp, img/content/thumbnails/nearest-gym-01@2x.webp 2x" />
                          <img src="img/content/thumbnails/nearest-gym-01.jpg" srcSet="img/content/thumbnails/nearest-gym-01@2x.jpg 2x" width="330" height="190" alt="" />
                        </picture>
                      </div>
                      <p className="thumbnail-spec-gym__type">Ближайший зал</p>
                      <div className="thumbnail-spec-gym__header" style={{ textAlign: 'center' }}>
                        <h3 className="thumbnail-spec-gym__title">Скоро тут появится что-то полезное</h3>
                      </div>
                      </div>
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
