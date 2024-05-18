import { useState } from "react";
import { FullUser, Metro, TrainingType } from "../../types";
import './styles.css';
import { updateUserAction } from "../../store/api-actions";
import { useAppDispatch } from "../../hooks";

type UserEditFormProps = {
  userInfo: FullUser;
};

export function UserEditForm({ userInfo }: UserEditFormProps): JSX.Element {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [user, setUser] = useState<FullUser>(userInfo);
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUserData => {
      if (prevUserData === null) {
        return prevUserData;
      }
      return { ...prevUserData, [name]: value };
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prevUserData => {
      if (prevUserData === null) {
        return prevUserData;
      }
      return { ...prevUserData, [name]: value };
    });
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setUser(prevUserData => {
      if (prevUserData === null) {
        return prevUserData;
      }
      return { ...prevUserData, isReady: checked };
    });
  };

  const trainingTypes = Object.values(TrainingType);

  const handleTrainingTypesChange = (type: TrainingType) => {
    setUser((prevUser) => {
      const isChecked = prevUser.trainingType.includes(type);
      let updatedTrainingType: TrainingType[];
      if (isChecked) {
        updatedTrainingType = prevUser.trainingType.filter(t => t !== type);
      } else {
        if (prevUser.trainingType.length >= 3) {
          return prevUser;
        }
        updatedTrainingType = [...prevUser.trainingType, type];
      }
      return {
         ...prevUser,
         trainingType: updatedTrainingType,
      };
    });
  };

  const toggleEditMode = () => {
    setEditMode(prevEditMode => !prevEditMode);
    if (isEditMode) {
      if (user.id) {
        dispatch(updateUserAction({id: user.id, updateData: user}));
      }
    }
  };

  const toggleOptions = () => setShowOptions(prevState => !prevState);

  const handleMetroChange = (newMetro: Metro) => {
    setUser(prevUserData => {
      if (prevUserData === null) {
        return prevUserData;
      }
      return { ...prevUserData, metro: newMetro };
    });
    setShowOptions(false);
  };

  const metroOptions = Object.values(Metro);

  return (
    <form className="user-info-edit__form" action="#" method="post">
      <button onClick={toggleEditMode} className="btn-flat btn-flat--underlined user-info-edit__save-button" type="button" aria-label={isEditMode ? 'Сохранить' : 'Редактировать'}>
        {isEditMode ?
          <span>Сохранить</span>
        :
          <>
            <svg width="12" height="12" aria-hidden="true">
              <use xlinkHref="#icon-edit"></use>
            </svg>
            <span>Редактировать</span>
          </>
        }
      </button>
      <div className="user-info-edit__section">
        <h2 className="user-info-edit__title">Обо мне</h2>
        <div className="custom-input user-info-edit__input">
          <label>
            <span className="custom-input__label">Имя</span>
            <span className="custom-input__wrapper">
              <input type="text" name="name" value={user.name || ''} onChange={handleInputChange} readOnly={!isEditMode} />
            </span>
          </label>
        </div>
        <div className="custom-textarea user-info-edit__textarea">
          <label><span className="custom-textarea__label">Описание</span>
            <textarea name="description" placeholder="" onChange={handleTextareaChange} readOnly={!isEditMode}>{user.description}</textarea>
          </label>
        </div>
      </div>
      <div className="user-info-edit__section user-info-edit__section--status">
        <h2 className="user-info-edit__title user-info-edit__title--status">Статус</h2>
        <div className="custom-toggle custom-toggle--switch user-info-edit__toggle">
          <label>
            <input onChange={handleToggleChange} type="checkbox" name="ready-for-training" checked={!!user.isReady} disabled={!isEditMode}/>
            <span className="custom-toggle__icon">
              <svg width="9" height="6" aria-hidden="true">
                <use xlinkHref="#arrow-check"></use>
              </svg>
            </span>
            <span className="custom-toggle__label">Готов тренировать</span>
          </label>
        </div>
      </div>

      <div className="user-info-edit__section">
        <h2 className="user-info-edit__title user-info-edit__title--specialization">Специализация</h2>
        <div className="specialization-checkbox user-info-edit__specialization">
          {trainingTypes.map((type) => (
            <div key={type} className="btn-checkbox">
              <label>
                <input
                  className="visually-hidden"
                  type="checkbox"
                  name="specialization"
                  value={type}
                  checked={user.trainingType.includes(type)}
                  onChange={() => handleTrainingTypesChange(type)}
                  disabled={!isEditMode || (user.trainingType.length >= 3 && !user.trainingType.includes(type))}
                />
                <span className="btn-checkbox__btn">{type}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="custom-select user-info-edit__select">
        <span className="custom-select__label">Локация</span>
        <div className="custom-select__placeholder" onClick={toggleOptions}>
          {user.metro}
        </div>
        <button className="custom-select__button" type="button" aria-label="Выберите одну из опций" onClick={toggleOptions}>
          <span className="custom-select__text"></span>
          <span className="custom-select__icon">
            <svg width="15" height="6" aria-hidden="true">
              <use xlinkHref="#arrow-down"></use>
            </svg>
          </span>
        </button>
        <ul className={`custom-select__list ${showOptions ? 'custom-select__list--visible' : ''}`} role="listbox">
          {metroOptions.map((option, index) => (
            <li key={index} onClick={() => handleMetroChange(option)} role="option">
              {option}
            </li>
          ))}
        </ul>
      </div>

      <div className="custom-select user-info-edit__select custom-select--open">
        <span className="custom-select__label">Пол</span>
        <div className="custom-select__placeholder">мужской</div>
        <button className="custom-select__button" type="button" aria-label="Выберите одну из опций">
          <span className="custom-select__text"></span>
          <span className="custom-select__icon">
            <svg width="15" height="6" aria-hidden="true">
              <use xlinkHref="#arrow-down"></use>
            </svg>
          </span>
        </button>
        <ul className="custom-select__list" role="listbox" style={{ display: 'block' }}>
          <li role="option">
            женский
          </li>
          <li role="option">
            мужской
          </li>
          <li role="option">
            неизвестно
          </li>
        </ul>
      </div>

      <div className="custom-select user-info-edit__select"><span className="custom-select__label">Уровень</span>
        <div className="custom-select__placeholder">{user.level}</div>
        <button className="custom-select__button" type="button" aria-label="Выберите одну из опций">
          <span className="custom-select__text"></span>
          <span className="custom-select__icon">
            <svg width="15" height="6" aria-hidden="true">
              <use xlinkHref="#arrow-down"></use>
            </svg>
          </span>
        </button>
        <ul className="custom-select__list" role="listbox"></ul>
      </div>
    </form>
  );
}
