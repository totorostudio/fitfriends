export const handleInputChange = <S,>(setState: React.Dispatch<React.SetStateAction<S>>, e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type } = e.target;
  let parsedValue: string | number = value;

  if (type === 'number') {
    parsedValue = +value;
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
