import { useCallback, useState } from 'react';

export enum FormType {
  SignUp = 'signUp',
  SignIn = 'signIn',
  None = 'none'
}

export const useWeb2Login = () => {
  const [shownForm, setShownForm] = useState<FormType>(FormType.None);

  const handleSelectForm = useCallback((formType: FormType) => {
    setShownForm(formType);
  }, []);

  return {
    shownForm,
    onSelectForm: handleSelectForm
  };
};
