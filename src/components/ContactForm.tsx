'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import SectionWrapper from './SectionWrapper';
import Button from './Button';

interface IFormInput {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = data => {
    // This is a dummy handler. In a real application, you would send this to a backend service or Netlify/Vercel forms.
    alert(`Form submitted!\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`);
  };

  const inputClasses = "w-full p-3 bg-ctp-surface0 border-2 border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-mauve focus:border-transparent transition-colors";
  const errorClasses = "text-ctp-red mt-1 text-sm";

  return (
    <SectionWrapper id="contact" title="Get In Touch">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-ctp-subtext1 mb-2">Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={inputClasses}
            />
            {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-ctp-subtext1 mb-2">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required', 
                pattern: { value: /\S+@\S+\.\S+/, message: 'Entered value does not match email format' }
              })}
              className={inputClasses}
            />
            {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-ctp-subtext1 mb-2">Message</label>
            <textarea
              id="message"
              rows={5}
              {...register('message', { required: 'Message is required' })}
              className={inputClasses}
            />
            {errors.message && <p className={errorClasses}>{errors.message.message}</p>}
          </div>
          <div className="text-center">
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      </div>
    </SectionWrapper>
  );
};

export default ContactForm;
