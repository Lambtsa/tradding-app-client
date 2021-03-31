import React, { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { postNewUserToAPI } from '../modules/api-service';

const SignUp = () => {
  const { oktaAuth } = useOktaAuth();
  const [userFirstName, setFirstName] = useState('');
  const [userLastName, setLastName] = useState('');
  const [userDisplayName, setDisplayName] = useState('');
  const [userTelephone, setTelephone] = useState('');
  const [userEmail, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFirstNameChange = e => setFirstName(e.target.value);
  const handleLastNameChange = e => setLastName(e.target.value);
  const handleDisplayNameChange = e => setDisplayName(e.target.value);
  const handleTelephoneChange = e => setTelephone(e.target.value);
  const handleEmailChange = e => setEmail(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);

  const handleFormSubmit = async event => {
    event.preventDefault();
    const newUser = {
      user: {
        userFirstName,
        userLastName,
        userDisplayName,
        userTelephone,
        userEmail,
        userPassword,
      },
    };
    const response = await postNewUserToAPI(newUser);
    if (!response.ok) {
      setError(true);
      const err = await response.json();
      setErrorMessage(err.message);
    } else {
      try {
        const transaction = await oktaAuth.signIn({
          username: newUser.user.userEmail,
          password: newUser.user.userPassword,
        });
        if (transaction.status === 'SUCCESS') {
          oktaAuth.signInWithRedirect({
            originalUri: '/',
            sessionToken: transaction.sessionToken,
          });
          setError(false);
        } else {
          setError(true);
          setErrorMessage('Login failed');
        }
      } catch (err) {
        setError(true);
        setErrorMessage('Login failed');
      }
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleFormSubmit}>
        <label className="form__label" htmlFor="first-name">
          First name
          <input className="form__input" id="first-name" type="text" value={userFirstName} onChange={handleFirstNameChange} placeholder="Enter first name" required />
        </label>
        <label className="form__label" htmlFor="last-name">
          Last name
          <input className="form__input" id="last-name" type="text" value={userLastName} onChange={handleLastNameChange} placeholder="Enter last name" required />
        </label>
        <label className="form__label" htmlFor="display-name">
          Display name
          <input className="form__input" id="display-name" type="text" value={userDisplayName} onChange={handleDisplayNameChange} placeholder="Enter display name" required />
        </label>
        <label className="form__label" htmlFor="telephone">
          Telephone
          <input className="form__input" id="telephone" type="tel" value={userTelephone} onChange={handleTelephoneChange} placeholder="Enter phone number (optional)" />
        </label>
        <label className="form__label" htmlFor="email">
          Email
          <input className="form__input" id="email" type="email" value={userEmail} onChange={handleEmailChange} placeholder="Enter email" required />
        </label>
        <label className="form__label" htmlFor="password">
          Password
          <input className="form__input" id="password" type="password" value={userPassword} onChange={handlePasswordChange} placeholder="Enter passsword" required />
        </label>
        <button className="form__btn" type="submit">Sign up</button>
      </form>
      {error && <p>{errorMessage}</p>}
    </>
  );
};

export default SignUp;