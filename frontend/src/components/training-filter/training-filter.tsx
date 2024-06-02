import { Dispatch, SetStateAction, useState } from "react";
import { Range, getTrackBackground } from 'react-range';
import { Filter } from "../../pages";
import './styles.css';
import { FullUser, SortTrainings, TrainingTime, UserRole } from "../../types";
import { TrainingFilterSort } from "..";

interface TrainingFilterProps {
  minPrice: number;
  maxPrice: number;
  minCalories: number;
  maxCalories: number;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  sort: SortTrainings;
  setSort: Dispatch<SetStateAction<SortTrainings>>;
  user: FullUser
};

type HandleRangeChangeType = (
  rangeName: string,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  filter: Filter,
  setValues: React.Dispatch<React.SetStateAction<number[]>>
) => (newValues: number[]) => void;

export function TrainingFilter({ minPrice, maxPrice, minCalories, maxCalories, filter, setFilter, sort, setSort, user }: TrainingFilterProps): JSX.Element {
  const RatingRange = {
    STEP: 1,
    MIN: 0,
    MAX: 5
  };

  const PriceRange = {
    STEP: 100,
    Min: minPrice,
    Max: maxPrice
  };

  const CaloriesRange = {
    STEP: 100,
    Min: minCalories,
    Max: maxCalories
  };

  const [onInitPrice, setOnInitPrice] = useState(false);
  const [onInitCalories, setOnInitCalories] = useState(false);
  const [priceValues, setPriceValues] = useState([minPrice, maxPrice]);
  const [caloriesValues, setCaloriesValues] = useState([minCalories, maxCalories]);
  const [ratingValues, setRatingValues] = useState([RatingRange.MIN, RatingRange.MAX]);

  const handleRangeChange: HandleRangeChangeType = (rangeName, setFilter, filter, setValues) => (newValues) => {
    if (rangeName === 'price') {
      setOnInitPrice(true);
    } else if (rangeName === 'calories') {
      setOnInitCalories(true);
    }

    setValues(newValues);
    setFilter({
      ...filter,
      [rangeName + 'From']: newValues[0],
      [rangeName + 'To']: newValues[1],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numericValue = Number(value.replace(/^0+/, '')) || 0;

    if (name === 'priceFrom' || name === 'priceTo') {
      setOnInitPrice(true);
    } else if (name === 'calories' || name === 'caloriesTo') {
      setOnInitCalories(true);
    }

    if (name === 'priceFrom' || name === 'priceTo') {
      numericValue = Math.min(Math.max(numericValue, PriceRange.Min), PriceRange.Max);
    } else if (name === 'caloriesFrom' || name === 'caloriesTo') {
      numericValue = Math.min(Math.max(numericValue, CaloriesRange.Min), CaloriesRange.Max);
    } else if (name === 'ratingFrom' || name === 'ratingTo') {
      numericValue = Math.min(Math.max(numericValue, RatingRange.MIN), RatingRange.MAX);
    }

    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter, [name]: numericValue };

      if (name === 'priceFrom' && numericValue > (newFilter.priceTo ?? PriceRange.Max)) {
        newFilter.priceTo = numericValue;
      } else if (name === 'priceTo' && numericValue < (newFilter.priceFrom ?? PriceRange.Min)) {
        newFilter.priceFrom = numericValue;
      } else if (name === 'caloriesFrom' && numericValue > (newFilter.caloriesTo ?? CaloriesRange.Max)) {
        newFilter.caloriesTo = numericValue;
      } else if (name === 'caloriesTo' && numericValue < (newFilter.caloriesFrom ?? CaloriesRange.Min)) {
        newFilter.caloriesFrom = numericValue;
      } else if (name === 'ratingFrom' && numericValue > (newFilter.ratingTo ?? RatingRange.MAX)) {
        newFilter.ratingTo = numericValue;
      } else if (name === 'ratingTo' && numericValue < (newFilter.ratingFrom ?? RatingRange.MIN)) {
        newFilter.ratingFrom = numericValue;
      }

      setPriceValues([newFilter.priceFrom ?? 0, newFilter.priceTo ?? PriceRange.Max]);
      setCaloriesValues([newFilter.caloriesFrom ?? CaloriesRange.Min, newFilter.caloriesTo ?? CaloriesRange.Max]);
      setRatingValues([newFilter.ratingFrom ?? 0, newFilter.ratingTo ?? RatingRange.MAX]);

      return newFilter;
    });

    e.target.value = numericValue.toString();
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, duration: TrainingTime) => {
    setFilter((prevFilter) => {
      const trainingTime = prevFilter.trainingTime ?? [];
      if (event.target.checked) {
        return { ...prevFilter, trainingTime: [...trainingTime, duration] };
      } else {
        return { ...prevFilter, trainingTime: trainingTime.filter(item => item !== duration) };
      }
    });
  };

  return(
    <form className="my-training-form__form">
      <div className="my-training-form__block my-training-form__block--price">
        <h4 className="my-training-form__block-title">Цена, ₽</h4>
        <div className="filter-price">
          <div className="filter-price__input-text filter-price__input-text--min">
            <input
              type="number"
              name="priceFrom"
              placeholder={minPrice.toString()}
              value={filter.priceFrom}
              min={PriceRange.Min}
              max={PriceRange.Max}
              onChange={handleInputChange}
            />
            <label htmlFor="text-min">от</label>
          </div>
          <div className="filter-price__input-text filter-price__input-text--max">
            <input
              type="number"
              name="priceTo"
              placeholder={maxPrice.toString()}
              value={filter.priceTo}
              min={PriceRange.Min}
              max={PriceRange.Max}
              onChange={handleInputChange}
            />
            <label htmlFor="text-max">до</label>
          </div>
        </div>
        <div className="filter-range">
          <div className="filter-range__scale">
            <div className="filter-range__scale-container">
              <Range
                step={PriceRange.STEP}
                min={PriceRange.Min}
                max={PriceRange.Max > PriceRange.Min ? PriceRange.Max : PriceRange.Min + PriceRange.STEP}
                values={onInitPrice ? priceValues : [minPrice, maxPrice] }
                onChange={handleRangeChange('price', setFilter, filter, setPriceValues)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="filter-range__track"
                    style={{
                      ...props.style,
                      background: getTrackBackground({
                        values: priceValues,
                        colors: ['#ccc', '#333', '#ccc'],
                        min: PriceRange.Min,
                        max: PriceRange.Max
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="filter-range__thumb"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-training-form__block my-training-form__block--calories">
        <h4 className="my-training-form__block-title">Калории</h4>
        <div className="filter-calories">
          <div className="filter-calories__input-text filter-calories__input-text--min">
            <input
              type="number"
              name="caloriesFrom"
              placeholder={CaloriesRange.Min.toString()}
              value={filter.caloriesFrom}
              min={CaloriesRange.Min}
              max={CaloriesRange.Max}
              onChange={handleInputChange}
            />
            <label htmlFor="text-min-cal">от</label>
          </div>
          <div className="filter-calories__input-text filter-calories__input-text--max">
            <input
              type="number"
              name="caloriesTo"
              placeholder={CaloriesRange.Max.toString()}
              value={filter.caloriesTo}
              min={CaloriesRange.Min}
              max={CaloriesRange.Max}
              onChange={handleInputChange}
            />
            <label htmlFor="text-max-cal">до</label>
          </div>
        </div>
        <div className="filter-range">
          <div className="filter-range__scale">
            <div className="filter-range__scale-container">
              <Range
                step={CaloriesRange.STEP}
                min={CaloriesRange.Min}
                max={CaloriesRange.Max > CaloriesRange.Min ? CaloriesRange.Max : CaloriesRange.Min + CaloriesRange.STEP}
                values={onInitCalories ? caloriesValues : [CaloriesRange.Min, CaloriesRange.Max] }
                onChange={handleRangeChange('calories', setFilter, filter, setCaloriesValues)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="filter-range__track"
                    style={{
                      ...props.style,
                      background: getTrackBackground({
                        values: caloriesValues,
                        colors: ['#ccc', '#333', '#ccc'],
                        min: CaloriesRange.Min,
                        max: CaloriesRange.Max
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="filter-range__thumb"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-training-form__block my-training-form__block--raiting">
        <h4 className="my-training-form__block-title">Рейтинг</h4>
        <div className="filter-raiting">
          <div className="filter-raiting__scale">
            <div className="filter-range__scale-container">
              <Range
                step={RatingRange.STEP}
                min={RatingRange.MIN}
                max={RatingRange.MAX}
                values={ratingValues}
                onChange={handleRangeChange('rating', setFilter, filter, setRatingValues)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="filter-range__track"
                    style={{
                      ...props.style,
                      background: getTrackBackground({
                        values: ratingValues,
                        colors: ['#ccc', '#333', '#ccc'],
                        min: RatingRange.MIN,
                        max: RatingRange.MAX
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="filter-range__thumb"
                  />
                )}
              />
            </div>
          </div>
          <div className="filter-raiting__control">
            <span className="visually-hidden">Минимальное значение</span>
            <span>{ratingValues[0]}</span>
            <span className="visually-hidden">Максимальное значение</span>
            <span>{ratingValues[1]}</span>
          </div>
        </div>
      </div>
      {user.role === UserRole.Coach &&
        <div className="my-training-form__block my-training-form__block--duration">
          <h4 className="my-training-form__block-title">Длительность</h4>
          <ul className="my-training-form__check-list">
            {Object.values(TrainingTime).map((duration) => (
              <li key={duration} className="my-training-form__check-list-item">
                <div className="custom-toggle custom-toggle--checkbox">
                  <label>
                    <input
                      type="checkbox"
                      value={duration}
                      name="trainingTime"
                      checked={filter.trainingTime?.includes(duration as TrainingTime) || false}
                      onChange={(e) => handleCheckboxChange(e, duration as TrainingTime)}
                    />
                    <span className="custom-toggle__icon">
                      <svg width="9" height="6" aria-hidden="true">
                        <use xlinkHref="#arrow-check"></use>
                      </svg></span>
                    <span className="custom-toggle__label">{duration}</span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
      {user.role === UserRole.Customer &&
        <TrainingFilterSort sort={sort} setSort={setSort} filter={filter} setFilter={setFilter} />
      }
    </form>
  );
}
