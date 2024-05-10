import { Helmet } from "react-helmet-async";
import { useAppSelector } from "../../hooks";
import { getUsers } from "../../store/selectors";
import { AppRoute } from "../../const";
import { Link } from "react-router-dom";

export default function LoginScreen(): JSX.Element {
  const users = useAppSelector(getUsers);
  console.log(users);

  return (
    <div className="wrapper">
      <Helmet>
        <title>Войти</title>
      </Helmet>
      <main>
        <div className="background-logo">
          <svg className="background-logo__logo" width="750" height="284" aria-hidden="true">
            <use xlinkHref="#logo-big"></use>
          </svg>
          <svg className="background-logo__icon" width="343" height="343" aria-hidden="true">
            <use xlinkHref="#icon-logotype"></use>
          </svg>
        </div>
        <div className="popup-form popup-form--sign-in">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <div className="popup-form__title-wrapper">
                <h1 className="popup-form__title">Вход</h1>
              </div>
              <div className="popup-form__form">
                <form method="get">
                  <div className="sign-in">
                    <div className="custom-input sign-in__input">
                      <label><span className="custom-input__label">E-mail</span><span className="custom-input__wrapper">
                          <input type="email" name="email" /></span>
                      </label>
                    </div>
                    <div className="custom-input sign-in__input">
                      <label><span className="custom-input__label">Пароль</span><span className="custom-input__wrapper">
                          <input type="password" name="password" /></span>
                      </label>
                    </div>
                    <Link to={AppRoute.Main}><button className="btn sign-in__button" type="submit">Продолжить</button></Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


