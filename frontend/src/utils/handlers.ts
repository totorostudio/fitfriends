export const handleInputChange = <S,>(setState: React.Dispatch<React.SetStateAction<S>>, e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type } = e.target;
  let parsedValue: string | number = value;

  if (type === 'number') {
    parsedValue = value === '' ? '' : +value.replace(/^0+/, '');
  }

  if (type === 'range') {
    parsedValue = value === '' ? 0 : Number(value);
  }

  setState(prevData => {
    if (prevData === null) {
      return prevData;
    }
    return { ...prevData, [name]: parsedValue };
  });
};

export const handleTextareaChange = <S,>(setState: React.Dispatch<React.SetStateAction<S>>, e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  setState(prevData => {
    if (prevData === null) {
      return prevData;
    }
    return { ...prevData, [name]: value };
  });
};

export const handleSelectChange = <S,>(setState: React.Dispatch<React.SetStateAction<S>>, e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setState(prevData => ({
    ...prevData,
    [name]: value
  }));
};

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export const handleButtonChange = <T extends Record<string, any>>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  e: React.MouseEvent<HTMLButtonElement>
) => {
  const { name } = e.currentTarget;
  if (!name) return;

  setState(prevData => {
    if (!prevData || !isObject(prevData) || !(name in prevData)) {
      return prevData;
    }

    const newValue = !prevData[name as keyof T] as boolean;
    return { ...prevData, [name]: newValue };
  });
};

export const handleNext = (currentIndex: number, totalItems: number, step: number): number => {
  return (currentIndex + step) < totalItems ? currentIndex + step : currentIndex;
};

export const handlePrevious = (currentIndex: number, step: number): number => {
  return currentIndex - step >= 0 ? currentIndex - step : currentIndex;
};
