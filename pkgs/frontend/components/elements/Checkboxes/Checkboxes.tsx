import { Checkmark16Filled } from '@fluentui/react-icons';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

export type CheckboxesProps = {
    disabled?: boolean;
    isChecked?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;

    layout?: 'Rectangle' | 'Circular';
    Indeterminate?: boolean;
    labelVis?: boolean;
    label: string;
    required?: boolean;
}

const Checkboxes: FC<CheckboxesProps> = ({
    disabled = false, isChecked = false, label = 'Label', onClick,
    layout = 'Rectangle', Indeterminate = false, labelVis = true, required = false }) => {

    return (
        <button disabled={disabled} onClick={onClick} className='w-full group block rounded'>
            <div className={`rounded space-x-2 flex flex-row place-items-center ${disabled && 'text-Neutral-Foreground-Disabled-Rest'}`}>
                <div className={`rounded-full p-2 ${!isChecked && 'bg-Neutral-Background-Subtle-Rest group-hover:bg-Neutral-Background-Subtle-Hover group-active:bg-Neutral-Background-Subtle-Pressed'}`}>
                    <div className={`aspect-square size-5 flex place-items-center justify-center border
                     ${disabled && Indeterminate || disabled && !isChecked ? 'border-Neutral-Foreground-Disabled-Rest'
                            : disabled && isChecked && !Indeterminate ? 'border-none bg-Neutral-Foreground-Disabled-Rest'
                                : isChecked && !Indeterminate ? 'border-none bg-Primary-Background-Compound-Rest group-hover:bg-Primary-Background-Compound-Hover group-active:bg-Primary-Background-Compound-Pressed'
                                    : !isChecked ? 'border-Neutral-Foreground-1-Rest'
                                        : 'border-Primary-Background-Compound-Rest group-hover:border-Primary-Background-Compound-Hover group-active:border-Primary-Background-Compound-Pressed'}
                        ${layout == 'Circular' ? 'rounded-full' : 'rounded'}`}>
                        {/* 中マドの方法 */}
                        <span className={`${isChecked && !Indeterminate ? 'flex text-Neutral-Foreground-OnPrimary-Rest' : 'hidden'}`}><Checkmark16Filled /></span>
                        <div className={`size-3 ${disabled ? 'bg-Neutral-Foreground-Disabled-Rest' : 'bg-Primary-Background-Compound-Rest group-hover:bg-Primary-Background-Compound-Hover group-active:bg-Primary-Background-Compound-Pressed'} ${isChecked && Indeterminate ? 'block' : 'hidden'} ${layout == 'Circular' ? 'rounded-full' : 'rounded-sm'} `} />
                    </div>
                </div>
                <div className=' space-x-1.5 pr-2 text-LabelLarge'>
                    <span>{label}</span>
                    <span className={`${!disabled && 'text-Status-Danger-Foreground-1-Rest'} ${required ? 'inline-block' : 'hidden'}`}>*</span>
                </div>
            </div>
        </button>
    );
};

export default Checkboxes;
