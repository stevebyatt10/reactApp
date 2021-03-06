import { Button, Form } from 'react-bootstrap';
import {  useState } from 'react';
import axios from 'axios';
import {  useFormik  } from 'formik';
import * as Yup from 'yup'

export default function Signup({ signedUP }) {
  const [duplicateEmails, setDuplicateEmails] = useState([]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confPassword: '',
      terms: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Please provide a valid email address').required('Email is required').notOneOf(duplicateEmails, "A user with this email already exists "),
      password: Yup.string().required('Password is required').matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special Character"
      ),
      confPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords do not match').required("Please confirm the password"),
      terms: Yup.bool().required().oneOf([true], "You must agree before submitting")
    }),
    onSubmit: values => {
      axios.post('/api/users', {
      email: values.email,
      password: values.password
    })
      .then((res) => {
        signedUP(res.data);
      })
      .catch((error) => {
        console.log(JSON.stringify(error.response, null, 2))

        setDuplicateEmails(duplicateEmails.concat(error.response.data.email))
        console.log(duplicateEmails)
        formik.validateField('email')
      })
    }
  });

  return (
    <div className="App mt-5">

      <Form noValidate onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            id="email"
            type="email"
            {...formik.getFieldProps('email')}
            isInvalid={formik.touched.email &&formik.errors.email}
            />
          <Form.Control.Feedback type="invalid">
            {
            formik.errors.email
            }

            {
              formik.errors.email === "A user with this email already exists " ? <div>
              <a href="/login">Login here</a> </div> : null
            }
         
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            {...formik.getFieldProps('password')}
            isInvalid={formik.touched.password && formik.errors.password}
            />
          <Form.Control.Feedback type="invalid">
            {
            formik.errors.password
            }
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confPassword"
            {...formik.getFieldProps('confPassword')}
            isInvalid={formik.touched.confPassword && formik.errors.confPassword}
            />

          <Form.Control.Feedback type="invalid">
            {
            formik.errors.confPassword
            }
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group >
          <Form.Check
            type="checkbox"
            id="terms"
            {...formik.getFieldProps('terms')}
            isInvalid={formik.touched.terms && formik.errors.terms}
            label="I agree to the terms and conditions"
            feedback={formik.errors.terms}
          />
        </Form.Group>

        <div className="center-item">
          <Button variant="primary" type="submit">
            Sign up
        </Button>
        </div>
      </Form>
    </div>)

}
