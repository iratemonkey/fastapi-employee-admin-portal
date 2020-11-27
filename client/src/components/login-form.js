import React from 'react'
import { ErrorMessage } from './lib'
import { Form, Button, Col, Spinner } from 'react-bootstrap'
import { useAsync } from '../hooks/useAsync'
import { Formik } from 'formik'
import { object, string } from 'yup'

const schema = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Please enter a valid email address'),
  password: string()
    .min(4)
    .required('Please enter a password of at least 4 characters'),
})

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
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik01">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks Good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik02">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
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
