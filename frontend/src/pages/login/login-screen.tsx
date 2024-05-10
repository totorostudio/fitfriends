import { Helmet } from "react-helmet-async";
import { useAppSelector } from "../../hooks";
import { getUsers } from "../../store/selectors";

export default function LoginScreen(): JSX.Element {
  const users = useAppSelector(getUsers);
  console.log(users);

  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>Войти</title>
      </Helmet>

      <main className="page__main page__main--index">
        <h1>Войти на сайт</h1>
        <div>

        </div>
      </main>
    </div>
  );
}


