import {useFormik} from 'formik'
import {useRecoilState, useRecoilValue} from 'recoil'
import {useContext} from 'react'

import {Dropdown} from 'primereact/dropdown'
import {InputText} from 'primereact/inputtext'
import {MainContext} from '../../contexts/MainContext'
import {InputTextarea} from 'primereact/inputtextarea'
import {Button} from 'primereact/button'

import recoilForm from '../../recoil/recoilForm'
import recoilConfig from "../../recoil/recoilConfig";
import {VALIDATIONS} from '../../data/constants'
import FormOptions from './FormOptions.jsx'
import scrollIntoViewWithOffset from "../../services/scrollIntoViewWithOffset";
import {col} from '../../services/buttstrip'

let formikSubmitClicked = false

export default function FormNaw({optionalFees, onFormSubmit, options, setOptions, available}) {
  const config = useRecoilValue(recoilConfig)
  const [form] = useRecoilState(recoilForm)
  const context = useContext(MainContext)
  const _t = context._t()

  const formik = useFormik({

    initialValues: form,

    validate: (data) => {

      let errors = {}
      Object.keys(data).forEach(name => {
        if (!name.startsWith('option_')) {
          if (!data[name] && name !== 'extra_message') {
            // Mandatory fields
            errors[name] = `${_t.page_form.naw[name]}`
          } else if (VALIDATIONS[name] && !VALIDATIONS[name].test(data[name])) {
            // Field validation
            errors[name] = _t.page_form.label.is_wrong.replace('{placeholder}', _t.page_form.naw[name].toLowerCase())
          }
        }
      })

      /**
       * Jesus Christ, some shit here, really can not find another trick to pull this one.
       * This one fires on submit once, and not a million times when a user is
       * typing. For now... Formik SUCKS.
       */
      if (formikSubmitClicked) {
        formikSubmitClicked = false
        const first = Object.keys(errors)[0]
        if (first) {
          const field = context.shadowRoot.querySelector(`[name=${first}]`)
          scrollIntoViewWithOffset(field, config.offset + 32, config.scroll)
          if (field.tagName === 'INPUT') {
            setTimeout(() => {
              field.focus()
            }, 500)
          }
        }
      }
      return errors
    },
    onSubmit: (data) => {
      onFormSubmit(data)
    }
  })

  const getFormErrorMessage = (name) => {
    return (formik.touched[name] && formik.errors[name]) ?
      <small className='p-error'>{formik.errors[name]}</small> :
      <small className='p-error'> </small>
  }

  const myInput = (name) => {
    return <label className='input-label'>
      <span>{_t.page_form.naw[name]}</span>
      <InputText
        name={name}
        value={formik.values[name]}
        onChange={(e) => {
          formik.setFieldValue(name, e.target.value, false)
        }}
        placeholder={_t.page_form.placeholder[name]}/>
      {getFormErrorMessage(name)}
    </label>
  }

  return <>
    <form onSubmit={(e) => {
      formikSubmitClicked = true
      formik.handleSubmit(e)
    }}>
      <div className='grid'>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('first_name')}
        </div>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('last_name')}
        </div>
      </div>
      <div className='grid'>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('email')}
        </div>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('phone_number')}
        </div>
      </div>
      <div className='grid'>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('zip_code')}
        </div>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('house_number')}
        </div>
      </div>
      <div className='grid'>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('street')}
        </div>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          {myInput('city')}
        </div>
      </div>
      <div className='grid'>
        <div className={col({xl: 3, lg: 4, md: 5, sm: 6, xs: 12})}>
          <label className='input-label'>
            <span>{_t.page_form.naw.country}</span>
            <Dropdown
              id="country"
              name="country"

              value={formik.values.country}
              onChange={(e) => formik.setFieldValue('country', e.value, false)}
              options={_t.countries}
              placeholder={_t.page_form.placeholder.country}/>
            {getFormErrorMessage('country')}
          </label>
        </div>
      </div>

      <div className='grid'>
        <div className={col({xl: 6, lg: 8, md: 10, sm: 12})}>
          <label className='input-label'>
            <div className='label'>
              {_t.page_form.labels.extra_info_1} <span
              className='text-secondary'>{_t.page_form.labels.extra_info_2}</span>
            </div>
            <InputTextarea
              name='extra_message'
              value={formik.values.extra_message}
              onChange={(e) => formik.setFieldValue('extra_message', e.target.value, false)}
              rows={4}
            />
          </label>
        </div>
      </div>

      {(optionalFees.length > 0) && <FormOptions
        optionalFees={optionalFees}
        options={options}
        setOptions={setOptions}
      />}

      <div className='grid pt-8'>
        <div className='col'>
          <div className='flex'>
            <div className='mr-4'>
              <Button type='submit'
                      disabled={!available}
                      label={_t.labels.confirm_booking}
                      icon='pi pi-arrow-right'
                      iconPos='right'/>
            </div>
            <div className='pt-4 pl-2'>
              {_t.page_form.labels.privacy_1} <a rel='noreferrer' href={_t.page_form.labels.privacy_path}
                                                 target='_blank'>{_t.page_form.labels.privacy_2}</a>
            </div>
          </div>
        </div>
      </div>
    </form>
  </>

}
