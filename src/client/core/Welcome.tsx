import React, { useContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { useFormik } from 'formik';
import { SocketEvent } from '../../commons/socket-event.enum';
import { useNavigate } from 'react-router-dom';
import ProfileContext from '../contexts/ProfileContext';

function Welcome(): React.ReactElement {
  const socket = useSocket();

  const [state, setState] = useState('');
  const navigate = useNavigate();
  const { setProfile } = useContext(ProfileContext);
  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      planning: '',
      displayName: '',
    },
    onSubmit() {
      socket.emit(SocketEvent.JOIN_PLANNING, values);
      setProfile(values);
      navigate('/poker');
    },
  })

  useEffect(() => {
    socket.on(SocketEvent.GET_CODE, (code) => setState(code));
  }, []);

  const handleClick = () => {
    socket.emit(SocketEvent.CREATE_PLANNING);
  }

  return (
    <div>
      <h1>Welcome</h1>
      <div>
        <button onClick={handleClick}>Create Planning</button>
        <p>{state}</p>
      </div>
      <div>

        <form action="#" onSubmit={handleSubmit}>
          <label htmlFor="planning">
            Planning
            <input type="text" name="planning" id="planning" value={values.planning} onChange={handleChange} />
          </label>
          <label htmlFor="displayName">
            Display Name
            <input type="text" name="displayName" id="displayName" value={values.displayName} onChange={handleChange} />
          </label>
          <button type="submit">Join Planning</button>
        </form>
      </div>
    </div>
  );
}

export default Welcome;
