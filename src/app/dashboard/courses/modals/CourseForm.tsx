import { createCourseSchema, TCreateCourseData } from '@/schemas/course';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';

const DEFAULT_VALUES: TCreateCourseData = {
    title: '',
    description: '',
    isActive: true
};

interface CourseFormProps {
    initialValues?: Partial<TCreateCourseData>;
    onSubmitMutation: (data: TCreateCourseData) => Promise<void>;
    title: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
    initialValues,
    onSubmitMutation,
    title
}) => {
    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting }
    } = useForm<TCreateCourseData>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            ...DEFAULT_VALUES,
            ...initialValues
        }
    });

    const onSubmit = async (data: TCreateCourseData) => {
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
                    {...register('title')}
                    placeholder='Course Title'
                    className='border p-2'
                />
                {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

                <textarea
                    {...register('description')}
                    placeholder='Course Description'
                    className='border p-2 h-24'
                />
                {errors.description && (
                    <p className='text-red-500'>{errors.description.message}</p>
                )}

                <div className='flex items-center gap-2 my-2'>
                    <label className='flex items-center '>
                        <div className='relative'>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <input
                                            type='checkbox'
                                            onChange={onChange}
                                            checked={value}
                                            className='sr-only peer cursor-pointer'
                                        />
                                        <div className='block cursor-pointer bg-gray-200 w-14 h-8 rounded-full peer-checked:bg-green-200'></div>
                                        <div className='dot cursor-pointer absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform peer-checked:translate-x-6'></div>
                                    </>
                                )}
                            />
                        </div>
                        <span className='ml-3 text-gray-700'>Active Course</span>
                    </label>
                </div>

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

export default CourseForm; 