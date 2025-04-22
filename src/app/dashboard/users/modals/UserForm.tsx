import {
  createUserSchema,
  TCreateUser,
  TUpdateUser,
  updateUserSchema
} from '@/schemas/user';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';

interface UserFormProps {
  initialValues?: Partial<TCreateUser | TUpdateUser>;
  onSubmitMutation: (data: TCreateUser | TUpdateUser) => Promise<void>;
  title: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmitMutation,
  title
}) => {
  const resolver = zodResolver(
    initialValues ? updateUserSchema : createUserSchema
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<TCreateUser | TUpdateUser>({
    resolver,
    defaultValues: initialValues || {}
  });

  const onSubmit = async (data: TCreateUser | TUpdateUser) => {
    try {
      await onSubmitMutation(data);
    } catch (error: unknown) {
      const isAxiosErrorWithValidMessage =
        error instanceof AxiosError &&
        error?.message &&
        error?.response?.status !== 401;
      if (isAxiosErrorWithValidMessage) {
        setError('root', {
          type: 'server',
          message: error.response?.data?.message || error.message
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Operation failed. Please try again.'
        });
      }
    }
  };

  return (
    <motion.div
      className='p-4 min-w-[360px]'
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <h2 className='text-xl font-bold mb-4'>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <input
          {...register('name')}
          placeholder='Name'
          className='border  p-2'
        />
        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        {!initialValues && (
          <input
            {...register('email')}
            placeholder='Email'
            className='border p-2'
          />
        )}
        {(errors as FieldErrors<TCreateUser>).email && (
          <p className='text-red-500'>
            {(errors as FieldErrors<TCreateUser>).email?.message}
          </p>
        )}
        {/* Only show password field when creating a new user */}
        {!initialValues && (
          <>
            <input
              {...register('password')}
              type='password'
              placeholder='Password'
              className='border  p-2'
            />
            {(errors as FieldErrors<TCreateUser>).password && (
              <p className='text-red-500'>
                {(errors as FieldErrors<TCreateUser>).password?.message}
              </p>
            )}
          </>
        )}
        <input
          {...register('age', { valueAsNumber: true })}
          type='number'
          defaultValue={initialValues?.age || 18}
          placeholder='Age'
          className='border p-2'
          required={false}
        />
        {errors.age && <p className='text-red-500'>{errors.age.message}</p>}
        <button
          type='submit'
          className='bg-green-500 text-white px-4 py-2 rounded'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : title}
        </button>
        {errors.root && (
          <p className='text-red-500 mt-2'>{errors.root.message}</p>
        )}
      </form>
    </motion.div>
  );
};

export default UserForm;
