import React from 'react'
import { ErrorMessage } from './lib'
import { Form, Button, Spinner } from 'react-bootstrap'
import { useAsync } from '../hooks/useAsync'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { capitalize } from '../utils/string'

const schema = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Please enter a valid email address'),
  password: string()
    .min(4)
    .required('Please enter a password of at least 4 characters'),
})

function FormGroup({ touched, values, errors, type, name, onChange }) {
  return (
    <Form.Group controlId={`validationFormik${name}`}>
      <Form.Label>{capitalize(name)}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        placeholder={name}
        value={values[name]}
        onChange={onChange}
        isValid={touched[name] && !errors[name]}
        isInvalid={touched[name] && !!errors[name]}
      />
      <Form.Control.Feedback type="invalid">
        {errors[name]}
      </Form.Control.Feedback>
      <Form.Control.Feedback>Looks Good!</Form.Control.Feedback>
    </Form.Group>
  )
}

function LoginForm({ onSubmit, handleToggleForm, formState }) {
  const { isLoading, isError, error, run } = useAsync()
  const formType = formState === 'Login' ? 'Register' : 'Login'

  function handleSubmit(email, password) {
    if (email && password) {
      run(
        onSubmit({
          email,
          password,
        }),
      )
    }
  }

  return (
    <div className="form-wrapper">
      <h2>{formState}</h2>
      <Formik
        validationSchema={schema}
        onSubmit={values => handleSubmit(values.email, values.password)}
        initialValues={{
          email: '',
          password: '',
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <FormGroup
              values={values}
              touched={touched}
              errors={errors}
              name="email"
              type="text"
              onChange={handleChange}
            />
            <FormGroup
              values={values}
              touched={touched}
              errors={errors}
              name="password"
              type="password"
              onChange={handleChange}
            />
            <Button className="mb-2" variant="primary" type="submit" block>
              {formState}{' '}
              {isLoading ? (
                <Spinner className="" animation="border" size="sm" />
              ) : null}
            </Button>
          </Form>
        )}
      </Formik>
      {isError ? <ErrorMessage error={error} /> : null}
      <Button onClick={handleToggleForm} variant="outline-secondary" block>
        {formType}
      </Button>
    </div>
  )
}

export default LoginForm
