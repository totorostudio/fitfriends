import { Helmet } from "react-helmet-async";
import { useAppSelector } from "../../hooks";
import { getUsers } from "../../store/selectors";

export default function MainScreen(): JSX.Element {
  const users = useAppSelector(getUsers);
  console.log(users);

  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>6 Cities</title>
      </Helmet>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Hello! UsersCount</h1>
        <div className="cities">
          {users.length}
        </div>
      </main>
    </div>
  );
}


