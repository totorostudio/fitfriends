import { DEFAULT_ITEMS_LIMIT } from "../../const";

interface ShowMoreProps {
  setVisibleItems: (value: React.SetStateAction<number>) => void;
}

export function ShowMore({ setVisibleItems }: ShowMoreProps): JSX.Element {
  const handleShowMore = () => {
    setVisibleItems((prev) => prev + DEFAULT_ITEMS_LIMIT);
  };

  return (
    <div className="show-more my-trainings__show-more">
      <button
        className="btn show-more__button show-more__button--more"
        type="button"
        onClick={handleShowMore}
      >
        Показать еще
      </button>
    </div>
  );
}
